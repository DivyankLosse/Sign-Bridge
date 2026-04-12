import cv2
import numpy as np
import os
from pathlib import Path

# Paths
BASE_DIR = Path(__file__).resolve().parent.parent
MODEL_PATH = BASE_DIR / "models" / "hand_landmarker.task"

# MediaPipe Initialization (Tasks API)
# Initialize detector once to avoid reloading overhead
detector = None

def get_detector():
    global detector
    if detector is None:
        import mediapipe as mp
        from mediapipe.tasks import python
        from mediapipe.tasks.python import vision
        
        if not MODEL_PATH.exists():
            print(f"ERROR: MediaPipe Task file not found at {MODEL_PATH}")
            return None
        
        base_options = python.BaseOptions(model_asset_path=str(MODEL_PATH))
        options = vision.HandLandmarkerOptions(base_options=base_options,
                                               num_hands=1,
                                               min_hand_detection_confidence=0.5)
        detector = vision.HandLandmarker.create_from_options(options)
    return detector

def extract_landmarks(image_data):
    """
    Expects CV2 image (numpy array).
    Returns normalized feature vector (63 values) or None.
    """
    try:
        landmarker = get_detector()
        if landmarker is None:
            return None

        # Convert to RGB and MediaPipe Image
        frame_rgb = cv2.cvtColor(image_data, cv2.COLOR_BGR2RGB)
        mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=frame_rgb)
        
        # Detect landmarks
        results = landmarker.detect(mp_image)
        
        if not results.hand_landmarks:
            return None
        
        # Extract first hand detected
        hand_landmarks = results.hand_landmarks[0]
        
        # Flatten coordinates (x, y, z) -> [x1, y1, z1, x2, \dots]
        landmarks = []
        for lm in hand_landmarks:
            landmarks.extend([lm.x, lm.y, lm.z])
            
        return np.array(landmarks)
    except Exception as e:
        print(f"Error in extract_landmarks: {e}")
        return None
