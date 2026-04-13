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
        
        log_status(f"ASL PATH (Absolute): {os.path.abspath(settings.SPELL_MODEL_PATH)}")

        try:
            # Load ASL Model (39 labels)
            if os.path.exists(settings.SPELL_MODEL_PATH):
                log_status(f"Loading ASL model from {settings.SPELL_MODEL_PATH}")
                self._model = tf.keras.models.load_model(settings.SPELL_MODEL_PATH, compile=False)
                
                if os.path.exists(settings.SPELL_LABELS_PATH):
                    with open(settings.SPELL_LABELS_PATH, "r") as f:
                        self._labels = [line.strip() for line in f.readlines()]
                log_status(f"SUCCESS: ASL model loaded with {len(self._labels)} labels")
            else:
                log_status(f"FAILURE: ASL model not found at {settings.SPELL_MODEL_PATH}")
                self._error_state = True
 
            self._is_initialized = True
        except Exception as e:
            log_status(f"FATAL ERROR during model initialization: {e}")
            self._error_state = True
            self._is_initialized = True # Mark as initialized to stop retry spam, but in error state

    @property
    def model(self):
        if not self._is_initialized:
            self.init_model()
        return self._model

    @property
    def labels(self):
        if not self._is_initialized:
            self.init_model()
        return self._labels

    @property
    def is_ready(self):
        return self._is_initialized and (self._model is not None) and not self._error_state

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
