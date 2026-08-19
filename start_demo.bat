@echo off
title AI-Kumbh-DSS Demo Launcher
color 0A
echo.
echo  ============================================================
echo   AI-Kumbh-DSS -- College Demo Launcher
echo   Nashik Kumbh Mela 2027-2028 Decision Support System
echo  ============================================================
echo.
echo  Starting all services... Please wait.
echo.
echo  [1/4] Starting Ollama (RAG AI)...
start "Ollama - KumbhAI RAG" cmd /k "ollama serve"
timeout /t 3 /nobreak >nul
echo  [2/4] Starting FastAPI Backend (port 8000)...
start "Backend - FastAPI" cmd /k "cd /d %~dp0backend && venv\Scripts\activate && uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"
timeout /t 4 /nobreak >nul
echo  [3/4] Starting Vite Frontend (port 5173)...
start "Frontend - Vite" cmd /k "cd /d %~dp0frontend && npm run dev"
timeout /t 5 /nobreak >nul
echo  [4/4] Starting ngrok tunnel (public URL)...
start "ngrok Tunnel" cmd /k "ngrok http 5173"
echo.
echo  All services started! Opening dashboard...
timeout /t 6 /nobreak >nul
start http://localhost:5173
pause
