param(
    [Parameter(Mandatory = $true)]
    [string]$Source,

    [Parameter(Mandatory = $true)]
    [string]$Destination
)

$ErrorActionPreference = 'Stop'

if (-not (Test-Path $Source)) {
    throw "No existe la carpeta origen: $Source"
}

if (-not (Test-Path $Destination)) {
    New-Item -ItemType Directory -Path $Destination | Out-Null
}

$sourceRoot = (Resolve-Path $Source).Path.TrimEnd('\')
$files = Get-ChildItem -Path $sourceRoot -Recurse -File | Where-Object {
    $_.Name -ne 'Thumbs.db' -and $_.Name -ne 'Desktop.ini'
}

foreach ($file in $files) {
    $relativePath = $file.FullName.Substring($sourceRoot.Length).TrimStart('\')
    $targetPath = Join-Path $Destination $relativePath
    $targetDir = Split-Path $targetPath -Parent
    if (-not (Test-Path $targetDir)) {
        New-Item -ItemType Directory -Path $targetDir | Out-Null
    }
    Copy-Item -LiteralPath $file.FullName -Destination $targetPath -Force
}

Write-Host "Copiados $($files.Count) archivos desde $Source"
