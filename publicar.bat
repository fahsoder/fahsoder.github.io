@echo off
REM Publica o site no GitHub (fahsoder/omurloc). Rode com dois cliques.
cd /d "%~dp0"
REM remove arquivos de identidade antiga
del /q assets\murloc.webp assets\favicon.svg 2>nul
if exist _workflow\update.yml (
  if not exist .github\workflows mkdir .github\workflows
  move /y _workflow\update.yml .github\workflows\update.yml >nul
  rmdir _workflow
)
if not exist .git (
  git init -b main
  git remote add origin https://github.com/fahsoder/omurloc.git
)
git add -A
git commit -m "Site do canal O Murloc"
git fetch origin
git pull --rebase -X theirs origin main 2>nul
git push -u origin main
echo.
echo Pronto. Agora: Settings ^> Pages ^> Source = GitHub Actions, e Actions ^> Run workflow.
pause
