@echo off
setlocal enabledelayedexpansion

for %%f in (*.html) do (
    echo Processing %%f
    powershell -Command "(Get-Content '%%f') -replace '<link rel=\"stylesheet\" href=\"css/style.css\">', '<link rel=\"stylesheet\" href=\"css/style.css\">`n    <link rel=\"stylesheet\" href=\"css/responsive.css\">' | Set-Content '%%f'"
)

echo Done!
pause
