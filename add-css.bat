@echo off
setlocal

rem Ejecutar este archivo en la carpeta de los .htm exportados por Untis.
rem Anade el enlace a untis.css si el archivo todavia no lo tiene.

powershell -NoProfile -ExecutionPolicy Bypass -Command "Get-ChildItem '*.htm' | ForEach-Object { $c = [System.IO.File]::ReadAllText($_.FullName); if (-not $c.Contains('untis.css')) { $c = $c.Replace('</head>', '<link rel=' + [char]34 + 'stylesheet' + [char]34 + ' type=' + [char]34 + 'text/css' + [char]34 + ' href=' + [char]34 + 'untis.css' + [char]34 + '>' + [Environment]::NewLine + '</head>'); [System.IO.File]::WriteAllText($_.FullName, $c, [System.Text.Encoding]::Default); Write-Host 'OK: '$_.Name } else { Write-Host 'Ya tiene: '$_.Name } }"

echo.
pause
