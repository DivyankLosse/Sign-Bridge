from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.auth.routes import get_current_user
from app.database import get_db
from app.sign_recognition.predict import predict_sign
from app import models

router = APIRouter(
    prefix="/predict",
    tags=["sign_prediction"]
)

class ImageInput(BaseModel):
    frame: str # Base64 encoded

@router.post("/sign")
def recognize_sign(input_data: ImageInput, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    result = predict_sign(input_data.frame)
    
    if result.get("error"):
        raise HTTPException(status_code=400, detail=result["error"])
        
    # Save to history
    if result.get("prediction"):
        history_entry = models.TranslationHistory(
            user_id=current_user.id,
            input_type="sign",
            output_text=result["prediction"],
            confidence=result.get("confidence", 0.0)
        )
        db.add(history_entry)
        db.commit()
    
    return result
