@echo off
chcp 65001 >nul
title LA PIZARRA - El reloj que publica solo
cd /d "%~dp0"

:menu
cls
python "supabase\reloj.py"

echo   ──────────────────────────────────────────────────
echo     1  Apagar   (deja de publicar solo)
echo     2  Encender
echo     3  Salir
echo   ──────────────────────────────────────────────────
echo.
set /p op=  "Que hago? "

if "%op%"=="1" ( python "supabase\reloj.py" apagar & pause & goto menu )
if "%op%"=="2" ( python "supabase\reloj.py" encender & pause & goto menu )
