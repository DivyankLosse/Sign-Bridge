from datetime import datetime, timezone

from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException, Query, status

from app.auth import get_current_user
from app.database import get_db
from app.schemas import HistoryItem, HistoryItemCreate, HistoryListResponse, User

router = APIRouter()


def _serialize_history(document: dict) -> HistoryItem:
    return HistoryItem(
        id=str(document["_id"]),
        user_id=document["user_id"],
        type=document["type"],
        content=document["content"],
        confidence=float(document.get("confidence", 1.0)),
        source=document.get("source"),
        created_at=document["created_at"],
    )


@router.get("/history", response_model=HistoryListResponse)
def list_history(
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=50, ge=1, le=200),
    type: str | None = Query(default=None),
    current_user: User = Depends(get_current_user),
    db=Depends(get_db),
):
    query = {"user_id": current_user.id}
    if type:
        query["type"] = type

    cursor = (
        db.history.find(query)
        .sort("created_at", -1)
        .skip(skip)
        .limit(limit)
    )
    items = [_serialize_history(item) for item in cursor]
    total = db.history.count_documents(query)
    return HistoryListResponse(items=items, total=total)


@router.post("/history", response_model=HistoryItem, status_code=status.HTTP_201_CREATED)
def create_history(
    payload: HistoryItemCreate,
    current_user: User = Depends(get_current_user),
    db=Depends(get_db),
):
    now = datetime.now(timezone.utc)
    document = {
        "user_id": current_user.id,
        "type": payload.type,
        "content": payload.content,
        "confidence": payload.confidence,
        "source": payload.source,
        "created_at": now,
    }
    result = db.history.insert_one(document)
    document["_id"] = result.inserted_id
    return _serialize_history(document)


@router.delete("/history/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_history(
    item_id: str,
    current_user: User = Depends(get_current_user),
    db=Depends(get_db),
):
    try:
        object_id = ObjectId(item_id)
    except Exception as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid history id") from exc

    result = db.history.delete_one({"_id": object_id, "user_id": current_user.id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="History item not found")
    return None
