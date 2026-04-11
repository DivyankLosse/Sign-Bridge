from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import List
from app.auth.routes import get_current_user
from app.nlp_correction.grammar_corrector import grammar_corrector

router = APIRouter(
    prefix="/nlp",
    tags=["nlp_correction"]
)

class CorrectionRequest(BaseModel):
    text: str

class CorrectionResponse(BaseModel):
    original: str
    corrected: str

class BatchCorrectionRequest(BaseModel):
    texts: List[str]

class BatchCorrectionResponse(BaseModel):
    results: List[CorrectionResponse]

@router.post("/correct", response_model=CorrectionResponse)
def correct_text(req: CorrectionRequest):
    corrected = grammar_corrector.correct(req.text)
    return {"original": req.text, "corrected": corrected}

@router.post("/correct-batch", response_model=BatchCorrectionResponse)
def correct_batch(req: BatchCorrectionRequest):
    results = []
    for text in req.texts:
        corrected = grammar_corrector.correct(text)
        results.append({"original": text, "corrected": corrected})
    return {"results": results}
