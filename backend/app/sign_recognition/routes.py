from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from app.auth.routes import get_current_user
from app.database import get_db
from app.sign_recognition.predict import predict_asl
from datetime import datetime, timezone

router = APIRouter(
    prefix="/predict",
    tags=["sign_prediction"]
)

class ImageInput(BaseModel):
    frame: str # Base64 encoded

@router.post("/sign")
def recognize_sign(input_data: ImageInput, current_user: dict = Depends(get_current_user), db = Depends(get_db)):
    result = predict_asl([input_data.frame])
    
    if result.get("error"):
        raise HTTPException(status_code=400, detail=result["error"])
        
    # Save to history
    if result.get("prediction"):
        history_entry = {
            "user_id": current_user["_id"],
            "input_type": "sign",
            "output_text": result["prediction"],
            "confidence": result.get("confidence", 0.0),
            "created_at": datetime.now(timezone.utc)
        }
        db.history.insert_one(history_entry)
    
    return result
