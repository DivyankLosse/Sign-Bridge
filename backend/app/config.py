from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    MONGO_URI: str
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    # Dual Model Paths
    WORD_MODEL_PATH: str = "./trained_models/wlasl_top100_model.h5"
    WORD_LABELS_PATH: str = "./trained_models/wlasl_labels.txt"
    SPELL_MODEL_PATH: str = "./trained_models/asl_39_model.h5"
    SPELL_LABELS_PATH: str = "./trained_models/asl_39_labels.txt"
    
    # Heritage paths (backward compatibility)
    MODEL_PATH: str = "./trained_models/sign_model.h5"
    TFLITE_MODEL_PATH: str = "./trained_models/sign_model.tflite"
    LABELS_PATH: str = "./trained_models/labels.txt"
    
    FRONTEND_URL: str = "http://localhost:5173"
    ENVIRONMENT: str = "development"
    ANIMATIONS_PATH: str = "./static/animations"
    
    class Config:
        env_file = ".env"

settings = Settings()
