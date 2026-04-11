import os
import sys
from app.config import settings

# Debug logging to file
def log_debug(msg):
    with open("loader_debug.txt", "a") as f:
        f.write(f"[PID {os.getpid()}] {msg}\n")

try:
    import tensorflow as tf
    log_debug("TensorFlow imported successfully.")
except ImportError as e:
    log_debug(f"TensorFlow import failed: {e}")
    tf = None

import os
import sys
from app.config import settings

# Debug logging to file
def log_debug(msg):
    with open("loader_debug.txt", "a") as f:
        f.write(f"[PID {os.getpid()}] {msg}\n")

model = None
labels = []

def init_model():
    global model, labels
    log_debug("init_model called")
    try:
        import tensorflow as tf
        log_debug("TensorFlow imported")
        
        if os.path.exists(settings.MODEL_PATH):
            model = tf.keras.models.load_model(settings.MODEL_PATH)
            log_debug(f"SUCCESS: Model loaded from {settings.MODEL_PATH}")
        else:
            log_debug(f"FAILURE: Model file not found at {settings.MODEL_PATH}")
            
        if os.path.exists(settings.LABELS_PATH):
            with open(settings.LABELS_PATH, "r") as f:
                labels = [line.strip() for line in f.readlines()]
            log_debug(f"Labels loaded: {len(labels)}")
    except Exception as e:
        log_debug(f"FATAL ERROR: {e}")
        import traceback
        traceback.print_exc()

# Initialize on import
init_model()

# Mock class to maintain compatibility with existing code
class ModelLoader:
    def __init__(self):
        self.model = model
        self.labels = labels

model_loader = ModelLoader()
