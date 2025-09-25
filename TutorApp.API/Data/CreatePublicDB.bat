@echo off
echo Creating public database with sample data...

cd /d "%~dp0"

sqlite3 tutorapp_public.db < CreatePublicDatabase.sql

echo Public database created: tutorapp_public.db
echo You can now share this file publicly!

pause
