import os
import sys
from app.config import settings

# Standard logging to console for Render/Production visibility
def log_status(msg):
    timestamp = settings.datetime.now().strftime("%H:%M:%S") if hasattr(settings, 'datetime') else ""
    print(f"[MODEL_LOADER] {msg}")

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
        log_status("Dual Model Loader initialization started")
        
        # Optimize memory
        if hasattr(tf, 'config') and hasattr(tf.config, 'experimental'):
            gpus = tf.config.experimental.list_physical_devices('GPU')
            if gpus:
                try:
                    for gpu in gpus:
                        tf.config.experimental.set_memory_growth(gpu, True)
                except RuntimeError as e:
                    log_status(f"Memory growth error: {e}")
        log_status(f"WORD PATH (Absolute): {os.path.abspath(settings.WORD_MODEL_PATH)}")
        log_status(f"SPELL PATH (Absolute): {os.path.abspath(settings.SPELL_MODEL_PATH)}")

        try:
            # 1. Load Word Model (WLASL Top 100)
            if os.path.exists(settings.WORD_MODEL_PATH):
                log_status(f"Loading Word model from {settings.WORD_MODEL_PATH}")
                self._word_model = tf.keras.models.load_model(settings.WORD_MODEL_PATH, compile=False)
                if os.path.exists(settings.WORD_LABELS_PATH):
                    with open(settings.WORD_LABELS_PATH, "r") as f:
                        self._word_labels = [line.strip() for line in f.readlines()]
                log_status(f"SUCCESS: Word model loaded with {len(self._word_labels)} labels")
            else:
                log_status(f"FAILURE: Word model not found at {settings.WORD_MODEL_PATH}")
 
            # 2. Disabled Spell Model for memory optimization on Render free tier
            log_status("Memory Optimization: Spell model is DISABLED to conserve RAM.")
            self._spell_model = None
            self._spell_labels = []

            self._is_initialized = True
        except Exception as e:
            log_status(f"FATAL ERROR during dual model initialization: {e}")
            self._is_initialized = True # Prevent infinite retry loop on free tier

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
        # Memory Optimized: Only word model is required for ready status
        return self._is_initialized and (self._word_model is not None)

    @property
    def status(self):
        return {
            "initialized": self._is_initialized,
            "word_model_loaded": self._word_model is not None,
            "spell_model_loaded": self._spell_model is not None,
            "word_labels_count": len(self._word_labels),
            "spell_labels_count": len(self._spell_labels),
            "word_path": os.path.abspath(settings.WORD_MODEL_PATH),
            "spell_path": os.path.abspath(settings.SPELL_MODEL_PATH)
        }

    def predict_word(self, input_data):
        if not self.word_model:
            return None
        return self._word_model.predict(input_data, verbose=0)

    def predict_spell(self, input_data):
        if not self.spell_model:
            return None
        return self._spell_model.predict(input_data, verbose=0)

model_loader = ModelLoader()
