import pickle
import numpy as np
import os
import cv2
import base64
from pathlib import Path

model = None
detector = None
labels = []

def load_model():
    global model, detector, labels
    
    # User requested fix: Use os path join and print directory
    # Loading the REAL trained model (.h5) instead of .pkl as .pkl has not been pushed to the repo
    MODEL_PATH = os.path.join(os.getcwd(), "backend", "trained_models", "asl_39_model.h5")
    LABELS_PATH = os.path.join(os.getcwd(), "backend", "trained_models", "asl_39_labels.txt")
    
    # Fallback if running directly inside backend folder
    if not os.path.exists(MODEL_PATH):
        MODEL_PATH = os.path.join(os.getcwd(), "trained_models", "asl_39_model.h5")
        LABELS_PATH = os.path.join(os.getcwd(), "trained_models", "asl_39_labels.txt")
        
    print("Loading model from:", MODEL_PATH)
    
    try:
        import tensorflow as tf
        model = tf.keras.models.load_model(MODEL_PATH)
        print("✅ Model loaded successfully")
        
        # Load labels
        if os.path.exists(LABELS_PATH):
            with open(LABELS_PATH, "r") as f:
                labels = [line.strip() for line in f.readlines()]
            print(f"✅ Loaded {len(labels)} labels")
        
        # Load mediapipe
        from mediapipe.tasks import python
        from mediapipe.tasks.python import vision
        
        TASK_PATH = os.path.join(os.getcwd(), "backend", "app", "models", "hand_landmarker.task")
        if not os.path.exists(TASK_PATH):
            TASK_PATH = os.path.join(os.getcwd(), "app", "models", "hand_landmarker.task")
            
        base_options = python.BaseOptions(model_asset_path=TASK_PATH)
        options = vision.HandLandmarkerOptions(base_options=base_options, num_hands=1)
        detector = vision.HandLandmarker.create_from_options(options)
        print("✅ Mediapipe model loaded")
        
    except Exception as e:
        print(f"❌ Failed to load ASL/Mediapipe model: {e}")

def get_landmarks(base64_string):
    global detector
    import mediapipe as mp
    
    if "," in base64_string:
        base64_string = base64_string.split(",")[1]
    img_data = base64.b64decode(base64_string)
    nparr = np.frombuffer(img_data, np.uint8)
    image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    if image is None or detector is None:
        return None
        
    frame_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=frame_rgb)
    results = detector.detect(mp_image)
    
    if not results.hand_landmarks:
        return None
        
    landmarks = []
    for lm in results.hand_landmarks[0]:
        landmarks.extend([lm.x, lm.y, lm.z])
    return np.array(landmarks)

def predict_sign(frame_data):
    global model, labels
    if model is None:
        return {"error": "Model not loaded"}

    try:
        landmarks = get_landmarks(frame_data)
        if landmarks is None:
            return {"prediction": "", "error": "No hands detected"}
            
        prediction_probs = model.predict(np.array([landmarks]))[0]
        max_index = np.argmax(prediction_probs)
        
        predicted_label = str(max_index)
        if labels and max_index < len(labels):
            predicted_label = labels[max_index]
            
        return {"prediction": predicted_label}
    except Exception as e:
        return {"error": f"Prediction failed: {e}"}
