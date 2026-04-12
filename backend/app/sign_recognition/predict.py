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

def predict_sign(base64_image):
    """
    Main prediction function.
    Returns: {"prediction": str, "confidence": float, "landmarks_detected": bool}
    """
    image = decode_image(base64_image)
    if image is None:
        return {"error": "Invalid image"}
    
    landmarks = extract_landmarks(image)
    if landmarks is None:
        return {"prediction": None, "confidence": 0.0, "landmarks_detected": False}

    if not model_loader.is_ready:
        return {"prediction": "MODEL_NOT_LOADED", "confidence": 0.0, "landmarks_detected": True}

    # Reshape for LSTM: (1, 63) -> (1, 1, 63)
    input_data = landmarks.reshape(1, 1, 63).astype(np.float32)
    
    try:
        predictions = model_loader.predict(input_data)
        class_idx = np.argmax(predictions[0])
        confidence = float(np.max(predictions[0]))
        
        label = model_loader.labels[class_idx] if class_idx < len(model_loader.labels) else str(class_idx)
        
        return {
            "prediction": label,
            "confidence": confidence,
            "landmarks_detected": True
        }
    except Exception as e:
        import sys
        print(f"Prediction error: {e}", file=sys.stderr)
        return {"error": str(e), "landmarks_detected": True}

from collections import Counter

def predict_sign_batch(base64_frames):
    """
    Predict over a batch of frames using a single inference call.
    """
    if not model_loader.is_ready:
        return {"prediction": "MODEL_NOT_LOADED", "confidence": 0.0, "landmarks_detected": False}

    if not base64_frames or not isinstance(base64_frames, list):
        return {"prediction": None, "confidence": 0.0, "landmarks_detected": False}

    batch_landmarks = []
    
    for base64_image in base64_frames:
        image = decode_image(base64_image)
        if image is None:
            continue
            
        landmarks = extract_landmarks(image)
        if landmarks is not None:
            batch_landmarks.append(landmarks)

    if not batch_landmarks:
        return {"prediction": None, "confidence": 0.0, "landmarks_detected": False}

    try:
        # Vectorized inference: convert list of arrays to a single (N, 1, 63) tensor
        input_tensor = np.stack(batch_landmarks).reshape(len(batch_landmarks), 1, 63).astype(np.float32)
        
        # Unified predict call for the whole batch
        all_preds = model_loader.predict(input_tensor)
        
        # Process results
        predictions = []
        confidences = []
        
        for preds in all_preds:
            class_idx = np.argmax(preds)
            conf = float(np.max(preds))
            if conf > 0.4: # Filter by confidence threshold
                label = model_loader.labels[class_idx] if class_idx < len(model_loader.labels) else str(class_idx)
                predictions.append(label)
                confidences.append(conf)

        if not predictions:
             return {"prediction": None, "confidence": 0.0, "landmarks_detected": True}

        # Majority voting
        counter = Counter(predictions)
        best_pred, _ = counter.most_common(1)[0]
        
        # Average confidence for the winning label
        winning_confs = [c for p, c in zip(predictions, confidences) if p == best_pred]
        avg_conf = sum(winning_confs) / len(winning_confs)
        
        return {
            "prediction": best_pred,
            "confidence": avg_conf,
            "landmarks_detected": True
        }
    except Exception as e:
        import sys
        print(f"Batch prediction error: {e}", file=sys.stderr)
        return {"error": str(e), "landmarks_detected": True}
