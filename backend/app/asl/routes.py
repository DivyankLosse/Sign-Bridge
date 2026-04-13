from fastapi import APIRouter
from app.asl.predict import predict_sign

router = APIRouter()

@router.post("/predict")
def predict(data: dict):
    return predict_sign(data.get("features", []))
