from pydantic_settings import BaseSettings
from pathlib import Path

class Settings(BaseSettings):
    MONGO_URI: str
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    # Absolute paths calculation
    BASE_DIR: Path = Path(__file__).resolve().parent.parent
    
    # Dual Model Paths
    WORD_MODEL_PATH: str = str(BASE_DIR / "trained_models" / "wlasl_top100_model.h5")
    WORD_LABELS_PATH: str = str(BASE_DIR / "trained_models" / "wlasl_labels.txt")
    SPELL_MODEL_PATH: str = str(BASE_DIR / "trained_models" / "asl_39_model.h5")
    SPELL_LABELS_PATH: str = str(BASE_DIR / "trained_models" / "asl_39_labels.txt")
    
    # Heritage paths (backward compatibility)
    MODEL_PATH: str = str(BASE_DIR / "trained_models" / "sign_model.h5")
    TFLITE_MODEL_PATH: str = str(BASE_DIR / "trained_models" / "sign_model.tflite")
    LABELS_PATH: str = str(BASE_DIR / "trained_models" / "labels.txt")
    
    FRONTEND_URL: str = "http://localhost:5173"
    ENVIRONMENT: str = "development"
    ANIMATIONS_PATH: str = str(BASE_DIR / "static" / "animations")
    
    class Config:
        env_file = ".env"

settings = Settings()
