param(
    [string]$Root = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
)

$ErrorActionPreference = 'Stop'
$folders = 'clases-pri', 'prof-pri', 'clases-eso', 'prof-eso'
$colorCount = 20
$utf8NoBom = New-Object System.Text.UTF8Encoding -ArgumentList $false

function Strip-Tags([string]$Value) {
    return ($Value `
        -replace '<[^>]+>', ' ' `
        -replace '&nbsp;', ' ' `
        -replace '&amp;', '&' `
        -replace '&lt;', '<' `
        -replace '&gt;', '>' `
        -replace '&quot;', '"' `
        -replace '&#39;', "'" `
        -replace '\s+', ' ').Trim()
}

function Normalize-Key([string]$Value) {
    $normalized = (Strip-Tags $Value).Normalize([System.Text.NormalizationForm]::FormD)
    return ([regex]::Replace($normalized, '\p{Mn}', '')).ToLowerInvariant()
}

function Get-HashIndex([string]$Value) {
    $hash = 0
    foreach ($char in $Value.ToCharArray()) {
        $hash = (($hash * 31) + [int][char]$char) -band 0x7fffffff
    }
    return ($hash % $colorCount) + 1
}

function Get-LessonKey([string]$Body, [bool]$IsProfessorPage) {
    $subjectMatch = [regex]::Match($Body, '<B>([\s\S]*?)</B>', [Text.RegularExpressions.RegexOptions]::IgnoreCase)
    if (-not $subjectMatch.Success) { return '' }
    $subject = Normalize-Key ($subjectMatch.Groups[1].Value)
    if (-not $subject) { return '' }
    if (-not $IsProfessorPage) { return $subject }

    $rest = $Body.Substring($subjectMatch.Index + $subjectMatch.Length)
    $rows = [regex]::Matches($rest, '<TR><TD[^>]*>([\s\S]*?)</TD>\s*</TR>', [Text.RegularExpressions.RegexOptions]::IgnoreCase) |
        ForEach-Object { Strip-Tags ($_.Groups[1].Value) } |
        Where-Object { $_ -and $_ -notlike '*Untis*' }
    $group = ''
    if ($null -ne $rows -and $rows.Count -gt 0) {
        $group = $rows[0]
    }
    return (($subject, $group) | Where-Object { $_ }) -join '|'
}

function Add-LessonClass([string]$Attrs, [string]$ColorClass) {
    $next = [regex]::Replace($Attrs, '\sclass="[^"]*\blesson-color-\d+\b[^"]*"', '', [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)
    if ($next -match '\sclass="') {
        return [regex]::Replace($next, '\sclass="([^"]*)"', { param($match) ' class="' + ($match.Groups[1].Value + ' ' + $ColorClass).Trim() + '"' }, [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)
    }
    return $next + ' class="' + $ColorClass + '"'
}

$changed = 0
foreach ($folder in $folders) {
    $dir = Join-Path $Root $folder
    if (-not (Test-Path $dir)) { continue }
    $isProfessorPage = $folder.StartsWith('prof-')
    Get-ChildItem $dir -Filter '*.htm' | Where-Object { $_.BaseName -ne 'Clases' -and $_.BaseName -ne 'Profesores' } | ForEach-Object {
        $content = Get-Content $_.FullName -Raw -Encoding UTF8
        $original = $content
        $content = [regex]::Replace($content, '<TD([^>]*\bcolspan=\d+(?![^>]*\browspan=)[^>]*)>', {
            param($match)
            return '<TD' + ([regex]::Replace($match.Groups[1].Value, '\sclass="[^"]*\blesson-color-\d+\b[^"]*"', '', [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)) + '>'
        }, [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)
        $content = [regex]::Replace($content, '<TD([^>]*\bcolspan=\d+[^>]*\browspan=\d+[^>]*)>(\s*<TABLE>[\s\S]*?</TABLE>)</TD>', {
            param($match)
            $key = Get-LessonKey ($match.Groups[2].Value) $isProfessorPage
            if (-not $key) {
                return [regex]::Replace($match.Value, '\sclass="[^"]*\blesson-color-\d+\b[^"]*"', '', [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)
            }
            $colorClass = 'lesson-color-' + (Get-HashIndex $key)
            return '<TD' + (Add-LessonClass ($match.Groups[1].Value) $colorClass) + '>' + $match.Groups[2].Value + '</TD>'
        }, [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)
        if ($content -ne $original) {
            [System.IO.File]::WriteAllText($_.FullName, $content, $utf8NoBom)
            $changed++
        }
    }
}

Write-Host "Horarios coloreados: $changed"
