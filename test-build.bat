@echo off
REM Test Production Build Locally (Windows)

echo.
echo 🧪 Testing Production Build...
echo.

REM Step 1: Clean previous builds
echo 📦 Cleaning previous builds...
if exist "apps\web\.next" rd /s /q "apps\web\.next"
if exist "apps\web\out" rd /s /q "apps\web\out"

REM Step 2: Install dependencies
echo 📥 Installing dependencies...
call pnpm install

REM Step 3: Build the project
echo 🔨 Building Next.js app...
cd apps\web
call pnpm build

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✅ Build successful!
    echo.
    echo 🚀 To test production build locally, run:
    echo    cd apps\web ^&^& pnpm start
    echo.
    echo Then open: http://localhost:3000
) else (
    echo.
    echo ❌ Build failed! Check the errors above.
    echo.
    echo Common issues:
    echo   - TypeScript errors → Run: pnpm type-check
    echo   - Missing dependencies → Run: pnpm install
    echo   - Database connection → Check DATABASE_URL in .env.local
)

cd ..\..
pause
