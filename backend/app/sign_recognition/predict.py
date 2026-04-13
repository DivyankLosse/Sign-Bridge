import base64
import cv2
import numpy as np
from app.sign_recognition.model_loader import model_loader
from app.sign_recognition.preprocess import extract_landmarks

def decode_image(base64_string):
    """Converts base64 string to OpenCV image"""
    if "," in base64_string:
        base64_string = base64_string.split(",")[1]
    img_data = base64.b64decode(base64_string)
    nparr = np.frombuffer(img_data, np.uint8)
    return cv2.imdecode(nparr, cv2.IMREAD_COLOR)

def predict_asl(base64_frames):
    """
    Simplified ASL-Only Inference Logic:
    - Processes the sequence but only predicts using the latest valid landmarks (ASL Fingerspelling).
    """
    if model_loader.has_error:
        return {"prediction": "MODEL_ERROR", "confidence": 0.0, "landmarks_detected": False}

    if not model_loader.is_ready:
        print("[Predict] Model not ready. Blocking for initialization...")
        model_loader.init_model()
        
    if not model_loader.is_ready:
        return {"prediction": "MODEL_NOT_LOADED", "confidence": 0.0, "landmarks_detected": False}

    if not base64_frames or not isinstance(base64_frames, list):
        return {"prediction": None, "confidence": 0.0, "landmarks_detected": False}

    # 1. Look for landmarks starting from the most recent frame
    last_valid_landmarks = None
    
    # Iterate backwards through frames to find the latest hand
    for base64_image in reversed(base64_frames):
        image = decode_image(base64_image)
        if image is not None:
            landmarks = extract_landmarks(image)
            if landmarks is not None:
                last_valid_landmarks = landmarks
                break # Found the latest hand, stop here
    
    if last_valid_landmarks is None:
        return {"prediction": None, "confidence": 0.0, "landmarks_detected": False}

    # 2. Single Frame Prediction (ASL Fingerspelling)
    asl_input = last_valid_landmarks.reshape(1, 63).astype(np.float32)
    preds = model_loader.predict(asl_input)
    
    if preds is not None:
        idx = np.argmax(preds[0])
        final_pred = model_loader.labels[idx]
        final_conf = float(preds[0][idx])
        
        return {
            "prediction": final_pred,
            "confidence": final_conf,
            "landmarks_detected": True
        }

    return {"prediction": None, "confidence": 0.0, "landmarks_detected": True}
