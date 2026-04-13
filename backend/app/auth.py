import base64
import hashlib
import hmac
import json
import secrets
import time
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, Header, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm

from app.config import settings
from app.database import get_db
from app.schemas import Token, User, UserCreate

router = APIRouter()


def _users_collection(db):
    return db.users


def _b64url_encode(raw: bytes) -> str:
    return base64.urlsafe_b64encode(raw).rstrip(b"=").decode("ascii")


def _b64url_decode(value: str) -> bytes:
    padding = "=" * (-len(value) % 4)
    return base64.urlsafe_b64decode(value + padding)


def _hash_password(password: str, salt: str | None = None) -> str:
    salt = salt or secrets.token_hex(16)
    iterations = 100_000
    digest = hashlib.pbkdf2_hmac(
        "sha256",
        password.encode("utf-8"),
        salt.encode("utf-8"),
        iterations,
    )
    return f"pbkdf2_sha256${iterations}${salt}${digest.hex()}"


def _verify_password(password: str, stored_hash: str) -> bool:
    try:
        scheme, iterations, salt, digest = stored_hash.split("$", 3)
    except ValueError:
        return False

    if scheme != "pbkdf2_sha256":
        return False

    candidate = hashlib.pbkdf2_hmac(
        "sha256",
        password.encode("utf-8"),
        salt.encode("utf-8"),
        int(iterations),
    ).hex()
    return hmac.compare_digest(candidate, digest)


def _create_access_token(email: str) -> str:
    payload = {
        "sub": email,
        "exp": int(time.time()) + settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
    }
    payload_bytes = json.dumps(payload, separators=(",", ":")).encode("utf-8")
    payload_b64 = _b64url_encode(payload_bytes)
    signature = hmac.new(
        settings.SECRET_KEY.encode("utf-8"),
        payload_b64.encode("utf-8"),
        hashlib.sha256,
    ).digest()
    return f"{payload_b64}.{_b64url_encode(signature)}"


def _decode_access_token(token: str) -> dict:
    try:
        payload_b64, signature_b64 = token.split(".", 1)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token") from exc

    expected_signature = hmac.new(
        settings.SECRET_KEY.encode("utf-8"),
        payload_b64.encode("utf-8"),
        hashlib.sha256,
    ).digest()
    provided_signature = _b64url_decode(signature_b64)
    if not hmac.compare_digest(expected_signature, provided_signature):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token signature")

    payload = json.loads(_b64url_decode(payload_b64))
    if payload.get("exp", 0) < int(time.time()):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token expired")
    return payload


def _serialize_user(document: dict) -> User:
    return User(
        id=str(document["_id"]),
        email=document["email"],
        full_name=document.get("full_name") or "Signer",
        is_active=document.get("is_active", True),
        created_at=document["created_at"],
    )


async def _current_user(
    authorization: str = Header(default=""),
    db=Depends(get_db),
) -> User:
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing bearer token")

    token = authorization.split(" ", 1)[1]
    payload = _decode_access_token(token)
    user = _users_collection(db).find_one({"email": payload["sub"]})
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    return _serialize_user(user)


@router.post("/signup", response_model=User, status_code=status.HTTP_201_CREATED)
def signup(payload: UserCreate, db=Depends(get_db)):
    users = _users_collection(db)
    existing = users.find_one({"email": payload.email})
    if existing:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already registered")

    now = datetime.now(timezone.utc)
    user_doc = {
        "email": payload.email,
        "full_name": payload.full_name,
        "password_hash": _hash_password(payload.password),
        "is_active": True,
        "created_at": now,
    }
    result = users.insert_one(user_doc)
    user_doc["_id"] = result.inserted_id
    return _serialize_user(user_doc)


@router.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db=Depends(get_db)):
    users = _users_collection(db)
    user = users.find_one({"email": form_data.username})
    if not user or not _verify_password(form_data.password, user.get("password_hash", "")):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")

    return Token(access_token=_create_access_token(user["email"]), token_type="bearer")


@router.get("/me", response_model=User)
def me(current_user: User = Depends(_current_user)):
    return current_user
