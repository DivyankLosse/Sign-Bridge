from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app import models
from app.database import get_db
from app.auth.routes import get_current_user
from pydantic import BaseModel
from datetime import datetime

router = APIRouter(
    prefix="/history",
    tags=["history"]
)

class HistoryItemResponse(BaseModel):
    id: int
    input_type: str
    output_text: str
    confidence: Optional[float]
    created_at: datetime
    
    class Config:
        from_attributes = True

class HistoryListResponse(BaseModel):
    total: int
    items: List[HistoryItemResponse]

@router.get("/", response_model=HistoryListResponse)
def get_history(
    skip: int = 0, 
    limit: int = 50, 
    current_user: models.User = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    query = db.query(models.TranslationHistory).filter(models.TranslationHistory.user_id == current_user.id)
    total = query.count()
    items = query.order_by(models.TranslationHistory.created_at.desc()).offset(skip).limit(limit).all()
    return {"total": total, "items": items}

@router.delete("/{history_id}")
def delete_history_item(
    history_id: int, 
    current_user: models.User = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    item = db.query(models.TranslationHistory).filter(
        models.TranslationHistory.id == history_id,
        models.TranslationHistory.user_id == current_user.id
    ).first()
    
    if not item:
        raise HTTPException(status_code=404, detail="History item not found")
        
    db.delete(item)
    db.commit()
    return {"message": "History item deleted"}
