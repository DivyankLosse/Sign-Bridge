from fastapi.testclient import TestClient
from app.main import app
from app.text_to_sign.speech_processor import process_text_for_sign, detect_tense
import pytest

client = TestClient(app)

def test_speech_to_sign_endpoint():
    response = client.post("/translate/speech", json={
        "transcription": "Hello world",
        "language": "en-IN"
    })
    assert response.status_code == 200
    data = response.json()
    assert "animations" in data
    assert "original_text" in data
    assert "processed_words" in data
    assert data["original_text"] == "Hello world"
    # Assuming "Hello" and "World" animations exist (either directly or via fallback)
    assert len(data["animations"]) > 0

def test_character_fallback():
    # 'Xylophone' likely has no animation, so it should be spelled out
    # But wait, our mock implementation in `speech_processor.py` depends on AVAILABLE_ANIMATIONS
    # which depends on the file system.
    # In tests, we should mock the availability or check the logic directly.
    
    # Let's test the processor logic with a mock set of available animations
    available = {"Hello", "World", "A", "B", "C"}
    
    # Case 1: Word exists
    words = process_text_for_sign("Hello", available_animations=available)
    assert words == ["Hello"]
    
    # Case 2: Word doesn't exist (fallback to chars)
    words = process_text_for_sign("Cab", available_animations=available)
    # Cab -> C, A, B
    assert words == ["C", "A", "B"]

def test_tense_detection():
    # Past tense
    tagged_past = [("walked", "VBD")]
    assert detect_tense(tagged_past) == "past"
    
    # Future tense
    tagged_future = [("will", "MD"), ("go", "VB")]
    assert detect_tense(tagged_future) == "future"
    
    # Present continuous
    tagged_cont = [("walking", "VBG")]
    assert detect_tense(tagged_cont) == "present_continuous"
    
    # Present
    tagged_present = [("walk", "VBP")]
    assert detect_tense(tagged_present) == "present"

def test_stopword_removal():
    # "is" is a stopword
    available = {"He", "Happy"}
    # "He is happy" -> "He", "Happy" ("is" removed)
    # Note: "He" might be lemmatized or kept. 
    # Let's check logic: is -> stopword.
    
    words = process_text_for_sign("He is happy", available_animations=None) # None skips availability check
    assert "is" not in words
    assert "Is" not in words

def test_lemmatization():
    # "walking" -> "Walk" (v)
    # "better" -> "Good" (a) - WordNet lemmatizer might map better -> good? 
    # Actually 'better' -> 'good' requires more than simple lemmatization.
    # Let's test simpler: "walked" -> "Walk"
    
    words = process_text_for_sign("walked", available_animations=None)
    # Tense "past" -> "Before", "Walk"
    assert "Before" in words
    assert "Walk" in words
