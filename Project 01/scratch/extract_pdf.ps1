Add-Type -AssemblyName System.Runtime.WindowsRuntime
$asTaskGeneric = ([System.WindowsRuntimeSystemExtensions].GetMethods() | Where-Object { $_.Name -eq 'AsTask' -and $_.GetParameters().Count -eq 1 -and $_.IsGenericMethod })[0]

function Await($winRtOp, $resultType) {
    $method = $asTaskGeneric.MakeGenericMethod($resultType)
    $netTask = $method.Invoke($null, @($winRtOp))
    return $netTask.GetAwaiter().GetResult()
}

[Windows.Storage.StorageFile, Windows.Storage, ContentType=WindowsRuntime] | Out-Null
[Windows.Data.Pdf.PdfDocument, Windows.Data.Pdf, ContentType=WindowsRuntime] | Out-Null

$pdfFile = (Get-ChildItem -Path "C:\Users\User\Downloads" -Filter "*CV*.pdf")[0]
Write-Host "Loading: $($pdfFile.FullName)"

$fileOp = [Windows.Storage.StorageFile]::GetFileFromPathAsync($pdfFile.FullName)
$file = Await $fileOp ([Windows.Storage.StorageFile])
$docOp = [Windows.Data.Pdf.PdfDocument]::LoadFromFileAsync($file)
$doc = Await $docOp ([Windows.Data.Pdf.PdfDocument])

Write-Host "Page Count: $($doc.PageCount)"

$destDir = "C:\Users\User\OneDrive\Desktop\Project 01\assets\cv_pages"
if (-not (Test-Path $destDir)) { New-Item -ItemType Directory -Path $destDir -Force }

$asTaskNonGeneric = ([System.WindowsRuntimeSystemExtensions].GetMethods() | Where-Object { $_.Name -eq 'AsTask' -and $_.GetParameters().Count -eq 1 -and -not $_.IsGenericMethod })[0]
function AwaitAction($winRtOp) {
    $netTask = $asTaskNonGeneric.Invoke($null, @($winRtOp))
    $netTask.GetAwaiter().GetResult()
}

$createFolderOp = [Windows.Storage.StorageFolder]::GetFolderFromPathAsync($destDir)
$folder = Await $createFolderOp ([Windows.Storage.StorageFolder])

for ($i = 0; $i -lt $doc.PageCount; $i++) {
    $page = $doc.GetPage($i)
    $filename = "page_$($i+1).png"
    $fileCreateOp = $folder.CreateFileAsync($filename, [Windows.Storage.CreationCollisionOption]::ReplaceExisting)
    $outStorageFile = Await $fileCreateOp ([Windows.Storage.StorageFile])
    
    $openOp = $outStorageFile.OpenAsync([Windows.Storage.FileAccessMode]::ReadWrite)
    $stream = Await $openOp ([Windows.Storage.Streams.IRandomAccessStream])
    
    $renderOp = $page.RenderToStreamAsync($stream)
    AwaitAction $renderOp
    $flushOp = $stream.FlushAsync()
    $flushNetTask = $asTaskGeneric.MakeGenericMethod([bool]).Invoke($null, @($flushOp))
    $flushNetTask.GetAwaiter().GetResult() | Out-Null
    $stream.Dispose()
    Write-Host "Exported $filename"
}
