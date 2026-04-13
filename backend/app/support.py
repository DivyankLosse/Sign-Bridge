from datetime import datetime, timezone

from fastapi import APIRouter, Depends, status

from app.database import get_db
from app.schemas import SupportRequest, SupportRequestCreate

router = APIRouter(prefix="/support", tags=["support"])


@router.post("", response_model=SupportRequest, status_code=status.HTTP_201_CREATED)
def create_support_request(payload: SupportRequestCreate, db=Depends(get_db)):
    document = {
        "name": payload.name,
        "email": payload.email,
        "message": payload.message,
        "created_at": datetime.now(timezone.utc),
    }
    result = db.support_requests.insert_one(document)
    document["_id"] = result.inserted_id
    return SupportRequest(
        id=str(document["_id"]),
        name=document["name"],
        email=document["email"],
        message=document["message"],
        created_at=document["created_at"],
    )
