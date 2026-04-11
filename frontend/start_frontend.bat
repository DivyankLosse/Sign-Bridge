@echo off
echo =========================================
echo   Papago Sign Frontend Startup Script
echo =========================================

cd /d "%~dp0"

echo.
echo Starting frontend dev server...
echo.
echo App will start at: http://localhost:5173
echo Press Ctrl+C to stop.
echo.
npm run dev
