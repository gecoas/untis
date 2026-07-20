@echo off
setlocal enabledelayedexpansion

rem Ejecutar desde la carpeta que contiene:
rem clases-pri, prof-pri, clases-eso y prof-eso.
rem Copia untis.css en cada carpeta, anade el CSS a los .htm,
rem convierte los .htm a UTF-8 y cambia los GIF antiguos por botones.

set "ROOT=%~dp0"
set "FOLDERS=clases-pri prof-pri clases-eso prof-eso"

if not exist "%ROOT%untis.css" (
    echo ERROR: No existe "%ROOT%untis.css".
    pause
    exit /b 1
)

for %%d in (%FOLDERS%) do (
    if exist "%ROOT%%%d\" (
        echo Procesando %%d...
        copy /y "%ROOT%untis.css" "%ROOT%%%d\untis.css" >nul
        powershell -NoProfile -ExecutionPolicy Bypass -Command "Get-ChildItem '%ROOT%%%d\*.htm' | ForEach-Object { $c = [System.IO.File]::ReadAllText($_.FullName, [System.Text.Encoding]::Default); if (-not $c.Contains('untis.css')) { $c = $c.Replace('</head>', '<link rel=' + [char]34 + 'stylesheet' + [char]34 + ' type=' + [char]34 + 'text/css' + [char]34 + ' href=' + [char]34 + 'untis.css' + [char]34 + '>' + [Environment]::NewLine + '</head>') }; $c = $c -replace 'charset=iso-8859-1', 'charset=utf-8'; $c = $c -replace '<img\s+src=\"GpPrev\.gif\"[^>]*>', '<span class=\"nav-icon nav-prev\">&#8592;</span>'; $c = $c -replace '<img\s+src=\"GpIndex\.gif\"[^>]*>', '<span class=\"nav-icon nav-home\">&#127968;</span>'; $c = $c -replace '<img\s+src=\"GpNext\.gif\"[^>]*>', '<span class=\"nav-icon nav-next\">&#8594;</span>'; [System.IO.File]::WriteAllText($_.FullName, $c, (New-Object System.Text.UTF8Encoding($false))); Write-Host 'OK: '$_.Name }"
        if errorlevel 1 (
            echo ERROR procesando %%d.
            pause
            exit /b 1
        )
    ) else (
        echo Aviso: no existe %%d, se omite.
    )
)

echo.
echo Carpetas procesadas.
pause
