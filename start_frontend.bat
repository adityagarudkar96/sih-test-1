@echo off
echo Starting GeM AI Frontend on http://localhost:5173 ...
cd /d "%~dp0frontend"
npm run dev -- --host 0.0.0.0 --port 5173
pause
