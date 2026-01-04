@echo off
echo ========================================
echo   CryptoJournal - Setup Script
echo ========================================
echo.

REM Check if node_modules exists
if not exist "node_modules\" (
    echo [1/3] Installing dependencies...
    echo This may take a few minutes...
    echo.
    call npm install
    echo.
    echo Dependencies installed successfully!
    echo.
) else (
    echo [INFO] Dependencies already installed. Skipping...
    echo.
)

REM Check if .env.local exists
if not exist ".env.local" (
    echo [2/3] Creating environment file...
    (
        echo JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
        echo NEXT_PUBLIC_API_URL=http://localhost:3000
    ) > .env.local
    echo Environment file created successfully!
    echo.
) else (
    echo [INFO] Environment file already exists. Skipping...
    echo.
)

echo [3/3] Starting development server...
echo.
echo ========================================
echo   Server starting at http://localhost:3000
echo ========================================
echo.
echo Demo Account:
echo   Email: demo@crypto.com
echo   Password: demo123
echo.
echo Press Ctrl+C to stop the server
echo ========================================
echo.

npm run dev

