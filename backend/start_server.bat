@echo off
echo =========================================
echo   Papago Sign Backend Startup Script
echo =========================================

cd /d "%~dp0"

echo.
echo [1/3] Activating virtual environment...
call venv\Scripts\activate.bat

echo.
echo [2/3] Initializing database tables...
python init_db.py

echo.
echo [3/3] Starting backend server...
echo.
echo Server will start at: http://127.0.0.1:8000
echo Press Ctrl+C to stop.
echo.
uvicorn app.main:app --reload
