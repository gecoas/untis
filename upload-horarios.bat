@echo off
setlocal

rem Ejecutar desde la carpeta que contiene:
rem clases-pri, prof-pri, clases-eso y prof-eso.
rem Requiere Git instalado y autenticado en GitHub.

set "REPO_URL=https://github.com/gecoas/untis.git"
set "ROOT=%~dp0"
set "WORK_DIR=%TEMP%\untis-upload-repo"
set "COMMIT_MSG=Subir horarios Untis"
set "LOG=%ROOT%upload-horarios.log"

echo Inicio %DATE% %TIME% > "%LOG%"

where git >> "%LOG%" 2>&1
if errorlevel 1 goto falta_git

where powershell >> "%LOG%" 2>&1
if errorlevel 1 goto falta_powershell

call :validar_carpeta clases-pri || goto error
call :validar_carpeta prof-pri || goto error
call :validar_carpeta clases-eso || goto error
call :validar_carpeta prof-eso || goto error

if exist "%WORK_DIR%\" (
    echo Eliminando carpeta temporal... >> "%LOG%"
    rmdir /s /q "%WORK_DIR%" >> "%LOG%" 2>&1
    if errorlevel 1 goto error_limpieza
)

echo Clonando repositorio...
echo Clonando repositorio... >> "%LOG%"
git clone "%REPO_URL%" "%WORK_DIR%" >> "%LOG%" 2>&1
if errorlevel 1 goto error_clone
echo Repositorio clonado. >> "%LOG%"

call :procesar_carpeta clases-pri || goto error
call :procesar_carpeta prof-pri || goto error
call :procesar_carpeta clases-eso || goto error
call :procesar_carpeta prof-eso || goto error

echo Coloreando lecciones...
echo Coloreando lecciones... >> "%LOG%"
powershell -NoProfile -ExecutionPolicy Bypass -File "%WORK_DIR%\scripts\color-lessons.ps1" -Root "%WORK_DIR%" >> "%LOG%" 2>&1
if errorlevel 1 goto error_colores

cd /d "%WORK_DIR%"
if errorlevel 1 goto error

git add -A >> "%LOG%" 2>&1
if errorlevel 1 goto error

git diff --cached --quiet
if not errorlevel 1 goto sin_cambios

echo Creando commit...
echo Creando commit... >> "%LOG%"
git commit -m "%COMMIT_MSG%" >> "%LOG%" 2>&1
if errorlevel 1 goto error_commit

echo Subiendo a GitHub...
echo Subiendo a GitHub... >> "%LOG%"
git push origin main >> "%LOG%" 2>&1
if errorlevel 1 goto error_push

echo Fin %DATE% %TIME% >> "%LOG%"
echo.
echo Horarios subidos correctamente a GitHub.
pause
exit /b 0

:validar_carpeta
if not exist "%ROOT%%~1\" (
    echo ERROR: No existe la carpeta %~1 junto a este .bat.
    echo ERROR: No existe la carpeta %~1 junto a este .bat. >> "%LOG%"
    exit /b 1
)
dir "%ROOT%%~1\*.htm" /b >nul 2>nul
if errorlevel 1 (
    echo ERROR: La carpeta %~1 no contiene archivos .htm.
    echo ERROR: La carpeta %~1 no contiene archivos .htm. >> "%LOG%"
    exit /b 1
)
exit /b 0

:procesar_carpeta
echo Copiando %~1...
echo Copiando %~1... >> "%LOG%"
if exist "%WORK_DIR%\%~1\" rmdir /s /q "%WORK_DIR%\%~1" >> "%LOG%" 2>&1
mkdir "%WORK_DIR%\%~1" >> "%LOG%" 2>&1
if errorlevel 1 exit /b 1
powershell -NoProfile -ExecutionPolicy Bypass -Command "$ErrorActionPreference = 'Stop'; Copy-Item -LiteralPath '%ROOT%%~1\*' -Destination '%WORK_DIR%\%~1' -Recurse -Force -Exclude 'Thumbs.db','Desktop.ini'" >> "%LOG%" 2>&1
if errorlevel 1 (
    echo ERROR: Fallo al copiar %~1.
    echo ERROR: Fallo al copiar %~1. >> "%LOG%"
    exit /b 1
)
copy /y "%WORK_DIR%\untis.css" "%WORK_DIR%\%~1\untis.css" >> "%LOG%" 2>&1
if errorlevel 1 exit /b 1
echo Preparando %~1...
echo Preparando %~1... >> "%LOG%"
powershell -NoProfile -ExecutionPolicy Bypass -File "%WORK_DIR%\scripts\prepare-horarios.ps1" -Folder "%WORK_DIR%\%~1" >> "%LOG%" 2>&1
if errorlevel 1 exit /b 1
exit /b 0

:falta_git
echo ERROR: Git no esta instalado o no esta en el PATH.
echo Instala Git for Windows: https://git-scm.com/download/win
echo ERROR: Git no esta instalado o no esta en el PATH. >> "%LOG%"
pause
exit /b 1

:falta_powershell
echo ERROR: PowerShell no esta disponible.
echo ERROR: PowerShell no esta disponible. >> "%LOG%"
pause
exit /b 1

:error_limpieza
echo ERROR: No se pudo eliminar la carpeta temporal.
goto mostrar_log

:error_clone
echo ERROR: No se pudo clonar el repositorio.
echo Comprueba que tienes acceso a GitHub y que Git esta autenticado.
goto mostrar_log

:error_colores
echo ERROR: No se pudieron colorear las lecciones.
goto mostrar_log

:error_commit
echo ERROR: No se pudo crear el commit.
goto mostrar_log

:error_push
echo ERROR: No se pudo hacer push.
echo Comprueba tu autenticacion de GitHub en Windows.
goto mostrar_log

:sin_cambios
echo No hay cambios nuevos que subir.
echo No hay cambios nuevos que subir. >> "%LOG%"
pause
exit /b 0

:error
echo ERROR: El proceso se ha detenido.
goto mostrar_log

:mostrar_log
echo Revisa el log: %LOG%
pause
exit /b 1
