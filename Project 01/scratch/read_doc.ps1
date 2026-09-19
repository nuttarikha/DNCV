Add-Type -AssemblyName System.IO.Compression.FileSystem
$docFile = (Get-ChildItem "C:\Users\User\OneDrive\Desktop" -Filter "*s6916011856072*.docx")[0]
$zip = [System.IO.Compression.ZipFile]::OpenRead($docFile.FullName)
$entry = $zip.GetEntry('word/document.xml')
$stream = $entry.Open()
$reader = New-Object System.IO.StreamReader($stream)
$xml = $reader.ReadToEnd()
$stream.Close()
$zip.Dispose()

# Use regex to find all <w:t> tags
$matches = [regex]::Matches($xml, '<w:t[^>]*>(.*?)</w:t>')
$sb = New-Object System.Text.StringBuilder
foreach ($m in $matches) {
    [void]$sb.AppendLine($m.Groups[1].Value)
}
[System.IO.File]::WriteAllText("c:\Users\User\OneDrive\Desktop\Project 01\scratch\extracted_text.txt", $sb.ToString(), [System.Text.Encoding]::UTF8)
Write-Host "Extracted text count: $($matches.Count), text length: $($sb.Length)"
