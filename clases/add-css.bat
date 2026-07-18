@echo off
setlocal enabledelayedexpansion
for %%f in (*.htm) do (
    find "untis.css" "%%f" >nul
    if errorlevel 1 (
        set "tmp=%%f.bak"
        copy "%%f" "!tmp!" >nul
        (
        for /f "usebackq delims=" %%a in ("%%f") do (
            echo %%a
            set "line=%%a"
            if "!line!"=="</head>" echo ^<link rel="stylesheet" type="text/css" href="untis.css"^>
        )
        ) > "%%f.new"
        move /y "%%f.new" "%%f" >nul
        del "!tmp!" 2>nul
        echo OK: %%f
    ) else (
        echo Ya tiene: %%f
    )
)
echo.
echo Hecho. Copia untis.css en la carpeta.
pause