import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path
from datetime import datetime, timezone

from app.config import settings
from app.auth import routes as auth_routes
from app.asl.routes import router as asl_router
from app.text_to_sign import routes as text_routes
from app.history import routes as history_routes
from app.text_to_sign.mapper import refresh_animations_cache
from app.nlp_correction.routes import router as nlp_router
from app.personalization.routes import router as personalization_router

from app.asl.predict import load_model, model

app = FastAPI(title="Papago Sign API", version="1.0.0")

@app.on_event("startup")
def startup_event():
    print("[Startup] Initializing ASL Model...")
    load_model()
    
    # Refresh animations cache
    try:
        animations = refresh_animations_cache()
        print(f"[Startup] Animations Loaded: {len(animations)}")
    except Exception as e:
        print(f"[Startup] Animation cache error: {e}")

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

app.include_router(auth_routes.router)
app.include_router(asl_router, prefix="/asl")
app.include_router(text_routes.router)
app.include_router(history_routes.router)
app.include_router(nlp_router)
app.include_router(personalization_router)

@app.get("/")
def read_root():
    is_loaded = model is not None
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
