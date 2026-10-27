@echo off
title HotelPro Localhost Web Server (Port 3000)
echo ==========================================================
echo Starting HotelPro on http://localhost:3000/
echo ==========================================================
powershell -ExecutionPolicy Bypass -File "%~dp0serve.ps1"
pause
