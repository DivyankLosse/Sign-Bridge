"""
Animation Mapper Module

Maps processed words to available ISL animation files.
Dynamically scans the animations directory to determine availability.
"""

from typing import List, Set
import os
from pathlib import Path
from app.config import settings


def get_available_animations() -> Set[str]:
    """
    Scan the animations directory and return a set of available animation names.
    
    Returns:
        Set of animation names (without .mp4 extension)
    """
    animations_path = Path(settings.ANIMATIONS_PATH)
    
    if not animations_path.exists():
        print(f"Warning: Animations directory not found at {animations_path}")
        return set()
    
    animations = set()
    for file in animations_path.iterdir():
        if file.suffix.lower() == '.mp4':
            # Store without extension, preserving case
            name = file.stem
            animations.add(name)
            # Also add lowercase variant for case-insensitive matching
            animations.add(name.lower())
            animations.add(name.upper())
            animations.add(name.capitalize())
    
    return animations


# Initialize available animations on module load
# This is cached and can be refreshed by calling get_available_animations() again
AVAILABLE_ANIMATIONS: Set[str] = set()


def refresh_animations_cache():
    """
    Refresh the cached set of available animations.
    Call this if new animation files are added at runtime.
    """
    global AVAILABLE_ANIMATIONS
    new_animations = get_available_animations()
    AVAILABLE_ANIMATIONS.clear()
    AVAILABLE_ANIMATIONS.update(new_animations)
    return AVAILABLE_ANIMATIONS


def get_animation_paths(text: str) -> List[str]:
    """
    Convert input text to a list of animation file paths.
    
    This is the original simple implementation kept for backward compatibility.
    For full NLP processing, use speech_processor.process_text_for_sign instead.
    
    Args:
        text: Input text to convert
        
    Returns:
        List of animation URLs
    """
    # Ensure cache is populated
    if not AVAILABLE_ANIMATIONS:
        refresh_animations_cache()
    
    words = text.strip().split()
    paths = []
    
    for word in words:
        word_clean = word.strip('.,!?;:').capitalize()
        
        if word_clean in AVAILABLE_ANIMATIONS:
            paths.append(f"/static/animations/{word_clean}.mp4")
        else:
            # Character fallback for unknown words
            for char in word_clean.upper():
                if char.isalnum() and char in AVAILABLE_ANIMATIONS:
                    paths.append(f"/static/animations/{char}.mp4")
    
    return paths


def is_animation_available(word: str) -> bool:
    """
    Check if an animation exists for a given word.
    
    Args:
        word: The word to check
        
    Returns:
        True if animation exists, False otherwise
    """
    if not AVAILABLE_ANIMATIONS:
        refresh_animations_cache()
    
    return word in AVAILABLE_ANIMATIONS or word.capitalize() in AVAILABLE_ANIMATIONS
