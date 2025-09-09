@echo off
echo Uploading all files to GitHub...
git add .
git commit -m "Complete FinTwin platform upload with all files"
git push origin main --force
echo Upload complete!
pause
