@echo off
setlocal EnableDelayedExpansion
title Push HotelPro to GitHub

set "GIT_EXE=%LOCALAPPDATA%\Programs\MinGit\cmd\git.exe"
if not exist "%GIT_EXE%" (
    set "GIT_EXE=git"
)

echo ==========================================================
echo        HotelPro: Push Repository to GitHub
echo ==========================================================
echo.
echo Your project has already been committed to git locally!
echo.
echo Please enter your GitHub Username or full repository URL.
echo (Press Enter to use default: https://github.com/en24cs3010782-pedg/en24cs3010782-pedg.git)
echo.

set "REPO_INPUT="
set /p REPO_INPUT="GitHub Username or Repository URL: "

if "%REPO_INPUT%"=="" (
    set "REMOTE_URL=https://github.com/en24cs3010782-pedg/en24cs3010782-pedg.git"
) else (
    echo %REPO_INPUT% | findstr /i "github.com" >nul
    if !errorlevel! equ 0 (
        set "REMOTE_URL=%REPO_INPUT%"
    ) else (
        set "REMOTE_URL=https://github.com/%REPO_INPUT%/en24cs3010782-pedg.git"
    )
)

echo.
echo [1/3] Configuring remote origin: !REMOTE_URL!
"%GIT_EXE%" remote remove origin 2>nul
"%GIT_EXE%" remote add origin !REMOTE_URL!
"%GIT_EXE%" branch -M main

echo.
echo [2/3] Pushing to GitHub (main branch)...
echo (A GitHub login window or credential prompt will appear if not already signed in)
"%GIT_EXE%" push -u origin main

if !errorlevel! equ 0 (
    echo.
    echo ==========================================================
    echo  [SUCCESS] Code pushed successfully to GitHub!
    echo.
    echo  Your GitHub Link for Skill Wallet:
    echo  !REMOTE_URL!
    echo ==========================================================
) else (
    echo.
    echo ==========================================================
    echo  [NOTE] Push did not complete. Common reasons:
    echo  1. The repository has not been created on GitHub yet.
    echo     Please create it at: https://github.com/new
    echo  2. Authentication required: Sign in to your GitHub account
    echo     or provide a Personal Access Token (PAT).
    echo ==========================================================
)

echo.
pause
