@echo off
cd /d "%~dp0"
echo Discs for Sale - first-time setup
where node >nul 2>nul
if errorlevel 1 goto no_node
call npm.cmd ci
if errorlevel 1 goto failed
echo Open http://127.0.0.1:5173/ after Vite is ready.
call npm.cmd run dev
goto end
:no_node
echo Install Node.js LTS 22.12.0 or newer from https://nodejs.org/
goto end
:failed
echo Setup failed. Copy the error above for help.
:end
pause
