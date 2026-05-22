@echo off
SETLOCAL EnableDelayedExpansion

SET "ConfigPath=%~dp0.env.claude.local"

if not exist "%ConfigPath%" (
    echo ❌ Erreur : Le fichier de configuration .env.claude.local est introuvable.
    exit /b 1
)

echo ⚙️ Chargement de la configuration OpenRouter...

:: Lecture simplifiée du fichier de config
for /f "usebackq delims=" %%x in ("%ConfigPath%") do (
    set "line=%%x"
    :: Ignorer les commentaires et lignes vides
    if not "!line:~0,1!"=="#" (
        for /f "tokens=1,2 delims==" %%a in ("!line!") do (
            set "key=%%a"
            set "val=%%b"
            :: Nettoyage des espaces
            set "key=!key: =!"
            if "!key!"=="OPENROUTER_API_KEY" set "AUTH_TOKEN=!val!"
            if "!key!"=="ANTHROPIC_BASE_URL" set "BASE_URL=!val!"
            if "!key!"=="CLAUDE_CODE_DISABLE_EXPERIMENTAL_BETAS" set "DISABLE_BETAS=!val!"
        )
    )
)

:: Configuration des variables pour Claude Code
set "ANTHROPIC_AUTH_TOKEN=%AUTH_TOKEN%"
set "ANTHROPIC_BASE_URL=%BASE_URL%"
set "CLAUDE_CODE_DISABLE_EXPERIMENTAL_BETAS=%DISABLE_BETAS%"
set "ANTHROPIC_API_KEY="

if "%ANTHROPIC_AUTH_TOKEN%"=="sk-or-v1-ENTREZ_VOTRE_CLE_ICI" (
    echo ⚠️ Attention : Vous devez remplacer 'sk-or-v1-ENTREZ_VOTRE_CLE_ICI' par votre vraie cle OpenRouter dans .env.claude.local !
    exit /b 1
)

echo 🚀 Lancement de Claude Code avec OpenRouter...
echo 🔗 API URL : %ANTHROPIC_BASE_URL%

npx @anthropic-ai/claude-code %*
