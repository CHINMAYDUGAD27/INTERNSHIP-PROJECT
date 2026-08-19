@echo off
title Stop AI-Kumbh-DSS Demo
color 0C
echo.
echo  Stopping all demo services...
echo.
taskkill /F /IM ngrok.exe 2>nul && echo  [OK] ngrok stopped || echo  [--] ngrok was not running
taskkill /F /IM uvicorn.exe 2>nul && echo  [OK] Backend stopped || echo  [--] Backend was not running
echo  [OK] Frontend and Ollama windows can be closed manually.
echo.
echo  All services stopped. Press any key to exit.
pause >nul
