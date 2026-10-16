@echo off
title RBC Insight AI Launcher
echo ========================================================
echo   Launching RBC Insight AI Pipeline & Web Application
echo ========================================================
echo.

:: 1. Launch FastAPI Backend in a new window
echo [1/2] Starting Python FastAPI Backend Engine on Port 8000...
start "RBC Insight AI - Backend (Port 8000)" cmd /k "cd /d "%~dp0" && "C:\Users\prajs\anaconda3\python.exe" -m uvicorn app.main:app --host 127.0.0.1 --port 8000"

:: Wait for model to load and backend to initialize
echo Initializing deep learning model (EfficientNetV2-S)...
timeout /t 6 /nobreak >nul

:: 2. Launch Vite React Frontend in a new window
echo [2/2] Starting React Vite Frontend Application on Port 8080...
start "RBC Insight AI - Frontend (Port 8080)" cmd /k "cd /d "%~dp0rbc-insight-ai" && set "PATH=C:\Program Files\nodejs;%PATH%" && npm run dev"

:: Wait 2 seconds for Vite dev server to start
timeout /t 2 /nobreak >nul

:: 3. Automatically open in default browser (Chrome)
echo Opening http://localhost:8080/ in your browser...
start http://localhost:8080/

echo.
echo ========================================================
echo   RBC Insight AI is now running!
echo   Website URL: http://localhost:8080/
echo   API Docs:    http://localhost:8000/docs
echo ========================================================
