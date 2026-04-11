from fastapi import APIRouter, Depends, HTTPException, Query
from typing import List, Optional
from app.database import get_db
from app.auth.routes import get_current_user
from pydantic import BaseModel, ConfigDict
from datetime import datetime
from bson import ObjectId

router = APIRouter(
    prefix="/history",
    tags=["history"]
)

class HistoryItemResponse(BaseModel):
    id: str
    input_type: str
    output_text: str
    confidence: Optional[float]
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)

class HistoryListResponse(BaseModel):
    total: int
    items: List[HistoryItemResponse]

@router.get("/", response_model=HistoryListResponse)
def get_history(
    skip: int = 0, 
    limit: int = 50, 
    current_user: dict = Depends(get_current_user), 
    db = Depends(get_db)
):
    query = {"user_id": current_user["_id"]}
    total = db.history.count_documents(query)
    
    cursor = db.history.find(query).sort("created_at", -1).skip(skip).limit(limit)
    items = []
    for item in cursor:
        item["id"] = str(item["_id"])
        items.append(item)
        
    return {"total": total, "items": items}

@router.delete("/{history_id}")
def delete_history_item(
    history_id: str, 
    current_user: dict = Depends(get_current_user), 
    db = Depends(get_db)
):
    if not ObjectId.is_valid(history_id):
        raise HTTPException(status_code=400, detail="Invalid history ID")

    result = db.history.delete_one({
        "_id": ObjectId(history_id),
        "user_id": current_user["_id"]
    })
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="History item not found")
        
    return {"message": "History item deleted"}
