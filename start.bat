@echo off
echo 🚀 Starting Vexryl Platform...
echo.

:: Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

:: Install dependencies
echo 📦 Installing dependencies...
cd apps\web
call npm install --legacy-peer-deps
cd ..\api
call npm install
cd ..\..

echo.
echo ✅ Dependencies installed!
echo.

:: Start both services
echo 🌐 Starting API server on http://localhost:3001...
echo 🎨 Starting web app on http://localhost:3000...
echo.
echo Press Ctrl+C to stop both servers
echo.

:: Run both in parallel
npm run dev
