import os
import sys
from pathlib import Path

# Add app to path
sys.path.append(os.getcwd())

from app.config import settings
from app.text_to_sign.mapper import get_available_animations, get_animation_paths
from app.text_to_sign.speech_processor import process_text_for_sign, get_animation_urls

def check_assets():
    print(f"Current WD: {os.getcwd()}")
    print(f"Config Animations Path: {settings.ANIMATIONS_PATH}")
    
    path = Path(settings.ANIMATIONS_PATH)
    print(f"Abs Path: {path.resolve()}")
    print(f"Exists: {path.exists()}")
    
    if path.exists():
        files = list(path.glob('*.mp4'))
        print(f"Found {len(files)} MP4 files.")
        if len(files) > 0:
            print(f"Example: {files[0].name}")
    
    print("-" * 20)
    
    # Test Mapping
    print("Testing Mapping...")
    available = get_available_animations()
    print(f"Available Animations Count: {len(available)}")
    
    text = "Hello world"
    print(f"Input: {text}")
    
    processed = process_text_for_sign(text, available)
    print(f"Processed: {processed}")
    
    urls = get_animation_urls(processed)
    print(f"URLs: {urls}")

if __name__ == "__main__":
    check_assets()
