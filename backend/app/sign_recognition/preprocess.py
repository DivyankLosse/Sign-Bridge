import cv2
import mediapipe as mp
import numpy as np

mp_hands = mp.solutions.hands
hands = mp_hands.Hands(static_image_mode=True, max_num_hands=1, min_detection_confidence=0.5)

def extract_landmarks(image_data):
    """
    Expects CV2 image (numpy array).
    Returns normalized feature vector (63 values) or None.
    """
    results = hands.process(cv2.cvtColor(image_data, cv2.COLOR_BGR2RGB))
    
    if not results.multi_hand_landmarks:
        return None
    
    # Extract first hand detected
    hand_landmarks = results.multi_hand_landmarks[0]
    
    # Flatten coordinates (x, y, z) -> [x1, y1, z1, x2, \dots]
    landmarks = []
    for lm in hand_landmarks.landmark:
        landmarks.extend([lm.x, lm.y, lm.z])
        
    return np.array(landmarks)
