@echo off
setlocal
title Push HotelPro to GitHub

set "GIT_EXE=%LOCALAPPDATA%\Programs\MinGit\cmd\git.exe"
if not exist "%GIT_EXE%" (
    set "GIT_EXE=git"
)

echo ==========================================================
echo        HotelPro: Push Repository to GitHub
echo ==========================================================
echo.

set /p REPO_INPUT="Enter your GitHub Repository URL or GitHub Username (default repo name: en24cs3010782-pedg): "

if "%REPO_INPUT%"=="" (
    echo [ERROR] No input provided.
    pause
    exit /b 1
)

:: Check if user entered full URL or just username
echo %REPO_INPUT% | findstr /i "github.com" >nul
if %errorlevel% equ 0 (
    set "REMOTE_URL=%REPO_INPUT%"
) else (
    set "REMOTE_URL=https://github.com/%REPO_INPUT%/en24cs3010782-pedg.git"
)

echo.
echo Setting remote origin to: %REMOTE_URL%
"%GIT_EXE%" remote remove origin 2>nul
"%GIT_EXE%" remote add origin %REMOTE_URL%
"%GIT_EXE%" branch -M main

echo.
echo Pushing to GitHub (main branch)...
"%GIT_EXE%" push -u origin main

if %errorlevel% equ 0 (
    echo.
    echo ==========================================================
    echo [SUCCESS] Repository pushed successfully to GitHub!
    echo Your GitHub Link: %REMOTE_URL%
    echo Paste this link into Skill Wallet under "Add Github Link".
    echo ==========================================================
) else (
    echo.
    echo ==========================================================
    echo [NOTE] If GitHub asked for authentication:
    echo 1. Ensure you have created the repository on github.com
    echo 2. When prompted for password, enter a GitHub Personal Access Token (PAT).
    echo ==========================================================
)

echo.
pause
