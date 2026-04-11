# Papago Sign

A real-time sign language translation application using AI/ML.

---

## 🚀 Quick Start

### One-Click Launch (Recommended)
Simply double-click in the project root folder:
```
START_APP.bat    → Starts everything (database, backend, frontend)
STOP_APP.bat     → Stops all services cleanly
```

### Manual Start
If you prefer running commands manually:

**Step 1 - Database** (in project root):
```powershell
docker-compose up -d
```

**Step 2 - Backend** (in `backend` folder):
```powershell
.\venv\Scripts\Activate
uvicorn app.main:app --reload
```

**Step 3 - Frontend** (in `frontend` folder):
```powershell
npm run dev
```

### Access the App
| Service | URL |
|---------|-----|
| **Frontend** | http://localhost:5173 |
| **Backend API** | http://localhost:8000 |
| **API Docs** | http://localhost:8000/docs |

---

## 💾 Data Persistence
✅ **Your data is safe** - All user accounts and history are stored in a persistent Docker volume.

When you restart your PC:
- **Database**: Starts automatically with Docker Desktop
- **Backend & Frontend**: Use `START_APP.bat` to restart

---

## 🔧 Configuration Fixes Applied

The following issues were identified and permanently fixed:

| Issue | Root Cause | Fix Applied |
|-------|-----------|-------------|
| Database connection failed | Port 5432 conflict with local PostgreSQL | Changed to port **5433** in `docker-compose.yml` and `.env` |
| Frontend couldn't reach backend | API URL was `localhost:8001` | Corrected to **`localhost:8000`** in `constants.js` |
| CORS preflight errors | Frontend port not in allowed origins | Added ports **5173, 5174** to `main.py` CORS config |
| Backend crash on startup | Missing NLTK library/data | Installed **nltk** and downloaded required data packages |
| Port switching causing CORS | Vite auto-switching ports | Added **`strictPort: true`** in `vite.config.js` |

---

## 🛠 Troubleshooting - How to Fix Errors

### ❌ "Login/Registration failed" or "Network Error"
**Cause:** Backend is not running or crashed.
**Fix:**
```powershell
# Check if backend is running - look for a terminal with uvicorn
# If not running, restart:
cd backend
.\venv\Scripts\Activate
uvicorn app.main:app --reload
```

---

### ❌ "Connection refused" or Database error
**Cause:** PostgreSQL container is not running.
**Fix:**
```powershell
# Start the database
docker-compose up -d

# Verify it's running
docker ps
# You should see "papago_sign_db" in the list
```

---

### ❌ "Port 5173 is in use"
**Cause:** Old frontend instance still running.
**Fix:**
```powershell
# Option 1: Close all terminal windows and restart
# Option 2: Kill the process manually
netstat -ano | Select-String ":5173"
# Note the PID (last number), then:
taskkill /PID <PID> /F
```

---

### ❌ "CORS error" or "Preflight failed"
**Cause:** Frontend running on unexpected port.
**Fix:**
1. Close ALL terminal windows
2. Use `STOP_APP.bat` to kill everything
3. Wait 5 seconds
4. Use `START_APP.bat` to restart fresh

---

### ❌ Backend crashes with "NLTK" or "BadZipFile" error
**Cause:** NLTK data is corrupted.
**Fix:**
```powershell
cd backend
.\venv\Scripts\Activate
python -c "import nltk; nltk.download('punkt'); nltk.download('averaged_perceptron_tagger'); nltk.download('wordnet'); nltk.download('stopwords'); nltk.download('omw-1.4')"
```

---

### ❌ "Password authentication failed for user papago_user"
**Cause:** Database volume has old/conflicting credentials.
**Fix:**
```powershell
# WARNING: This will DELETE all data in the database!
docker-compose down -v
docker-compose up -d

# Then reinitialize tables:
cd backend
.\venv\Scripts\Activate
python init_db.py
```

---

### ❌ Multiple backend instances causing issues
**Cause:** Started server multiple times without stopping.
**Fix:**
```powershell
# Kill all Python processes on port 8000
netstat -ano | Select-String ":8000"
# Kill each PID shown:
taskkill /PID <PID> /F

# Then restart cleanly
.\START_APP.bat
```

---

## 📁 Project Structure
```
Papago Sign/
├── START_APP.bat          # ⭐ One-click launcher (START HERE)
├── STOP_APP.bat           # Clean shutdown script
├── docker-compose.yml     # Database configuration (port 5433)
├── backend/
│   ├── start_server.bat   # Individual backend launcher
│   ├── app/               # FastAPI routes and logic
│   ├── trained_models/    # AI model (sign_model.h5)
│   └── .env               # Environment config
├── frontend/
│   ├── start_frontend.bat # Individual frontend launcher
│   ├── src/               # React components
│   └── vite.config.js     # Vite config (port locked to 5173)
└── Datasets/              # Training data (ASL alphabet)
```

---

## 🎯 Tech Stack
- **Frontend**: React + Vite
- **Backend**: FastAPI (Python)
- **Database**: PostgreSQL (Docker)
- **AI/ML**: TensorFlow, MediaPipe
- **Dataset**: ASL Alphabet (A-Z, 0-9, special signs)
