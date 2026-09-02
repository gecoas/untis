param(
    [Parameter(Mandatory = $true)]
    [string]$Root
)

$ErrorActionPreference = 'Stop'
$folders = 'clases-pri', 'prof-pri', 'clases-eso', 'prof-eso'

foreach ($folder in $folders) {
    $path = Join-Path $Root $folder
    if (-not (Test-Path $path)) {
        throw "No existe $folder en la copia temporal"
    }

    $htmlFiles = @(Get-ChildItem -Path $path -Filter '*.htm' -File)
    if ($htmlFiles.Count -eq 0) {
        throw "$folder no contiene archivos .htm en la copia temporal"
    }

    if ($folder.StartsWith('clases-') -and -not (Test-Path (Join-Path $path 'Clases.htm'))) {
        throw "$folder no contiene Clases.htm"
    }

    if ($folder.StartsWith('prof-') -and -not (Test-Path (Join-Path $path 'Profesores.htm'))) {
        throw "$folder no contiene Profesores.htm"
    }
}

Write-Host 'Validacion previa al commit correcta.'
