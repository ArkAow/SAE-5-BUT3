@echo off
:menu
echo.
echo Menu :
echo 1. Lancer tous les UP
echo 2. UP seulement 708
echo 3. UP seulement 620
echo 4. Lancer tous les DOWN
echo 5. DOWN seulement 708
echo 6. DOWN seulement 620
echo 7. Tous DOWN puis tous UP
echo 8. Quitter
echo.
set /p choice="Votre choix : "

if "%choice%"=="1" goto all_up
if "%choice%"=="2" goto up_708
if "%choice%"=="3" goto up_620
if "%choice%"=="4" goto all_down
if "%choice%"=="5" goto down_708
if "%choice%"=="6" goto down_620
if "%choice%"=="7" goto down_then_up
if "%choice%"=="8" goto quit
echo Choix invalide. Veuillez réessayer.
goto menu

:all_up
echo Lancer tous les UP...
php bin/console doctrine:migrations:execute DoctrineMigrations\Version20241120093708 --up
php bin/console doctrine:migrations:execute DoctrineMigrations\Version20241126183620 --up
goto menu

:up_708
echo UP seulement 708...
php bin/console doctrine:migrations:execute DoctrineMigrations\Version20241120093708 --up
goto menu

:up_620
echo UP seulement 620...
php bin/console doctrine:migrations:execute DoctrineMigrations\Version20241126183620 --up
goto menu

:all_down
echo Lancer tous les DOWN...
php bin/console doctrine:migrations:execute DoctrineMigrations\Version20241120093708 --down
php bin/console doctrine:migrations:execute DoctrineMigrations\Version20241126183620 --down
goto menu

:down_708
echo DOWN seulement 708...
php bin/console doctrine:migrations:execute DoctrineMigrations\Version20241120093708 --down
goto menu

:down_620
echo DOWN seulement 620...
php bin/console doctrine:migrations:execute DoctrineMigrations\Version20241126183620 --down
goto menu

:down_then_up
echo Tous DOWN puis tous UP...
php bin/console doctrine:migrations:execute DoctrineMigrations\Version20241126183620 --down
php bin/console doctrine:migrations:execute DoctrineMigrations\Version20241120093708 --down
php bin/console doctrine:migrations:execute DoctrineMigrations\Version20241120093708 --up
php bin/console doctrine:migrations:execute DoctrineMigrations\Version20241126183620 --up
goto menu

:quit
echo Quitter le script.
exit