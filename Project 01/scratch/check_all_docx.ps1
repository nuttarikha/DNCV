Add-Type -AssemblyName System.IO.Compression.FileSystem

function Extract-TextFromDocx($filePath) {
    $zip = [System.IO.Compression.ZipFile]::OpenRead($filePath)
    $entry = $zip.GetEntry('word/document.xml')
    $stream = $entry.Open()
    $reader = New-Object System.IO.StreamReader($stream)
    $xml = $reader.ReadToEnd()
    $stream.Close()
    $zip.Dispose()
    $matches = [regex]::Matches($xml, '<w:t[^>]*>(.*?)</w:t>')
    $sb = New-Object System.Text.StringBuilder
    foreach ($m in $matches) {
        [void]$sb.Append($m.Groups[1].Value)
    }
    return $sb.ToString()
}

$files = Get-ChildItem "C:\Users\User\OneDrive\Desktop" -Recurse -Filter "*.docx"
foreach ($f in $files) {
    Write-Host "File: $($f.FullName)"
    try {
        $txt = Extract-TextFromDocx $f.FullName
        Write-Host "Length: $($txt.Length)"
        Write-Host "Snippet: $($txt.Substring(0, [Math]::Min(300, $txt.Length)))"
        Write-Host "----------------------------------------"
    } catch {
        Write-Host "Error: $_"
    }
}
