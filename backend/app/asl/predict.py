import pickle
import numpy as np
import os
import cv2
import base64
from pathlib import Path

model = None
detector = None
BASE_DIR = Path(__file__).resolve().parent.parent.parent

def load_model():
    global model, detector
    model_path = BASE_DIR / "models/asl_model.pkl"
    if os.path.exists("models/asl_model.pkl"):
        model_path = Path("models/asl_model.pkl")
        
    try:
        with open(model_path, "rb") as f:
            model = pickle.load(f)
        print("✅ ASL model loaded")
        
        # Load mediapipe
        import mediapipe as mp
        from mediapipe.tasks import python
        from mediapipe.tasks.python import vision
        
        task_path = BASE_DIR / "models/hand_landmarker.task"
        if os.path.exists("models/hand_landmarker.task"):
            task_path = Path("models/hand_landmarker.task")
            
        base_options = python.BaseOptions(model_asset_path=str(task_path))
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
    global model
    if model is None:
        return {"error": "Model not loaded"}

    try:
        landmarks = get_landmarks(frame_data)
        if landmarks is None:
            return {"prediction": "", "error": "No hands detected"}
            
        prediction = model.predict([landmarks])[0]
        return {"prediction": str(prediction)}
    except Exception as e:
        return {"error": f"Prediction failed: {e}"}
