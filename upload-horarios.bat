@echo off
setlocal enabledelayedexpansion

rem Ejecutar desde la carpeta que contiene:
rem clases-pri, prof-pri, clases-eso y prof-eso.
rem Requiere Git instalado y autenticado en GitHub.

set "REPO_URL=https://github.com/gecoas/untis.git"
set "ROOT=%~dp0"
set "WORK_DIR=%TEMP%\untis-upload-repo"
set "FOLDERS=clases-pri prof-pri clases-eso prof-eso"
set "COMMIT_MSG=Subir horarios Untis"
set "LOG=%ROOT%upload-horarios.log"

echo Inicio %DATE% %TIME% > "%LOG%"

where git >> "%LOG%" 2>&1
if errorlevel 1 (
    echo ERROR: Git no esta instalado o no esta en el PATH.
    echo Instala Git for Windows: https://git-scm.com/download/win
    echo ERROR: Git no esta instalado o no esta en el PATH. >> "%LOG%"
    pause
    exit /b 1
)

where powershell >> "%LOG%" 2>&1
if errorlevel 1 (
    echo ERROR: PowerShell no esta disponible.
    echo ERROR: PowerShell no esta disponible. >> "%LOG%"
    pause
    exit /b 1
)

set "MISSING=0"
for %%d in (%FOLDERS%) do (
    if not exist "%ROOT%%%d\" (
        echo ERROR: No existe la carpeta %%d junto a este .bat.
        echo ERROR: No existe la carpeta %%d junto a este .bat. >> "%LOG%"
        set "MISSING=1"
    ) else (
        dir "%ROOT%%%d\*.htm" /b >nul 2>nul
        if errorlevel 1 (
            echo ERROR: La carpeta %%d no contiene archivos .htm.
            echo ERROR: La carpeta %%d no contiene archivos .htm. >> "%LOG%"
            set "MISSING=1"
        )
    )
)

if "%MISSING%"=="1" (
    echo Deben estar junto a este .bat: %FOLDERS%
    pause
    exit /b 1
)

if exist "%WORK_DIR%\" (
    echo Eliminando carpeta temporal... >> "%LOG%"
    rmdir /s /q "%WORK_DIR%" >> "%LOG%" 2>&1
)

echo Clonando repositorio...
echo Clonando repositorio... >> "%LOG%"
git clone "%REPO_URL%" "%WORK_DIR%" >> "%LOG%" 2>&1
if errorlevel 1 (
    echo ERROR: No se pudo clonar el repositorio.
    echo Comprueba que tienes acceso a GitHub y que Git esta autenticado.
    echo Revisa el log: %LOG%
    pause
    exit /b 1
)

for %%d in (%FOLDERS%) do (
    echo Copiando %%d...
    echo Copiando %%d... >> "%LOG%"
    if exist "%WORK_DIR%\%%d\" rmdir /s /q "%WORK_DIR%\%%d" >> "%LOG%" 2>&1
    mkdir "%WORK_DIR%\%%d" >> "%LOG%" 2>&1
    robocopy "%ROOT%%%d" "%WORK_DIR%\%%d" /E /XD .git /XF Thumbs.db Desktop.ini >> "%LOG%" 2>&1
    if errorlevel 8 (
        echo ERROR: Fallo al copiar %%d.
        echo Revisa el log: %LOG%
        pause
        exit /b 1
    )
    copy /y "%WORK_DIR%\untis.css" "%WORK_DIR%\%%d\untis.css" >> "%LOG%" 2>&1
    if errorlevel 1 (
        echo ERROR: No se pudo copiar untis.css en %%d.
        echo Revisa el log: %LOG%
        pause
        exit /b 1
    )
    echo Preparando %%d...
    echo Preparando %%d... >> "%LOG%"
    powershell -NoProfile -ExecutionPolicy Bypass -File "%WORK_DIR%\scripts\prepare-horarios.ps1" -Folder "%WORK_DIR%\%%d" >> "%LOG%" 2>&1
    if errorlevel 1 (
        echo ERROR: No se pudo preparar %%d.
        echo Revisa el log: %LOG%
        pause
        exit /b 1
    )
)

echo Coloreando lecciones...
echo Coloreando lecciones... >> "%LOG%"
powershell -NoProfile -ExecutionPolicy Bypass -File "%WORK_DIR%\scripts\color-lessons.ps1" -Root "%WORK_DIR%" >> "%LOG%" 2>&1
if errorlevel 1 (
    echo ERROR: No se pudieron colorear las lecciones.
    echo Revisa el log: %LOG%
    pause
    exit /b 1
)

cd /d "%WORK_DIR%"

git add -A >> "%LOG%" 2>&1
git diff --cached --quiet
if not errorlevel 1 (
    echo No hay cambios nuevos que subir.
    echo No hay cambios nuevos que subir. >> "%LOG%"
    pause
    exit /b 0
)

echo Creando commit...
echo Creando commit... >> "%LOG%"
git commit -m "%COMMIT_MSG%" >> "%LOG%" 2>&1
if errorlevel 1 (
    echo ERROR: No se pudo crear el commit.
    echo Revisa el log: %LOG%
    pause
    exit /b 1
)

echo Subiendo a GitHub...
echo Subiendo a GitHub... >> "%LOG%"
git push origin main >> "%LOG%" 2>&1
if errorlevel 1 (
    echo ERROR: No se pudo hacer push.
    echo Comprueba tu autenticacion de GitHub en Windows.
    echo Revisa el log: %LOG%
    pause
    exit /b 1
)

echo Fin %DATE% %TIME% >> "%LOG%"
echo.
echo Horarios subidos correctamente a GitHub.
pause
