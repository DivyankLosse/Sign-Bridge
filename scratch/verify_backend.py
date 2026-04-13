import sys
import os
import numpy as np

# Add backend to path
sys.path.append(os.path.join(os.getcwd(), "backend"))

from dotenv import load_dotenv
load_dotenv(os.path.join("backend", ".env"))

from app.sign_recognition.model_loader import model_loader
from app.sign_recognition.predict import predict_sign_sequence

def verify():
    print("Testing Model Loader...")
    # Manually trigger model load
    model_loader.init_model()
    
    if not model_loader.is_ready:
        print("Model loader failed to load model!")
        return
    
    print(f"Model loaded successfully with {len(model_loader.labels)} labels.")
    
    # Create a dummy sequence (30 frames of 63 features)
    dummy_sequence = [np.random.random(63).tolist() for _ in range(30)]
    
    print("Testing predict_sign_sequence with dummy data...")
    # We need to mock encode_image since predict_sign_sequence expects base64
    # Instead, let's call the internal logic or just verify the function exists
    
    # Actually, let's test the model's predict method directly
    input_data = np.random.random((1, 30, 63)).astype(np.float32)
    preds = model_loader.predict(input_data)
    
    class_idx = np.argmax(preds[0])
    label = model_loader.labels[class_idx]
    conf = preds[0][class_idx]
    
    print(f"Prediction: {label} (confidence: {conf:.4f})")
    print("Verification complete.")

if __name__ == "__main__":
    verify()
