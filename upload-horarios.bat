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

where git >nul 2>nul
if errorlevel 1 (
    echo ERROR: Git no esta instalado o no esta en el PATH.
    echo Instala Git for Windows: https://git-scm.com/download/win
    pause
    exit /b 1
)

set "FOUND=0"
for %%d in (%FOLDERS%) do (
    if exist "%ROOT%%%d\" set "FOUND=1"
)

if "%FOUND%"=="0" (
    echo ERROR: No se encontro ninguna carpeta de horarios.
    echo Deben estar junto a este .bat: %FOLDERS%
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

for %%d in (%FOLDERS%) do (
    if exist "%ROOT%%%d\" (
        echo Copiando %%d...
        if exist "%WORK_DIR%\%%d\" rmdir /s /q "%WORK_DIR%\%%d"
        mkdir "%WORK_DIR%\%%d" >nul 2>nul
        robocopy "%ROOT%%%d" "%WORK_DIR%\%%d" /E /XD .git /XF Thumbs.db Desktop.ini >nul
        if errorlevel 8 (
            echo ERROR: Fallo al copiar %%d.
            pause
            exit /b 1
        )
        copy /y "%WORK_DIR%\untis.css" "%WORK_DIR%\%%d\untis.css" >nul
        echo Preparando %%d...
        powershell -NoProfile -ExecutionPolicy Bypass -Command "Get-ChildItem '%WORK_DIR%\%%d\*.htm' | ForEach-Object { $c = [System.IO.File]::ReadAllText($_.FullName, [System.Text.Encoding]::Default); if (-not $c.Contains('untis.css')) { $c = $c.Replace('</head>', '<link rel=' + [char]34 + 'stylesheet' + [char]34 + ' type=' + [char]34 + 'text/css' + [char]34 + ' href=' + [char]34 + 'untis.css' + [char]34 + '>' + [Environment]::NewLine + '</head>') }; if (($_.BaseName -eq 'Clases' -or $_.BaseName -eq 'Profesores') -and (-not $c.Contains('home-link'))) { $c = $c -replace '<CENTER>', '<CENTER><div class=''home-link-wrap''><a class=''home-link'' href=''../index.html''>&#8592; Volver al inicio</a></div>' }; $c = $c -replace 'charset=iso-8859-1', 'charset=utf-8'; $c = $c -replace 'Ã‚º','º' -replace 'Ã‚ª','ª' -replace 'ÃƒÂ¡','á' -replace 'ÃƒÂ©','é' -replace 'ÃƒÂ­','í' -replace 'ÃƒÂ³','ó' -replace 'ÃƒÂº','ú' -replace 'ÃƒÂ±','ñ' -replace 'Ãƒ¡','á' -replace 'Ãƒé','é' -replace 'Ãƒí','í' -replace 'Ãƒó','ó' -replace 'Ãƒº','ú' -replace 'Ãƒñ','ñ' -replace 'Âº','º' -replace 'Âª','ª' -replace 'Ã¡','á' -replace 'Ã©','é' -replace 'Ã­','í' -replace 'Ã³','ó' -replace 'Ãº','ú' -replace 'Ã±','ñ' -replace 'Ã','Á'; $c = $c -replace '<img\s+src=\"GpPrev\.gif\"[^>]*>', '<span class=\"nav-icon nav-prev\">&#8592;</span>'; $c = $c -replace '<img\s+src=\"GpIndex\.gif\"[^>]*>', '<span class=\"nav-icon nav-home\">&#127968;</span>'; $c = $c -replace '<img\s+src=\"GpNext\.gif\"[^>]*>', '<span class=\"nav-icon nav-next\">&#8594;</span>'; [System.IO.File]::WriteAllText($_.FullName, $c, (New-Object System.Text.UTF8Encoding($false))) }"
        if errorlevel 1 (
            echo ERROR: No se pudo preparar %%d.
            pause
            exit /b 1
        )
    ) else (
        echo Aviso: no existe %%d, se omite.
    )
)

cd /d "%WORK_DIR%"

git add -A
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
echo Horarios subidos correctamente a GitHub.
pause
