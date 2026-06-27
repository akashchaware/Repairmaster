@echo off
title RepairingMaster Dev Server
echo Starting dev server...
start /B python serve.py > nul 2>&1
timeout /t 2 /nobreak > nul
start http://localhost:5500/
echo Server running at http://localhost:5500/
echo Edit any file and the browser will auto-refresh.
pause
