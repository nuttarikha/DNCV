Add-Type -AssemblyName System.IO.Compression.FileSystem
$docx = (Get-ChildItem -Path "C:\Users\User\OneDrive\Desktop" -Filter "*s6916011856072.docx")[0]
Write-Host "Found file: $($docx.FullName)"
$extractPath = 'C:\Users\User\OneDrive\Desktop\Project 01\assets\docx_media'
if (-not (Test-Path $extractPath)) { New-Item -ItemType Directory -Path $extractPath -Force }
$archive = [System.IO.Compression.ZipFile]::OpenRead($docx.FullName)
foreach ($entry in $archive.Entries) {
    if ($entry.FullName.StartsWith('word/media/')) {
        $filename = [System.IO.Path]::GetFileName($entry.FullName)
        if ($filename) {
            $dest = Join-Path $extractPath $filename
            [System.IO.Compression.ZipFileExtensions]::ExtractToFile($entry, $dest, $true)
            Write-Host "Extracted $filename"
        }
    }
}
$archive.Dispose()
