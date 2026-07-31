param(
    [Parameter(Mandatory = $true)]
    [string]$Folder
)

$ErrorActionPreference = 'Stop'

$utf8Strict = New-Object System.Text.UTF8Encoding -ArgumentList $false, $true
$utf8NoBom = New-Object System.Text.UTF8Encoding -ArgumentList $false
$win1252 = [System.Text.Encoding]::GetEncoding(1252)
$codes = 0x00E1,0x00E9,0x00ED,0x00F3,0x00FA,0x00C1,0x00C9,0x00CD,0x00D3,0x00DA,0x00F1,0x00D1,0x00FC,0x00DC,0x00BA,0x00AA

if (-not (Test-Path $Folder)) {
    throw "No existe la carpeta: $Folder"
}

Get-ChildItem $Folder -Filter '*.htm' | ForEach-Object {
    $bytes = [System.IO.File]::ReadAllBytes($_.FullName)
    try {
        $content = $utf8Strict.GetString($bytes)
    } catch {
        $content = [System.Text.Encoding]::Default.GetString($bytes)
    }

    if (-not $content.Contains('untis.css')) {
        $cssLink = '<link rel="stylesheet" type="text/css" href="untis.css">' + [Environment]::NewLine
        $content = $content.Replace('</head>', $cssLink + '</head>')
    }

    if (($_.BaseName -eq 'Clases' -or $_.BaseName -eq 'Profesores') -and -not $content.Contains('home-link')) {
        $homeLink = '<CENTER><div class=''home-link-wrap''><a class=''home-link'' href=''../index.html''>&#8592; Volver al inicio</a></div>'
        $content = $content -replace '<CENTER>', $homeLink
    }

    $content = $content -replace 'charset=iso-8859-1', 'charset=utf-8'
    $content = $content.Replace('Ã‚º', 'º').Replace('Ã‚ª', 'ª').Replace('Âº', 'º').Replace('Âª', 'ª')
    foreach ($code in $codes) {
        $good = [string][char]$code
        $bad = $good
        1..3 | ForEach-Object {
            $bad = $win1252.GetString([System.Text.Encoding]::UTF8.GetBytes($bad))
            $content = $content.Replace($bad, $good)
        }
    }

    $content = $content -replace '<img\s+src="GpPrev\.gif"[^>]*>', '<span class="nav-icon nav-prev">&#8592;</span>'
    $content = $content -replace '<img\s+src="GpIndex\.gif"[^>]*>', '<span class="nav-icon nav-home">&#127968;</span>'
    $content = $content -replace '<img\s+src="GpNext\.gif"[^>]*>', '<span class="nav-icon nav-next">&#8594;</span>'

    $isIndex = $_.BaseName -eq 'Clases' -or $_.BaseName -eq 'Profesores'
    if (-not $isIndex -and $content.Contains('nav-icon') -and -not $content.Contains('top-nav')) {
        $navLinks = [regex]::Matches($content, '<A HREF="[^"]+"><span class="nav-icon [^"]+">.*?</span></A>') | ForEach-Object { $_.Value }
        if ($navLinks.Count -gt 0) {
            $topNav = '<div class="top-nav">' + [string]::Join('', $navLinks) + '</div>'
            $content = $content -replace '<CENTER>', ('<CENTER>' + $topNav)
        }
    }

    if (-not $isIndex -and -not $content.Contains('print-actions')) {
        $actions = '<div class="print-actions"><button class="print-action" onclick="window.print()">Descargar PDF</button><button class="print-action" onclick="window.print()">Imprimir</button></div>'
        $content = $content -replace '<CENTER>', ('<CENTER>' + $actions)
    }

    [System.IO.File]::WriteAllText($_.FullName, $content, $utf8NoBom)
}

Write-Host "Preparados $((Get-ChildItem $Folder -Filter '*.htm').Count) archivos en $Folder"
