@echo off
chcp 65001 >nul
title LA PIZARRA - Pegar token
cd /d "%~dp0"

echo.
echo   ══════════════════════════════════════════════════
echo    PEGAR UN TOKEN
echo   ══════════════════════════════════════════════════
echo.
echo    1. Se abre el Bloc de notas
echo    2. Pega el token despues del signo =
echo    3. Guarda (Ctrl+S) y CIERRA la ventana
echo.
echo    En cuanto la cierres, se sube solo.
echo.

if not exist "datos\tokens_pendientes.txt" (
  python "supabase\secretos.py"
)

rem /wait: no seguimos hasta que cierre el Bloc de notas
start /wait notepad.exe "datos\tokens_pendientes.txt"

echo.
python "supabase\secretos.py"

echo.
pause
