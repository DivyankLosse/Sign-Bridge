import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path
from datetime import datetime, timezone

from app.config import settings
from app.asl.routes import router as asl_router
from app.auth import router as auth_router
import app.asl.predict as asl_predict

app = FastAPI(title="Papago Sign API", version="1.0.0")

@app.on_event("startup")
def startup_event():
    print("[Startup] Initializing ASL Model...")
    asl_predict.load_model()
    
# Mount static files for animations
base_dir = Path(__file__).resolve().parent.parent
static_path = base_dir / "static"

if static_path.exists():
    app.mount("/static", StaticFiles(directory=str(static_path)), name="static")
    print(f"Mounted static files from: {static_path}")
else:
    print(f"Warning: Static directory not found at {static_path}")

# CORS Configuration
origins = [
    settings.FRONTEND_URL,
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/auth", tags=["auth"])
app.include_router(asl_router, prefix="/asl")

@app.get("/")
def read_root():
    is_loaded = asl_predict.model is not None
    return {
        "message": "Welcome to Papago Sign API", 
        "model_loaded": is_loaded, 
        "environment": settings.ENVIRONMENT
    }

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.get("/ping")
def ping():
    return {"status": "alive", "timestamp": datetime.now(timezone.utc).isoformat()}

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("app.main:app", host="0.0.0.0", port=port, reload=True)
