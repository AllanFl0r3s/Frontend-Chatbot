<# Ejecuta migraciones con sqlcmd y autenticación de Windows.
   Ejemplo desde la raíz del repo: .\database\Invoke-Migrations.ps1
   No pide ni guarda contraseñas. Cada SQL verifica también el destino en el servidor.
#>
[CmdletBinding()]
param(
    [ValidatePattern('^(localhost|127\.0\.0\.1)(\\SQLEXPRESS|,[0-9]{1,5})$')]
    [string]$Server = '127.0.0.1,14330',

    [ValidatePattern('^(DW_ISTMA|CHATBOT_MIGRATION_TEST_[A-Za-z0-9_]+)$')]
    [string]$Database = 'DW_ISTMA'
)

$ErrorActionPreference = 'Stop'
$migrationFiles = @(Get-ChildItem -LiteralPath (Join-Path $PSScriptRoot 'migrations') -Filter '*.sql' -File | Sort-Object Name)
if ($migrationFiles.Count -eq 0) { throw 'No se encontraron migraciones.' }

$sqlcmdCommand = Get-Command sqlcmd.exe -ErrorAction SilentlyContinue
$sqlcmdPath = if ($sqlcmdCommand) { $sqlcmdCommand.Source } else { $null }
if (-not $sqlcmdPath) {
    # SSMS/SQL Server pueden instalar sqlcmd sin agregarlo a PATH.
    foreach ($clientVersion in @('170', '130')) {
        $candidate = Join-Path $env:ProgramFiles "Microsoft SQL Server\Client SDK\ODBC\$clientVersion\Tools\Binn\SQLCMD.EXE"
        if (Test-Path -LiteralPath $candidate) { $sqlcmdPath = $candidate; break }
    }
}
if (-not $sqlcmdPath) { throw 'No se encontró sqlcmd. Instala sus herramientas o ejecuta los SQL desde SSMS según database/README.md.' }

foreach ($migrationFile in $migrationFiles) {
    Write-Host "Ejecutando $($migrationFile.Name) en $Server / $Database"
    # -b devuelve un error al fallar el SQL; el bucle no continúa con la siguiente versión.
    # -f 65001 lee los archivos UTF-8 y conserva acentos en comentarios/mensajes.
    & $sqlcmdPath -S $Server -d $Database -E -b -r 1 -l 10 -t 60 -f 65001 -i $migrationFile.FullName
    if ($LASTEXITCODE -ne 0) {
        throw "Falló $($migrationFile.Name). No se ejecutaron las versiones siguientes. Revisa el mensaje de SQL Server."
    }
}
Write-Host 'Migraciones terminadas. Los datos semilla se ejecutan por separado.'
