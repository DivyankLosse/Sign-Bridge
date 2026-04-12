from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from datetime import timedelta, datetime, timezone
from jose import JWTError, jwt

from app import schemas
from app.database import get_db
from app.auth import utils
from app.config import settings

router = APIRouter(
    prefix="/auth",
    tags=["authentication"]
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

import asyncio

@router.post("/register", response_model=schemas.User)
@router.post("/signup", response_model=schemas.User)
async def register_user(user: schemas.UserCreate, db = Depends(get_db)):
    # Offload blocking Mongo lookup to thread
    db_user = await asyncio.to_thread(db.users.find_one, {"email": user.email})
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Hash password in thread (computationally expensive)
    hashed_password = await asyncio.to_thread(utils.get_password_hash, user.password)
    
    now = datetime.now(timezone.utc)
    new_user = {
        "email": user.email,
        "hashed_password": hashed_password,
        "full_name": user.full_name,
        "is_active": True,
        "created_at": now,
        "updated_at": now
    }
    
    # Offload blocking insert
    result = await asyncio.to_thread(db.users.insert_one, new_user)
    new_user["id"] = str(result.inserted_id)
    return new_user

@router.post("/login", response_model=schemas.Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db = Depends(get_db)):
    # Offload lookup
    user = await asyncio.to_thread(db.users.find_one, {"email": form_data.username})
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Offload verify
    is_valid = await asyncio.to_thread(utils.verify_password, form_data.password, user.get("hashed_password", ""))
    if not is_valid:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = utils.create_access_token(
        data={"sub": user["email"]}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

async def get_current_user(token: str = Depends(oauth2_scheme), db = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        # JWT decode is fast/CPU bound, usually okay in async loop if not extreme
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        token_data = schemas.TokenData(email=email)
    except JWTError:
        raise credentials_exception
        
    # Offload lookup
    user = await asyncio.to_thread(db.users.find_one, {"email": token_data.email})
    if user is None:
        raise credentials_exception
    user["id"] = str(user["_id"])
    return user

@router.get("/me", response_model=schemas.User)
async def read_users_me(current_user: dict = Depends(get_current_user)):
    return current_user
