@echo off
setlocal

rem Ejecutar este archivo dentro de la carpeta clases.
rem Convierte los .htm exportados por Untis a UTF-8 y actualiza el charset.

powershell -NoProfile -ExecutionPolicy Bypass -Command "Get-ChildItem '*.htm' | ForEach-Object { $c = [System.IO.File]::ReadAllText($_.FullName, [System.Text.Encoding]::Default); $c = $c -replace 'charset=iso-8859-1', 'charset=utf-8'; [System.IO.File]::WriteAllText($_.FullName, $c, (New-Object System.Text.UTF8Encoding($false))); Write-Host 'UTF-8: '$_.Name }"

echo.
echo Conversion terminada.
pause
