import re
from pathlib import Path
from urllib.parse import quote

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.config import settings
from app.schemas import TextTranslateResponse

router = APIRouter(prefix="/translate", tags=["translate"])

TOKEN_PATTERN = re.compile(r"[A-Za-z0-9']+")


class TextTranslateRequest(BaseModel):
    text: str


class SpeechTranslateRequest(BaseModel):
    transcription: str
    language: str | None = None


def _animations_dir() -> Path:
    return Path(settings.ANIMATIONS_PATH)


def _available_animation_map() -> dict[str, str]:
    animations_dir = _animations_dir()
    if not animations_dir.exists():
        return {}

    available: dict[str, str] = {}
    for file in animations_dir.glob("*.mp4"):
        available[file.stem.lower()] = file.stem
    return available


def _build_animation_url(label: str) -> str:
    return f"/static/animations/{quote(label)}.mp4"


def _tokenize_text(text: str) -> list[str]:
    return TOKEN_PATTERN.findall(text or "")


def _expand_token(token: str, available: dict[str, str]) -> list[str]:
    normalized = token.strip().lower()
    if not normalized:
        return []

    if normalized in available:
        return [available[normalized]]

    expanded: list[str] = []
    for char in normalized:
        if char in available:
            expanded.append(available[char])
    return expanded


def _translate_text_to_labels(text: str) -> list[str]:
    available = _available_animation_map()
    labels: list[str] = []

    for token in _tokenize_text(text):
        labels.extend(_expand_token(token, available))

    return labels


@router.get("/animations")
def get_available_animations():
    available = sorted(_available_animation_map().values())
    return {
        "count": len(available),
        "animations": available,
    }


@router.post("/text", response_model=TextTranslateResponse)
def translate_text(payload: TextTranslateRequest):
    text = payload.text.strip()
    if not text:
        raise HTTPException(status_code=400, detail="Text is required")

    labels = _translate_text_to_labels(text)
    result = " ".join(labels)
    return {
        "original_text": text,
        "processed_words": labels,
        "animations": [_build_animation_url(label) for label in labels],
        "result": result,
    }


@router.post("/speech")
def translate_speech(payload: SpeechTranslateRequest):
    transcription = payload.transcription.strip()
    if not transcription:
        raise HTTPException(status_code=400, detail="Transcription is required")

    labels = _translate_text_to_labels(transcription)
    return {
        "original_text": transcription,
        "processed_words": labels,
        "animations": [_build_animation_url(label) for label in labels],
        "language": payload.language or "en-IN",
    }
