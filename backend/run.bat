@echo off
chcp 65001 > nul
echo ===================================
echo   Starting Spring Boot Backend...
echo ===================================
cd demo
docker compose up -d --build

if %ERRORLEVEL% EQU 0 (
    echo.
    echo [SUCCESS] Backend successfully launched!
    echo Application logs:
    docker compose logs -f
) else (
    echo.
    echo [ERROR] Failed to start containers. Check Docker Desktop status.
    pause
)