@echo off
title CABINA - Diseno y Medios - IBERO Tijuana
pushd "%~dp0"

where python >nul 2>nul
if %errorlevel% equ 0 (
    python servidor.py
    goto fin
)

if exist "%LOCALAPPDATA%\Programs\Python\Python312\python.exe" (
    "%LOCALAPPDATA%\Programs\Python\Python312\python.exe" servidor.py
    goto fin
)

echo.
echo   No se encontro Python en este equipo.
echo   Instalalo desde https://www.python.org/downloads/
echo   y marca la casilla "Add Python to PATH".
echo.
pause

:fin
popd
