@echo off
cd /d "%~dp0"
echo.
echo  Local preview: http://127.0.0.1:8765/
echo  Press Ctrl+C to stop the server.
echo.
python -m http.server 8765 --bind 127.0.0.1
