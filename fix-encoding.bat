@echo off
setlocal

rem Ejecutar este archivo dentro de cualquier carpeta de horarios Untis.
rem Convierte los .htm exportados por Untis a UTF-8 y actualiza el charset.

powershell -NoProfile -ExecutionPolicy Bypass -Command "Get-ChildItem '*.htm' | ForEach-Object { $c = [System.IO.File]::ReadAllText($_.FullName, [System.Text.Encoding]::Default); $badUpperA = [string]([char]0x00C3) + [char]0x0192 + [char]0x00C2 + [char]0x0081; $c = $c -replace 'charset=iso-8859-1', 'charset=utf-8'; $c = $c -replace $badUpperA, 'Á'; $c = $c -replace 'Ã‚º','º' -replace 'Ã‚ª','ª' -replace 'ÃƒÂ¡','á' -replace 'ÃƒÂ©','é' -replace 'ÃƒÂ­','í' -replace 'ÃƒÂ³','ó' -replace 'ÃƒÂº','ú' -replace 'ÃƒÂ±','ñ' -replace 'Ãƒ¡','á' -replace 'Ãƒé','é' -replace 'Ãƒí','í' -replace 'Ãƒó','ó' -replace 'Ãƒº','ú' -replace 'Ãƒñ','ñ' -replace 'Âº','º' -replace 'Âª','ª' -replace 'Ã¡','á' -replace 'Ã©','é' -replace 'Ã­','í' -replace 'Ã³','ó' -replace 'Ãº','ú' -replace 'Ã±','ñ' -replace 'Ã','Á'; [System.IO.File]::WriteAllText($_.FullName, $c, (New-Object System.Text.UTF8Encoding($false))); Write-Host 'UTF-8: '$_.Name }"

echo.
echo Conversion terminada.
pause
