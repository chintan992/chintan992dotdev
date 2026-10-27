<#
.SYNOPSIS
    Converts all videos in content/ to web-safe H.264 MP4 for instant loading,
    output into public/media/videos/ (the site's video media category).

.DESCRIPTION
    - Scans content/ recursively for any video file (mp4, mov, mkv, avi, ...).
    - Output name is the lowercased source basename with .mp4 extension
      (e.g. STREET1.mov -> street1.mp4, model-car.mp4 -> model-car.mp4).
    - Skips files whose output already exists and is valid, so it is safe to
      re-run whenever new footage is dropped into content/.
    - Encoding: H.264 (libx264), AAC stereo audio, yuv420p, capped at 1080p,
      moov atom moved to the front (+faststart) so playback starts instantly.

.USAGE
    powershell -ExecutionPolicy Bypass -File scripts\convert-videos.ps1
    Optional switches:
        -DryRun        show what would be converted, encode nothing
        -Force         re-encode even if the output already exists
        -Crf 23        quality (lower = better/larger, default 23)
        -Preset medium x264 speed/size tradeoff (default medium)
#>
param(
    [string]$SourceDir = "content",
    [string]$OutputDir = "public/media/videos",
    [switch]$DryRun,
    [switch]$Force,
    [int]$Crf = 23,
    [string]$Preset = "medium"
)

$ErrorActionPreference = "Stop"

$videoExtensions = @(".mp4", ".mov", ".mkv", ".avi", ".webm", ".m4v", ".mpg", ".mpeg", ".wmv", ".mts", ".m2ts", ".3gp")

foreach ($tool in @("ffmpeg", "ffprobe")) {
    if (-not (Get-Command $tool -ErrorAction SilentlyContinue)) {
        Write-Error "$tool not found on PATH. Install ffmpeg (e.g. winget install Gyan.FFmpeg) and re-run."
        exit 1
    }
}

if (-not (Test-Path -LiteralPath $SourceDir)) {
    Write-Error "Source directory '$SourceDir' does not exist."
    exit 1
}
if (-not $DryRun) {
    New-Item -ItemType Directory -Force -Path $OutputDir | Out-Null
}

# Scale down to at most 1920 wide, keep aspect ratio, force even dimensions.
$scaleFilter = "scale='min(1920,iw)':-2"

$sources = Get-ChildItem -LiteralPath $SourceDir -File -Recurse |
    Where-Object { $videoExtensions -contains $_.Extension.ToLower() } |
    Sort-Object Name

if ($sources.Count -eq 0) {
    Write-Host "No video files found in '$SourceDir'."
    exit 0
}

$converted = 0
$skipped   = 0
$failed    = 0
$stopwatch = [System.Diagnostics.Stopwatch]::StartNew()

foreach ($src in $sources) {
    # Normalize: lowercase, spaces -> dashes, .mp4 extension (the web-safe container).
    $outName = ($src.BaseName.ToLower() -replace "\s+", "-") + ".mp4"
    $outPath = Join-Path $OutputDir $outName

    # Skip what is already done: target exists, is non-empty, and passes a quick codec check.
    if (-not $Force -and (Test-Path -LiteralPath $outPath)) {
        $existing = Get-Item -LiteralPath $outPath
        if ($existing.Length -gt 0) {
            $codec = & ffprobe -v error -select_streams v:0 -show_entries stream=codec_name -of csv=p=0 -- $outPath 2>$null
            if ($codec -match "h264") {
                $skipped++
                Write-Host "[skip] $($src.Name) -> $outName (already converted)"
                continue
            }
        }
    }

    if ($DryRun) {
        $converted++
        Write-Host "[would convert] $($src.Name) -> $outPath ($([math]::Round($src.Length / 1MB)) MB)"
        continue
    }

    Write-Host "[convert] $($src.Name) ($([math]::Round($src.Length / 1MB)) MB) -> $outName ..."

    $fileStopwatch = [System.Diagnostics.Stopwatch]::StartNew()
    & ffmpeg -y -hide_banner -loglevel error -nostdin `
        -i $src.FullName `
        -map 0:v:0 -map 0:a? -sn -dn -map_metadata -1 `
        -c:v libx264 -preset $Preset -crf $Crf -pix_fmt yuv420p -vf $scaleFilter `
        -c:a aac -b:a 128k -ac 2 `
        -movflags +faststart `
        -f mp4 `
        -- $outPath 2>&1 | ForEach-Object { Write-Verbose $_ }
    $exitCode = $LASTEXITCODE
    $fileStopwatch.Stop()

    if ($exitCode -ne 0 -or -not (Test-Path -LiteralPath $outPath) -or (Get-Item -LiteralPath $outPath).Length -eq 0) {
        $failed++
        Write-Host "  [FAILED] ffmpeg exited with code $exitCode for $($src.Name)" -ForegroundColor Red
        # Remove partial output so the next run retries this file.
        if (Test-Path -LiteralPath $outPath) { Remove-Item -LiteralPath $outPath -Force }
        continue
    }

    # Verify the result is a playable web-safe file.
    $verify = & ffprobe -v error -select_streams v:0 -show_entries stream=codec_name -of csv=p=0 -- $outPath 2>$null
    if ($verify -notmatch "h264") {
        $failed++
        Write-Host "  [FAILED] output did not verify as H.264: $outName" -ForegroundColor Red
        continue
    }

    $converted++
    $outSize = [math]::Round((Get-Item -LiteralPath $outPath).Length / 1MB)
    $srcSize = [math]::Round($src.Length / 1MB)
    Write-Host ("  [done] {0} in {1:mm\:ss} ({2} MB -> {3} MB)" -f $outName, $fileStopwatch.Elapsed, $srcSize, $outSize)
}

$stopwatch.Stop()
Write-Host ""
Write-Host ("Summary: {0} converted, {1} skipped, {2} failed, {3} total (elapsed {4:mm\:ss})" -f `
    $converted, $skipped, $failed, $sources.Count, $stopwatch.Elapsed)

if ($DryRun) {
    Write-Host "Dry run only - nothing was encoded. Re-run without -DryRun to convert."
}

exit $(if ($failed -gt 0) { 1 } else { 0 })
