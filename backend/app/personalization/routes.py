from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List
from app.auth.routes import get_current_user
from app.database import get_db
from app.schemas import UserPreferences, UserCorrection, UserStats
from datetime import datetime, timezone

router = APIRouter(
    prefix="/user",
    tags=["personalization"]
)

@router.get("/profile")
def get_profile(current_user: dict = Depends(get_current_user)):
    return {
        "id": getattr(current_user, "id", str(current_user.get("_id", ""))),
        "email": current_user.get("email"),
        "full_name": current_user.get("full_name")
    }

@router.put("/profile")
def update_profile(updates: dict, current_user: dict = Depends(get_current_user), db = Depends(get_db)):
    allowed_updates = {k: v for k, v in updates.items() if k in ["full_name"]}
    if allowed_updates:
        db.users.update_one({"_id": current_user["_id"]}, {"$set": allowed_updates})
    return {"message": "Profile updated successfully"}

@router.get("/preferences", response_model=UserPreferences)
def get_preferences(current_user: dict = Depends(get_current_user), db = Depends(get_db)):
    prefs = db.user_preferences.find_one({"user_id": current_user["_id"]})
    if not prefs:
        prefs = UserPreferences().model_dump()
        prefs["user_id"] = current_user["_id"]
        db.user_preferences.insert_one(prefs)
    return prefs

@router.put("/preferences", response_model=UserPreferences)
def update_preferences(prefs: UserPreferences, current_user: dict = Depends(get_current_user), db = Depends(get_db)):
    prefs_dict = prefs.model_dump()
    db.user_preferences.update_one(
        {"user_id": current_user["_id"]}, 
        {"$set": prefs_dict},
        upsert=True
    )
    return prefs

@router.post("/corrections", response_model=UserCorrection)
def add_correction(correction: dict, current_user: dict = Depends(get_current_user), db = Depends(get_db)):
    new_correction = {
        "user_id": current_user["_id"],
        "original_text": correction.get("original_text", ""),
        "corrected_text": correction.get("corrected_text", ""),
        "created_at": datetime.now(timezone.utc)
    }
    result = db.user_corrections.insert_one(new_correction)
    new_correction["id"] = str(result.inserted_id)
    return new_correction

@router.get("/stats", response_model=UserStats)
def get_user_stats(current_user: dict = Depends(get_current_user), db = Depends(get_db)):
    user_id = current_user["_id"]
    total_translations = db.history.count_documents({"user_id": user_id})
    
    # Calculate average confidence
    pipeline = [
        {"$match": {"user_id": user_id, "confidence": {"$exists": True}}},
        {"$group": {"_id": None, "avg_confidence": {"$avg": "$confidence"}}}
    ]
    result = list(db.history.aggregate(pipeline))
    avg_confidence = result[0]["avg_confidence"] if result else 0.0
    
    # Mock active time calculation based on history entries (2 min each)
    active_time_minutes = total_translations * 2
    
    return UserStats(
        total_translations=total_translations,
        active_time_minutes=active_time_minutes,
        accuracy_rate=avg_confidence * 100
    )
