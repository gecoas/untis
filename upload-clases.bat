@echo off
setlocal enabledelayedexpansion

rem Ejecutar este archivo desde C:\Users\AsociacionAA\Desktop\Untis
rem Debe existir la carpeta .\clases al lado de este .bat.
rem Requiere Git instalado y autenticado en GitHub.

set "REPO_URL=https://github.com/gecoas/untis.git"
set "SOURCE_DIR=%~dp0clases"
set "WORK_DIR=%TEMP%\untis-upload-repo"
set "COMMIT_MSG=Subir carpeta clases"

if not exist "%SOURCE_DIR%\" (
    echo ERROR: No existe la carpeta "%SOURCE_DIR%".
    echo Guarda este .bat en C:\Users\AsociacionAA\Desktop\Untis, junto a la carpeta clases.
    pause
    exit /b 1
)

where git >nul 2>nul
if errorlevel 1 (
    echo ERROR: Git no esta instalado o no esta en el PATH.
    echo Instala Git for Windows: https://git-scm.com/download/win
    pause
    exit /b 1
)

if exist "%WORK_DIR%\" (
    rmdir /s /q "%WORK_DIR%"
)

echo Clonando repositorio...
git clone "%REPO_URL%" "%WORK_DIR%"
if errorlevel 1 (
    echo ERROR: No se pudo clonar el repositorio.
    echo Comprueba que tienes acceso a GitHub y que Git esta autenticado.
    pause
    exit /b 1
)

echo Copiando carpeta clases...
if exist "%WORK_DIR%\clases\" (
    rmdir /s /q "%WORK_DIR%\clases"
)
mkdir "%WORK_DIR%\clases" >nul 2>nul
robocopy "%SOURCE_DIR%" "%WORK_DIR%\clases" /E /XD .git /XF Thumbs.db Desktop.ini >nul
if errorlevel 8 (
    echo ERROR: Fallo al copiar la carpeta clases.
    pause
    exit /b 1
)

echo Convirtiendo HTML a UTF-8...
powershell -NoProfile -ExecutionPolicy Bypass -Command "Get-ChildItem '%WORK_DIR%\clases\*.htm' | ForEach-Object { $c = [System.IO.File]::ReadAllText($_.FullName, [System.Text.Encoding]::Default); $c = $c -replace 'charset=iso-8859-1', 'charset=utf-8'; [System.IO.File]::WriteAllText($_.FullName, $c, (New-Object System.Text.UTF8Encoding($false))) }"
if errorlevel 1 (
    echo ERROR: No se pudo convertir los HTML a UTF-8.
    pause
    exit /b 1
)

cd /d "%WORK_DIR%"

git add clases
git diff --cached --quiet
if not errorlevel 1 (
    echo No hay cambios nuevos que subir.
    pause
    exit /b 0
)

echo Creando commit...
git commit -m "%COMMIT_MSG%"
if errorlevel 1 (
    echo ERROR: No se pudo crear el commit.
    pause
    exit /b 1
)

echo Subiendo a GitHub...
git push origin main
if errorlevel 1 (
    echo ERROR: No se pudo hacer push.
    echo Comprueba tu autenticacion de GitHub en Windows.
    pause
    exit /b 1
)

echo.
echo Carpeta clases subida correctamente a GitHub.
pause
