# Ejecuta esto en PowerShell en cualquier carpeta de los .htm exportados por Untis.
# Anade el enlace al CSS a todos los archivos .htm.

$cssLink = '<link rel="stylesheet" type="text/css" href="untis.css">'

Get-ChildItem -Path ".\" -Filter "*.htm" | ForEach-Object {
    $content = Get-Content $_.FullName -Raw
    if ($content -notmatch "untis.css") {
        $content = $content -replace '</head>', "$cssLink`n</head>"
        Set-Content $_.FullName $content -Encoding Default
        Write-Host "CSS anadido a: $($_.Name)"
    } else {
        Write-Host "Ya tiene CSS: $($_.Name)"
    }
}

Write-Host "`nTodos los archivos actualizados. Copia untis.css en esta carpeta."
