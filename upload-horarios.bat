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

set "MISSING=0"
for %%d in (%FOLDERS%) do (
    if not exist "%ROOT%%%d\" (
        echo ERROR: No existe la carpeta %%d junto a este .bat.
        set "MISSING=1"
    ) else (
        dir "%ROOT%%%d\*.htm" /b >nul 2>nul
        if errorlevel 1 (
            echo ERROR: La carpeta %%d no contiene archivos .htm.
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
        powershell -NoProfile -ExecutionPolicy Bypass -Command "$utf8Strict = New-Object System.Text.UTF8Encoding -ArgumentList $false, $true; $utf8NoBom = New-Object System.Text.UTF8Encoding -ArgumentList $false; $win1252 = [System.Text.Encoding]::GetEncoding(1252); $codes = 0x00E1,0x00E9,0x00ED,0x00F3,0x00FA,0x00C1,0x00C9,0x00CD,0x00D3,0x00DA,0x00F1,0x00D1,0x00FC,0x00DC,0x00BA,0x00AA; Get-ChildItem '%WORK_DIR%\%%d\*.htm' | ForEach-Object { $bytes = [System.IO.File]::ReadAllBytes($_.FullName); try { $c = $utf8Strict.GetString($bytes) } catch { $c = [System.Text.Encoding]::Default.GetString($bytes) }; if (-not $c.Contains('untis.css')) { $c = $c.Replace('</head>', '<link rel=' + [char]34 + 'stylesheet' + [char]34 + ' type=' + [char]34 + 'text/css' + [char]34 + ' href=' + [char]34 + 'untis.css' + [char]34 + '>' + [Environment]::NewLine + '</head>') }; if (($_.BaseName -eq 'Clases' -or $_.BaseName -eq 'Profesores') -and (-not $c.Contains('home-link'))) { $c = $c -replace '<CENTER>', '<CENTER><div class=''home-link-wrap''><a class=''home-link'' href=''../index.html''>&#8592; Volver al inicio</a></div>' }; $c = $c -replace 'charset=iso-8859-1', 'charset=utf-8'; foreach ($code in $codes) { $good = [string][char]$code; $bad = $good; 1..3 | ForEach-Object { $bad = $win1252.GetString([System.Text.Encoding]::UTF8.GetBytes($bad)); $c = $c.Replace($bad, $good) } }; $c = $c -replace '<img\s+src=\"GpPrev\.gif\"[^>]*>', '<span class=\"nav-icon nav-prev\">&#8592;</span>'; $c = $c -replace '<img\s+src=\"GpIndex\.gif\"[^>]*>', '<span class=\"nav-icon nav-home\">&#127968;</span>'; $c = $c -replace '<img\s+src=\"GpNext\.gif\"[^>]*>', '<span class=\"nav-icon nav-next\">&#8594;</span>'; [System.IO.File]::WriteAllText($_.FullName, $c, $utf8NoBom) }"
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
