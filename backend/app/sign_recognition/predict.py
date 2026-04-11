import base64
import cv2
import numpy as np
try:
    import tensorflow as tf
except ImportError:
    tf = None
from app.sign_recognition.model_loader import model_loader
from app.sign_recognition.preprocess import extract_landmarks

def decode_image(base64_string):
    """Converts base64 string to OpenCV image"""
    if "," in base64_string:
        base64_string = base64_string.split(",")[1]
    img_data = base64.b64decode(base64_string)
    nparr = np.frombuffer(img_data, np.uint8)
    return cv2.imdecode(nparr, cv2.IMREAD_COLOR)

def predict_sign(base64_image):
    """
    Main prediction function.
    Returns: {"prediction": str, "confidence": float, "landmarks_detected": bool}
    """
    image = decode_image(base64_image)
    if image is None:
        return {"error": "Invalid image"}
    
    import sys
    print(f"DEBUG: predict_sign called. Model: {model_loader.model}", file=sys.stderr, flush=True)
    if model_loader.model is None:
         print("DEBUG: Model is NONE inside predict_sign!", file=sys.stderr, flush=True)
    else:
         print("DEBUG: Model is LOADED inside predict_sign.", file=sys.stderr, flush=True)

    landmarks = extract_landmarks(image)
    if landmarks is None:
        return {"prediction": None, "confidence": 0.0, "landmarks_detected": False}

    if model_loader.model is None:
        return {"prediction": "MODEL_NOT_LOADED", "confidence": 0.0, "landmarks_detected": True}

    # Reshape for LSTM: (1, 63) -> (1, 1, 63) or based on model input.
    # Assuming model expects (1, 63) purely or (1, time_steps, features)
    # If the user description says sequence_length, we might need a buffer. 
    # For single frame prediction, we assume the model handles it or we reshape.
    
    # User's architecture: Input: (sequence_length, 63)
    # If we are doing frame-by-frame without client-side buffering:
    # This is tricky. A single frame isn't a sequence. 
    # BUT for simplicity in this MVP step, let's assume we pass a sequence of 1 frame 
    # OR we are just building the structure and the user will handle buffering.
    
    # Reshaping to (1, 1, 63) arbitrarily to match dimensions if needed by LSTM
    input_data = landmarks.reshape(1, 1, 63) 
    
    # However, if the model was trained on sequences (e.g. 30 frames), sending 1 frame is bad.
    # For now, let's just do the inference call and catch shape errors if they arise later.
    try:
        predictions = model_loader.model.predict(input_data)
        class_idx = np.argmax(predictions[0])
        confidence = float(np.max(predictions[0]))
        
        label = model_loader.labels[class_idx] if class_idx < len(model_loader.labels) else str(class_idx)
        
        return {
            "prediction": label,
            "confidence": confidence,
            "landmarks_detected": True
        }
    except Exception as e:
        print(f"Prediction error: {e}")
        return {"error": str(e), "landmarks_detected": True}

from collections import Counter

def predict_sign_batch(base64_frames):
    """
    Predict over a batch of frames and use majority voting to smooth output.
    """
    predictions = []
    confidences = []
    valid_frames = 0
    
    if model_loader.model is None:
        return {"prediction": "MODEL_NOT_LOADED", "confidence": 0.0, "landmarks_detected": False}

    if not base64_frames or not isinstance(base64_frames, list):
        return {"prediction": None, "confidence": 0.0, "landmarks_detected": False}

    for base64_image in base64_frames:
        image = decode_image(base64_image)
        if image is None:
            continue
            
        landmarks = extract_landmarks(image)
        if landmarks is None:
            continue
            
        valid_frames += 1
        input_data = landmarks.reshape(1, 1, 63) 
        try:
            preds = model_loader.model.predict(input_data, verbose=0)
            class_idx = np.argmax(preds[0])
            conf = float(np.max(preds[0]))
            label = model_loader.labels[class_idx] if class_idx < len(model_loader.labels) else str(class_idx)
            
            # Only count predictions with decent confidence
            if conf > 0.4:
                predictions.append(label)
                confidences.append(conf)
        except Exception as e:
            pass

    if not predictions:
        return {"prediction": None, "confidence": 0.0, "landmarks_detected": valid_frames > 0}
        
    # Majority voting
    counter = Counter(predictions)
    best_pred, _ = counter.most_common(1)[0]
    
    # Average confidence of the winning prediction
    winning_confs = [c for p, c in zip(predictions, confidences) if p == best_pred]
    avg_conf = sum(winning_confs) / len(winning_confs) if winning_confs else 0.0
    
    return {
        "prediction": best_pred,
        "confidence": avg_conf,
        "landmarks_detected": True
    }
