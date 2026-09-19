Add-Type -AssemblyName System.IO.Compression.FileSystem

# Let's search inside text files or see if we can find text in fulltext
$files = Get-ChildItem -Path "C:\Users\User\Downloads", "C:\Users\User\OneDrive\Desktop" -Filter "*ณัฐริกา*" -Recurse -ErrorAction SilentlyContinue
foreach ($f in $files) {
    Write-Host $f.FullName
}
