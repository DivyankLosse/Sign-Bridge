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
    Main prediction function for static or single-frame signs.
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

    # Reshape for Sequence Model: (63,) -> (1, 1, 63)
    # The new WLASL model expects (batch, sequence, features)
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

def predict_sign_sequence(base64_frames):
    """
    Predict over a sequence of frames for dynamic signs (WLASL integration).
    Expects a list of base64 strings.
    """
    if not model_loader.is_ready:
        return {"prediction": "MODEL_NOT_LOADED", "confidence": 0.0, "landmarks_detected": False}

    if not base64_frames or not isinstance(base64_frames, list):
        return {"prediction": None, "confidence": 0.0, "landmarks_detected": False}

    sequence_landmarks = []
    
    for base64_image in base64_frames:
        image = decode_image(base64_image)
        if image is None:
            # Pad with zeros if image decoding fails to maintain sequence length?
            # Or just skip? For now, we skip and will pad at the end if needed.
            continue
            
        landmarks = extract_landmarks(image)
        if landmarks is not None:
            sequence_landmarks.append(landmarks)

    if not sequence_landmarks:
        return {"prediction": None, "confidence": 0.0, "landmarks_detected": False}

    # Pad or truncate to match model's expected SEQUENCE_LENGTH (e.g. 30)
    TARGET_LENGTH = 30 # Should match train_wlasl.py
    if len(sequence_landmarks) > TARGET_LENGTH:
        sequence_landmarks = sequence_landmarks[:TARGET_LENGTH]
    elif len(sequence_landmarks) < TARGET_LENGTH:
        padding = [np.zeros(63) for _ in range(TARGET_LENGTH - len(sequence_landmarks))]
        sequence_landmarks.extend(padding)

    try:
        # Reshape to (1, 30, 63)
        input_tensor = np.array(sequence_landmarks).reshape(1, TARGET_LENGTH, 63).astype(np.float32)
        
        predictions = model_loader.predict(input_tensor)
        class_idx = np.argmax(predictions[0])
        confidence = float(np.max(predictions[0]))
        
        # Filter by threshold
        if confidence < 0.3:
            return {"prediction": None, "confidence": confidence, "landmarks_detected": True}

        label = model_loader.labels[class_idx] if class_idx < len(model_loader.labels) else str(class_idx)
        
        return {
            "prediction": label,
            "confidence": confidence,
            "landmarks_detected": True
        }
    except Exception as e:
        import sys
        print(f"Sequence prediction error: {e}", file=sys.stderr)
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
