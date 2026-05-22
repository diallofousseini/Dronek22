# PowerShell Wrapper for running Claude Code with OpenRouter API
# Usage: .\claude-or.ps1 [arguments]

$ConfigPath = "$PSScriptRoot\.env.claude.local"

if (!(Test-Path $ConfigPath)) {
    Write-Host "[Erreur] Le fichier de configuration $ConfigPath n'existe pas." -ForegroundColor Red
    Write-Host "Veuillez dupliquer le fichier template ou le recréer avec vos cles." -ForegroundColor Yellow
    Exit 1
}

Write-Host "[Configuration] Chargement de la configuration OpenRouter..." -ForegroundColor Green

# Parse local env config
Get-Content $ConfigPath | ForEach-Object {
    $line = $_.Trim()
    if ($line -and !$line.StartsWith("#") -and $line.Contains("=")) {
        $key, $value = $line.Split("=", 2)
        $key = $key.Trim()
        $value = $value.Trim()
        
        if ($key -eq "OPENROUTER_API_KEY") {
            $env:ANTHROPIC_AUTH_TOKEN = $value
        } elseif ($key -eq "ANTHROPIC_BASE_URL") {
            $env:ANTHROPIC_BASE_URL = $value
        } elseif ($key -eq "CLAUDE_CODE_DISABLE_EXPERIMENTAL_BETAS") {
            $env:CLAUDE_CODE_DISABLE_EXPERIMENTAL_BETAS = $value
        }
    }
}

# Configurer les variables critiques pour bypasser l'auth Anthropic native
$env:ANTHROPIC_API_KEY = ""

# Vérifier si la clé a bien été injectée
if ($env:ANTHROPIC_AUTH_TOKEN -eq "sk-or-v1-ENTREZ_VOTRE_CLE_ICI" -or !$env:ANTHROPIC_AUTH_TOKEN) {
    Write-Host "[Attention] Vous devez remplacer 'sk-or-v1-ENTREZ_VOTRE_CLE_ICI' par votre vraie cle OpenRouter dans .env.claude.local !" -ForegroundColor Red
    Exit 1
}

Write-Host "[Lancement] Lancement de Claude Code avec OpenRouter..." -ForegroundColor Cyan
Write-Host "API URL : $env:ANTHROPIC_BASE_URL" -ForegroundColor Gray

# Lancement de Claude Code avec les arguments passés au script wrapper
& npx @anthropic-ai/claude-code $args
