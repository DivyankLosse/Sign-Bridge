import os
import sys
from app.config import settings

# Debug logging to file
def log_debug(msg):
    with open("loader_debug.txt", "a") as f:
        f.write(f"[PID {os.getpid()}] {msg}\n")

class ModelLoader:
    def __init__(self):
        self._word_model = None
        self._spell_model = None
        self._word_labels = []
        self._spell_labels = []
        self._is_initialized = False

    def init_model(self):
        if self._is_initialized:
            return
        
        import tensorflow as tf
        log_debug("Dual Model Loader initialization started")
        
        # Optimize memory
        if hasattr(tf, 'config') and hasattr(tf.config, 'experimental'):
            gpus = tf.config.experimental.list_physical_devices('GPU')
            if gpus:
                try:
                    for gpu in gpus:
                        tf.config.experimental.set_memory_growth(gpu, True)
                except RuntimeError as e:
                    log_debug(f"Memory growth error: {e}")

        try:
            # 1. Load Word Model (WLASL Top 100)
            if os.path.exists(settings.WORD_MODEL_PATH):
                log_debug(f"Loading Word model from {settings.WORD_MODEL_PATH}")
                self._word_model = tf.keras.models.load_model(settings.WORD_MODEL_PATH, compile=False)
                if os.path.exists(settings.WORD_LABELS_PATH):
                    with open(settings.WORD_LABELS_PATH, "r") as f:
                        self._word_labels = [line.strip() for line in f.readlines()]
                log_debug(f"SUCCESS: Word model loaded with {len(self._word_labels)} labels")
            else:
                log_debug(f"FAILURE: Word model not found at {settings.WORD_MODEL_PATH}")

            # 2. Load Spell Model (ASL 39)
            if os.path.exists(settings.SPELL_MODEL_PATH):
                log_debug(f"Loading Spell model from {settings.SPELL_MODEL_PATH}")
                self._spell_model = tf.keras.models.load_model(settings.SPELL_MODEL_PATH, compile=False)
                if os.path.exists(settings.SPELL_LABELS_PATH):
                    with open(settings.SPELL_LABELS_PATH, "r") as f:
                        self._spell_labels = [line.strip() for line in f.readlines()]
                log_debug(f"SUCCESS: Spell model loaded with {len(self._spell_labels)} labels")
            else:
                log_debug(f"FAILURE: Spell model not found at {settings.SPELL_MODEL_PATH}")

            self._is_initialized = True
        except Exception as e:
            log_debug(f"FATAL ERROR during dual model initialization: {e}")

    @property
    def word_model(self):
        if not self._is_initialized:
            self.init_model()
        return self._word_model

    @property
    def spell_model(self):
        if not self._is_initialized:
            self.init_model()
        return self._spell_model

    @property
    def word_labels(self):
        if not self._is_initialized:
            self.init_model()
        return self._word_labels

    @property
    def spell_labels(self):
        if not self._is_initialized:
            self.init_model()
        return self._spell_labels

    @property
    def is_ready(self):
        if not self._is_initialized:
            self.init_model()
        return (self._word_model is not None) and (self._spell_model is not None)

    def predict_word(self, input_data):
        if not self.word_model:
            return None
        return self._word_model.predict(input_data, verbose=0)

    def predict_spell(self, input_data):
        if not self.spell_model:
            return None
        return self._spell_model.predict(input_data, verbose=0)

model_loader = ModelLoader()
