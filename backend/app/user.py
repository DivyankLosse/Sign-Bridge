from datetime import datetime, timezone

from fastapi import APIRouter, Depends

from app.auth import get_current_user
from app.database import get_db
from app.schemas import User, UserPreferences, UserProfileUpdate, UserStats

router = APIRouter(prefix="/user", tags=["user"])


def _preferences_collection(db):
    return db.user_preferences


def _estimate_active_minutes(history_items: list[dict]) -> int:
    minute_buckets = set()

    for item in history_items:
        created_at = item.get("created_at")
        if not created_at:
            continue

        bucket = created_at.replace(second=0, microsecond=0)
        minute_buckets.add(bucket)

    return len(minute_buckets)


@router.get("/profile", response_model=User)
def get_profile(current_user: User = Depends(get_current_user)):
    return current_user


@router.put("/profile", response_model=User)
def update_profile(
    payload: UserProfileUpdate,
    current_user: User = Depends(get_current_user),
    db=Depends(get_db),
):
    db.users.update_one(
        {"email": current_user.email},
        {"$set": {"full_name": payload.full_name}},
    )
    updated = db.users.find_one({"email": current_user.email})
    return User(
        id=str(updated["_id"]),
        email=updated["email"],
        full_name=updated.get("full_name") or "Signer",
        is_active=updated.get("is_active", True),
        created_at=updated["created_at"],
    )


@router.get("/preferences", response_model=UserPreferences)
def get_preferences(
    current_user: User = Depends(get_current_user),
    db=Depends(get_db),
):
    document = _preferences_collection(db).find_one({"user_id": current_user.id})
    if not document:
        return UserPreferences()
    return UserPreferences(**document.get("preferences", {}))


@router.put("/preferences", response_model=UserPreferences)
def update_preferences(
    payload: UserPreferences,
    current_user: User = Depends(get_current_user),
    db=Depends(get_db),
):
    _preferences_collection(db).update_one(
        {"user_id": current_user.id},
        {
            "$set": {
                "user_id": current_user.id,
                "preferences": payload.dict(),
                "updated_at": datetime.now(timezone.utc),
            }
        },
        upsert=True,
    )
    return payload


@router.get("/stats", response_model=UserStats)
def get_stats(
    current_user: User = Depends(get_current_user),
    db=Depends(get_db),
):
    history_items = list(db.history.find({"user_id": current_user.id}))
    total = len(history_items)
    average_confidence = (
        sum(float(item.get("confidence", 0)) for item in history_items) / total if total else 0.0
    )
    active_time_minutes = _estimate_active_minutes(history_items)
    return UserStats(
        total_translations=total,
        active_time_minutes=active_time_minutes,
        accuracy_rate=round(average_confidence * 100, 2),
    )
