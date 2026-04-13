import os
import sys
from app.config import settings

# Standard logging to console for Render/Production visibility
def log_status(msg):
    print(f"[MODEL_LOADER] {msg}")

class ModelLoader:
    def __init__(self):
        self._model = None
        self._labels = []
        self._is_initialized = False
        self._error_state = False

    def init_model(self):
        """
        Hardened Initialization Logic:
        - Fails fast if files are missing.
        - Only marks as initialized on SUCCESS.
        """
        if self._is_initialized:
            return
        
        import tensorflow as tf
        log_status("ASL-Only Model Loader initialization started")
        
        # Optimize memory
        if hasattr(tf, 'config') and hasattr(tf.config, 'experimental'):
            gpus = tf.config.experimental.list_physical_devices('GPU')
            if gpus:
                try:
                    for gpu in gpus:
                        tf.config.experimental.set_memory_growth(gpu, True)
                except RuntimeError as e:
                    log_status(f"Memory growth error: {e}")
        
        abs_model_path = os.path.abspath(settings.SPELL_MODEL_PATH)
        abs_labels_path = os.path.abspath(settings.SPELL_LABELS_PATH)
        
        log_status(f"VERIFYING PATHS:")
        log_status(f"- Model: {abs_model_path} (Exists: {os.path.exists(abs_model_path)})")
        log_status(f"- Labels: {abs_labels_path} (Exists: {os.path.exists(abs_labels_path)})")

        if not os.path.exists(abs_model_path):
            self._error_state = True
            raise FileNotFoundError(f"CRITICAL: ASL model file missing at {abs_model_path}")

        if not os.path.exists(abs_labels_path):
            self._error_state = True
            raise FileNotFoundError(f"CRITICAL: ASL labels file missing at {abs_labels_path}")

        try:
            log_status("Loading TensorFlow model...")
            self._model = tf.keras.models.load_model(abs_model_path, compile=False)
            
            with open(abs_labels_path, "r") as f:
                self._labels = [line.strip() for line in f.readlines()]
            
            log_status(f"SUCCESS: ASL model loaded with {len(self._labels)} labels")
            self._is_initialized = True
        except Exception as e:
            log_status(f"FATAL ERROR during model load: {e}")
            self._error_state = True
            raise e # Propagation to main.py to stop startup

    @property
    def model(self):
        # Redundant lazy-load removed. Reliance on startup init.
        return self._model

    @property
    def labels(self):
        # Redundant lazy-load removed. Reliance on startup init.
        return self._labels

    @property
    def is_ready(self):
        return self._is_initialized and (self._model is not None)

    @property
    def has_error(self):
        return self._error_state

    @property
    def status(self):
        return {
            "initialized": self._is_initialized,
            "ready": self.is_ready,
            "error": self._error_state,
            "labels_count": len(self._labels),
            "model_path": os.path.abspath(settings.SPELL_MODEL_PATH)
        }

    def predict(self, input_data):
        if not self.model:
            return None
        return self._model.predict(input_data, verbose=0)

model_loader = ModelLoader()
