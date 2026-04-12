from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path
from app.config import settings
from app.auth import routes as auth_routes
from app.sign_recognition import routes as sign_routes
from app.text_to_sign import routes as text_routes
from app.history import routes as history_routes
from app.text_to_sign.mapper import refresh_animations_cache

app = FastAPI(title="Papago Sign API", version="1.0.0")

@app.on_event("startup")
async def startup_event():
    animations = refresh_animations_cache()
    print(f"\\n{'='*40}")
    print(f"Startup: Loaded {len(animations)} animations")
    print(f"Looking in: {settings.ANIMATIONS_PATH}")
    print(f"{'='*40}\\n")

# Mount static files for animations
# Mount static files for animations
# Resolve absolute path relative to this file (app/main.py) -> parent (app) -> parent (backend)
base_dir = Path(__file__).resolve().parent.parent
static_path = base_dir / "static"

if static_path.exists():
    app.mount("/static", StaticFiles(directory=str(static_path)), name="static")
    print(f"Mounted static files from: {static_path}")
else:
    print(f"Warning: Static directory not found at {static_path}")

# CORS Configuration - Allow all localhost ports for development
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
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_routes.router)
app.include_router(sign_routes.router)
app.include_router(text_routes.router)
app.include_router(history_routes.router)

from app.nlp_correction.routes import router as nlp_router
from app.personalization.routes import router as personalization_router
from app.sign_recognition.websocket_handler import router as ws_router

app.include_router(nlp_router)
app.include_router(personalization_router)
app.include_router(ws_router)

from app.sign_recognition.model_loader import model_loader

@app.get("/")
def read_root():
    is_loaded = model_loader.model is not None
    return {"message": "Welcome to Papago Sign API", "model_loaded": is_loaded, "model_path": settings.MODEL_PATH}

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.get("/ping")
def ping():
    """Lightweight endpoint for keep-alive."""
    return {"status": "alive", "timestamp": datetime.now(timezone.utc).isoformat()}
