@echo off
setlocal EnableDelayedExpansion
title FAST GITHUB PUSH - HotelPro
color 0A

set "GIT_EXE=%LOCALAPPDATA%\Programs\MinGit\cmd\git.exe"
if not exist "%GIT_EXE%" set "GIT_EXE=git"

echo ================================================================
echo           FAST 1-CLICK GITHUB PUSH (HotelPro)
echo ================================================================
echo.
echo Step 1: Click "Create repository" in the GitHub page that just opened.
echo Step 2: Copy your repository URL from GitHub (or just type your username).
echo.
set /p REPO_LINK="Paste your GitHub Repo URL or Username here: "

if "%REPO_LINK%"=="" (
    echo [ERROR] No input entered!
    pause
    exit /b 1
)

echo %REPO_LINK% | findstr /i "github.com" >nul
if !errorlevel! equ 0 (
    set "FINAL_URL=%REPO_LINK%"
) else (
    set "FINAL_URL=https://github.com/%REPO_LINK%/en24cs3010782-pedg.git"
)

echo.
echo Connecting to: !FINAL_URL!
"%GIT_EXE%" remote remove origin 2>nul
"%GIT_EXE%" remote add origin !FINAL_URL!
"%GIT_EXE%" branch -M main

echo.
echo Pushing code to GitHub now...
"%GIT_EXE%" push -u origin main

if !errorlevel! equ 0 (
    echo.
    echo ================================================================
    echo  SUCCESS! PROJECT PUSHED TO GITHUB!
    echo.
    echo  Your GitHub link to paste in Skill Wallet:
    echo  !FINAL_URL!
    echo ================================================================
) else (
    echo.
    echo [NOTE] Push failed. Make sure you clicked "Create repository" on GitHub first.
)

echo.
pause
