import os
from pathlib import Path

from pydantic import BaseSettings, Field


def _split_csv_env(value: str) -> list[str]:
    return [item.strip().rstrip("/") for item in value.split(",") if item.strip()]


class Settings(BaseSettings):
    MONGO_URI: str = Field(default_factory=lambda: os.getenv("MONGO_URI") or os.getenv("MONGODB_URI") or "")
    SECRET_KEY: str = Field(default_factory=lambda: os.getenv("SECRET_KEY") or os.getenv("JWT_SECRET") or "")
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
    CORS_ORIGINS: str = ""
    CORS_ALLOW_ORIGIN_REGEX: str = r"^https://.*\.onrender\.com$"
    ENVIRONMENT: str = "development"
    ANIMATIONS_PATH: str = str(BASE_DIR / "static" / "animations")

    @property
    def cors_origins(self) -> list[str]:
        origins = {
            "http://localhost:3000",
            "http://localhost:5173",
            "http://localhost:5174",
            "http://127.0.0.1:5173",
            "http://127.0.0.1:5174",
        }

        if self.FRONTEND_URL:
            origins.add(self.FRONTEND_URL.strip().rstrip("/"))

        origins.update(_split_csv_env(self.CORS_ORIGINS))
        return sorted(origins)
    
    class Config:
        env_file = ".env"

settings = Settings()
