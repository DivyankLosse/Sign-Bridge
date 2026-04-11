@echo off
setlocal
echo =======================================
echo   Papago Sign DEMO Startup Script
echo =======================================

cd /d "%~dp0"
cd backend

:CHECK_PYTHON
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Python is not installed or not in PATH.
    echo Please install Python to run this demo.
    pause
    exit /b
)

:SETUP_VENV
if not exist "venv" (
    echo.
    echo [1/4] Creating virtual environment...
    python -m venv venv
)

if not exist "venv\Scripts\activate.bat" (
    echo [ERROR] Virtual environment creation failed.
    pause
    exit /b
)

echo.
echo [2/4] Activating virtual environment...
call venv\Scripts\activate.bat

echo.
echo [3/4] Installing dependencies...
pip install -r requirements.txt >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install dependencies.
    echo Trying to install without quiet mode to show errors:
    pip install -r requirements.txt
    pause
    exit /b
)

echo.
echo [3.5/4] Initializing database...
python init_db.py

echo.
echo [4/4] Starting Demo Server...

echo.
echo Open your browser to: http://localhost:8000
echo Press Ctrl+C to stop.
echo.

start "" "http://localhost:8000"
uvicorn app.main:app --reload

endlocal
