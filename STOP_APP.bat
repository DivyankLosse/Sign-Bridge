@echo off
title Stopping Papago Sign Services
color 0C

echo.
echo  Stopping all Papago Sign services...
echo.

:: Kill uvicorn processes
taskkill /F /IM python.exe /FI "WINDOWTITLE eq Papago Sign - Backend*" >nul 2>&1
taskkill /F /IM uvicorn.exe >nul 2>&1

:: Kill node/npm processes for frontend
taskkill /F /IM node.exe /FI "WINDOWTITLE eq Papago Sign - Frontend*" >nul 2>&1

:: Stop docker container
docker-compose down >nul 2>&1

echo  [OK] All services stopped.
echo.
pause
