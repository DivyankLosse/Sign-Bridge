import os
import sys
from app.config import settings

# Debug logging to file
def log_debug(msg):
    with open("loader_debug.txt", "a") as f:
        f.write(f"[PID {os.getpid()}] {msg}\n")

class ModelLoader:
    def __init__(self):
        self._model = None
        self._interpreter = None
        self._labels = []
        self._input_details = None
        self._output_details = None
        self._is_tflite = False
        self._is_initialized = False

    def init_model(self):
        if self._is_initialized:
            return
        
        import numpy as np
        log_debug("Lazy init_model called")
        try:
            # 1. Load Labels first
            if os.path.exists(settings.LABELS_PATH):
                with open(settings.LABELS_PATH, "r") as f:
                    self._labels = [line.strip() for line in f.readlines()]
                log_debug(f"Labels loaded: {len(self._labels)}")
            else:
                log_debug(f"FAILURE: Labels file not found at {settings.LABELS_PATH}")

            # 2. Try loading TFLite first (Production priority)
            if os.path.exists(settings.TFLITE_MODEL_PATH):
                import tensorflow as tf
                log_debug(f"Loading TFLite model from {settings.TFLITE_MODEL_PATH}")
                self._interpreter = tf.lite.Interpreter(model_path=settings.TFLITE_MODEL_PATH)
                self._interpreter.allocate_tensors()
                self._input_details = self._interpreter.get_input_details()
                self._output_details = self._interpreter.get_output_details()
                self._is_tflite = True
                self._is_initialized = True
                log_debug("SUCCESS: TFLite model initialized")
                return

            # 3. Fallback to Keras H5
            if os.path.exists(settings.MODEL_PATH):
                import tensorflow as tf
                log_debug(f"Loading Keras model from {settings.MODEL_PATH}")
                # Optimize memory for low-resource environments
                if hasattr(tf, 'config') and hasattr(tf.config, 'experimental'):
                    gpus = tf.config.experimental.list_physical_devices('GPU')
                    if gpus:
                        try:
                            for gpu in gpus:
                                tf.config.experimental.set_memory_growth(gpu, True)
                        except RuntimeError as e:
                            log_debug(f"Memory growth error: {e}")
                
                self._model = tf.keras.models.load_model(settings.MODEL_PATH, compile=False)
                self._is_tflite = False
                self._is_initialized = True
                log_debug(f"SUCCESS: Keras model loaded from {settings.MODEL_PATH}")
            else:
                log_debug("FAILURE: No model file (H5 or TFLite) found.")
                
        except Exception as e:
            log_debug(f"FATAL ERROR during model initialization: {e}")
            self._model = None
            self._interpreter = None

    @property
    def model(self):
        if not self._is_initialized:
            self.init_model()
        return self._model

    @property
    def interpreter(self):
        if not self._is_initialized:
            self.init_model()
        return self._interpreter

    @property
    def labels(self):
        if not self._is_initialized:
            self.init_model()
        return self._labels

    @property
    def is_tflite(self):
        return self._is_tflite

    @property
    def is_ready(self):
        if not self._is_initialized:
            self.init_model()
        return (self._model is not None) or (self._interpreter is not None)

    def predict(self, input_data):
        """Unified prediction interface."""
        import numpy as np
        if not self.is_ready:
            return None
        
        if self._is_tflite:
            self._interpreter.set_tensor(self._input_details[0]['index'], input_data.astype(np.float32))
            self._interpreter.invoke()
            return self._interpreter.get_tensor(self._output_details[0]['index'])
        else:
            return self._model.predict(input_data, verbose=0)

model_loader = ModelLoader()
