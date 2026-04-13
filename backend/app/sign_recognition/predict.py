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

def predict_hybrid(base64_frames, mode="AUTO", threshold=0.7):
    """
    Elite Hybrid Inference Logic:
    - mode: "AUTO", "WORDS", "SPELL"
    """
    if not model_loader.is_ready:
        print("[Predict] Cold start detected: Force loading models...")
        model_loader.init_model()
        
    if not model_loader.is_ready:
        return {"prediction": "MODEL_NOT_LOADED", "confidence": 0.0, "mode": "error", "landmarks_detected": False}

    if not base64_frames or not isinstance(base64_frames, list):
        return {"prediction": None, "confidence": 0.0, "mode": "error"}

    # 1. Preprocess all frames for landmarks
    sequence_landmarks = []
    last_valid_landmarks = None
    
    for base64_image in base64_frames:
        image = decode_image(base64_image)
        if image is not None:
            landmarks = extract_landmarks(image)
            if landmarks is not None:
                sequence_landmarks.append(landmarks)
                last_valid_landmarks = landmarks
            else:
                sequence_landmarks.append(np.zeros(63))
        else:
            sequence_landmarks.append(np.zeros(63))

    valid_seq_count = sum(1 for s in sequence_landmarks if not np.all(s == 0))
    print(f"[Predict] Processed {len(sequence_landmarks)} frames. Valid chunks: {valid_seq_count}")

    if last_valid_landmarks is None:
        print("[Predict] FAILURE: No landmarks detected in entire sequence.")
        return {"prediction": None, "confidence": 0.0, "mode": mode, "landmarks_detected": False}

    # 2. Sequential Inference (WLASL)
    word_prediction = None
    word_confidence = 0.0
    
    # We only run word model if mode is AUTO or WORDS
    if mode in ["AUTO", "WORDS"]:
        # Match training sequence length (20)
        TARGET_LENGTH = 20
        if len(sequence_landmarks) > TARGET_LENGTH:
            wl_input = np.array(sequence_landmarks[-TARGET_LENGTH:])
        else:
            wl_input = np.array(sequence_landmarks)
            padding = [np.zeros(63) for _ in range(TARGET_LENGTH - len(wl_input))]
            wl_input = np.vstack([wl_input, padding]) if len(wl_input) > 0 else np.zeros((TARGET_LENGTH, 63))
            
        wl_input = wl_input.reshape(1, TARGET_LENGTH, 63).astype(np.float32)
        preds = model_loader.predict_word(wl_input)
        
        if preds is not None:
            idx = np.argmax(preds[0])
            word_confidence = float(preds[0][idx])
            word_prediction = model_loader.word_labels[idx]

    # 3. Decision Logic
    final_pred = None
    final_conf = 0.0
    final_mode = "spell"

    # CASE A: User forced WORDS mode
    if mode == "WORDS":
        final_pred = word_prediction
        final_conf = word_confidence
        final_mode = "word"
    
    # CASE B: User forced SPELL mode OR AUTO fallback
    elif mode == "SPELL" or (mode == "AUTO" and word_confidence < threshold):
        # Run ASL 39 model on the last valid frame
        asl_input = last_valid_landmarks.reshape(1, 63).astype(np.float32)
        preds = model_loader.predict_spell(asl_input)
        
        if preds is not None:
            idx = np.argmax(preds[0])
            final_pred = model_loader.spell_labels[idx]
            final_conf = float(preds[0][idx])
            final_mode = "spell"
            
    # CASE C: AUTO success
    else:
        final_pred = word_prediction
        final_conf = word_confidence
        final_mode = "word"

    return {
        "prediction": final_pred,
        "confidence": final_conf,
        "mode": final_mode,
        "landmarks_detected": True
    }
