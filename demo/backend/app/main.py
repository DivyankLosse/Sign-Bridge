from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
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
    print(f"DEMO MODE: Serving Frontend from static_ui")
    print(f"{'='*40}\\n")

# ... existing static mount ...
# Mount static files for animations
# Resolve absolute path relative to this file (app/main.py) -> parent (app) -> parent (backend)
base_dir = Path(__file__).resolve().parent.parent
static_path = base_dir / "static"

if static_path.exists():
    app.mount("/static", StaticFiles(directory=str(static_path)), name="static")
    print(f"Mounted static files from: {static_path}")
else:
    print(f"Warning: Static directory not found at {static_path}")

ui_path = base_dir / "static_ui"
if ui_path.exists():
    # Mount assets folder (commonly used by Vite)
    assets_path = ui_path / "assets"
    if assets_path.exists():
        app.mount("/assets", StaticFiles(directory=str(assets_path)), name="ui_assets")
    
    # Serve favicon and other root files if needed, or just let the catch-all handle it if they aren't critical
    # But usually Vite puts assets in /assets. 

# CORS Configuration - Allow all localhost ports for development
origins = [
    settings.FRONTEND_URL,
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174",
    "http://localhost:8000",
    "http://127.0.0.1:8000",
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

from app.sign_recognition.model_loader import model_loader

@app.get("/api/status")
def read_root_api():
    is_loaded = model_loader.model is not None
    return {"message": "Welcome to Papago Sign API", "model_loaded": is_loaded, "model_path": settings.MODEL_PATH}

@app.get("/health")
def health_check():
    return {"status": "ok"}

# Catch-all for SPA - Must be last
@app.get("/{full_path:path}")
async def serve_spa(full_path: str):
    if full_path.startswith("api") or full_path.startswith("static"):
        return {"status": 404, "message": "Not Found"}
    
    # Serve index.html for all other routes
    index_path = ui_path / "index.html"
    if index_path.exists():
        return FileResponse(index_path)
    return {"message": "Frontend not found (index.html missing)"}
