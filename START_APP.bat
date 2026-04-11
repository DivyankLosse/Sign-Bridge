@echo off
title Papago Sign - Full Application Launcher
color 0A

echo.
echo  ==========================================
echo   PAPAGO SIGN - Application Launcher
echo  ==========================================
echo.

:: Check if Docker is running
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo  [ERROR] Docker is not running!
    echo  Please start Docker Desktop first.
    echo.
    pause
    exit /b 1
)

echo  [1/3] Starting Database...
docker-compose up -d
if %errorlevel% neq 0 (
    echo  [ERROR] Failed to start database container.
    pause
    exit /b 1
)
echo  [OK] Database started on port 5433
echo.

echo  [2/3] Starting Backend Server...
start "Papago Sign - Backend" cmd /k "cd /d %~dp0backend && call venv\Scripts\activate.bat && python init_db.py && uvicorn app.main:app --reload"
timeout /t 5 /nobreak >nul
echo  [OK] Backend starting on http://localhost:8000
echo.

echo  [3/3] Starting Frontend...
start "Papago Sign - Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"
timeout /t 3 /nobreak >nul
echo  [OK] Frontend starting on http://localhost:5173
echo.

echo  ==========================================
echo   ALL SERVICES STARTED SUCCESSFULLY!
echo  ==========================================
echo.
echo   Frontend: http://localhost:5173
echo   Backend:  http://localhost:8000
echo   API Docs: http://localhost:8000/docs
echo.
echo   You can close this window now.
echo   The backend and frontend will continue
echo   running in their own windows.
echo.
pause
