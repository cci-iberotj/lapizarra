@echo off
chcp 65001 >nul
title LA PIZARRA - Token de Facebook
cd /d "%~dp0"

echo.
echo   ══════════════════════════════════════════════════
echo    TOKEN PERMANENTE DE FACEBOOK
echo   ══════════════════════════════════════════════════
echo.
echo    1. Se abre el Bloc de notas con las instrucciones
echo    2. Llena los tres renglones
echo    3. Guarda (Ctrl+S) y CIERRA la ventana
echo.

if not exist "datos\facebook_token.txt" (
  python "supabase\token_facebook.py"
)

rem /wait: no seguimos hasta que cierre el Bloc de notas
start /wait notepad.exe "datos\facebook_token.txt"

echo.
python "supabase\token_facebook.py"

echo.
pause
