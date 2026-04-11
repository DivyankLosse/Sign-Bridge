"""
Text/Speech to Sign Language Translation Routes

Provides endpoints for converting text and speech transcriptions
to Indian Sign Language (ISL) animation sequences.
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import List, Optional

from app.text_to_sign.mapper import get_animation_paths, refresh_animations_cache, AVAILABLE_ANIMATIONS
from app.text_to_sign.speech_processor import process_text_for_sign, get_animation_urls

router = APIRouter(
    prefix="/translate",
    tags=["text_to_sign"]
)


# ============== Request/Response Models ==============

class TextInput(BaseModel):
    """Request model for simple text translation."""
    text: str = Field(..., min_length=1, max_length=1000, description="Text to translate")


class SpeechInput(BaseModel):
    """Request model for speech transcription translation."""
    transcription: str = Field(..., min_length=1, max_length=1000, description="Speech transcription")
    language: Optional[str] = Field(default="en-IN", description="Language code for speech")


class AnimationResponse(BaseModel):
    """Response model for text translation."""
    animations: List[str]
    word_count: int


class SpeechToSignResponse(BaseModel):
    """Response model for speech-to-sign translation with full details."""
    animations: List[str] = Field(description="List of animation URLs to play")
    original_text: str = Field(description="Original input text")
    processed_words: List[str] = Field(description="Words after NLP processing")
    word_count: int = Field(description="Number of processed words")


class AvailableAnimationsResponse(BaseModel):
    """Response model listing available animations."""
    animations: List[str]
    count: int


# ============== Endpoints ==============

@router.post("/text", response_model=AnimationResponse)
def translate_text_to_sign(input_data: TextInput):
    """
    Translate simple text to sign language animations.
    
    Uses basic word matching without NLP processing.
    For full speech processing, use /translate/speech endpoint.
    """
    animations = get_animation_paths(input_data.text)
    
    return {
        "animations": animations,
        "word_count": len(input_data.text.split())
    }


@router.post("/speech", response_model=SpeechToSignResponse)
def translate_speech_to_sign(input_data: SpeechInput):
    """
    Translate speech transcription to sign language animations.
    
    This endpoint uses full NLP processing including:
    - Tokenization and POS tagging
    - Tense detection with appropriate markers
    - Stopword removal
    - Lemmatization
    - Character fallback for unknown words
    """
    # Ensure animations cache is populated
    if not AVAILABLE_ANIMATIONS:
        refresh_animations_cache()
    
    # Process text using NLTK
    processed_words = process_text_for_sign(
        input_data.transcription, 
        available_animations=AVAILABLE_ANIMATIONS
    )
    
    # Get animation URLs
    animation_urls = get_animation_urls(processed_words)
    
    return {
        "animations": animation_urls,
        "original_text": input_data.transcription,
        "processed_words": processed_words,
        "word_count": len(processed_words)
    }


@router.get("/animations", response_model=AvailableAnimationsResponse)
def list_available_animations():
    """
    List all available ISL animations.
    
    Returns a list of words/characters that have corresponding
    animation files available.
    """
    animations = refresh_animations_cache()
    
    # Return unique, sorted list (avoiding duplicates from case variants)
    unique_animations = sorted(set(
        a for a in animations 
        if a[0].isupper() or (len(a) == 1 and a.isupper())
    ))
    
    return {
        "animations": unique_animations,
        "count": len(unique_animations)
    }


@router.post("/refresh-cache")
def refresh_animation_cache():
    """
    Refresh the animations cache.
    
    Call this endpoint after adding new animation files
    to make them available for translation.
    """
    animations = refresh_animations_cache()
    return {
        "message": "Animation cache refreshed",
        "count": len(animations)
    }
