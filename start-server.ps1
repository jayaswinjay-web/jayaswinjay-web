$logFile = "D:\jay-vibez\server.log"
$processName = "node"
$args = "D:\jay-vibez\server\index.js"

$existing = Get-Process -Name $processName -ErrorAction SilentlyContinue | Where-Object { $_.CommandLine -match [regex]::Escape($args) }
if (-not $existing) {
  $psi = New-Object System.Diagnostics.ProcessStartInfo
  $psi.FileName = $processName
  $psi.Arguments = $args
  $psi.WorkingDirectory = "D:\jay-vibez\server"
  $psi.UseShellExecute = $false
  $psi.RedirectStandardOutput = $true
  $psi.RedirectStandardError = $true
  $psi.CreateNoWindow = $true
  $p = [System.Diagnostics.Process]::Start($psi)
  "$(Get-Date): JAY VIBEZ started (PID: $($p.Id))" | Out-File -FilePath $logFile -Append
} else {
  "$(Get-Date): JAY VIBEZ already running (PID: $($existing.Id))" | Out-File -FilePath $logFile -Append
}
