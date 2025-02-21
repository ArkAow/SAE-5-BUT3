# Guide d'installation et lancement du projet  
## Pré-requis :  
PHP 8.2  
Composer 2.6.6  
NodeJS 22.9.0  
Docker Desktop  
  
## Étape 1 : Clone du projet  
Cloner le projet  
Clonez le projet sur votre machine avec cette ligne de commande :  
```git clone https://github.com/ArkAow/SAE-5-BUT3.git```  
  
Ouvrir un terminal à la racine du projet  
Dans un terminal, placez-vous dans le répertoire du projet.  
  
## Étape 2 : Installation des dépendances  
### Installation dans le Frontend  
À la racine du projet, copiez-collez la commande suivante :  
```cd ./app | npm i```  
et patientez le temps de l'installation.  
  
### Installation dans le Backend  
À la racine du projet, copiez-collez la commande suivante :  
```cd ./backend | composer i```  
et patientez le temps de l'installation.  
  
### Installation de la base de données  
À la racine du projet, copiez-collez la commande suivante :  
```docker-compose up -d```  
et patientez le temps de l'installation.  
Assurez-vous que Docker Engine soit démarré.  

### Configuration du fichier `.env`

Pour faire fonctionner le projet correctement, vous devez créer un fichier `.env` dans le dossier `./backend`, depuis la racine du projet, avec les variables d'environnement nécessaires.  
Vous trouverez un fichier `.env` avec les variables d'environnement en décompressant le dossier `./config/config folders.zip`.  

## Étape 3 : Lancer les migrations
À la racine du projet, copiez-collez la commande suivante :  
```cd backend | ./run_command```

Un menu s'affiche et selectionnez l'option pour lancer tout les UPs (l'option numéro 1)  

## Étape 4 : Lancer le projet  
### Lancer le Frontend  
Dans un terminal, à la racine du projet, exécutez la commande suivante pour lancer le projet dans son navigateur:  
```cd ./app | npm start```  
Il est aussi possible de lancer le projet en application, dans un terminal, à la racine du projet, exécutez la commande suivante:  
```cd ./app | npm run electron-start```  

### Lancer le Backend  
Dans un terminal, à la racine du projet, exécutez la commande suivante :  
```cd ./backend/public | php -S localhost:8600```  
  
Assurez-vous que la stack Docker est lancée.  

---

# Utilisation et détails
## Frameworks majeurs  

- **Frontend**  
  - **ReactJS** : application web frontend en JavaScript  
  - **Electron** : transformation d'une application web en application de bureau  
  - **TailwindCSS** : mise en page et styles CSS  

- **Backend**  
  - **Symfony** : application backend en PHP  
  - **Doctrine** : ORM pour la gestion de la base de données  


## Connexion  
Pour se connecter à l'application, il faut tout d'abord utiliser les identifiants administrateur :  
- **Identifiant** : root  
- **Mot de passe** : admin  

Avant de vous connecter, attendez que le serveur ait récupéré les données (ouvrez la console avec **F12** et attendez le message *"Chargement des départements réussi"*).  

Si aucun département n'est encore enregistré, certaines pages risquent de ne pas fonctionner (ajout d'enseignant, ajout de groupes, etc.). Il faut donc en ajouter via la page dédiée (voir partie suivante), puis recharger la page pour récupérer le(s) département(s).  

Vous pouvez également vous connecter avec vos identifiants **Biome**, à condition que l'utilisateur ait pour email votre adresse universitaire. Cette fonctionnalité ne fonctionne que dans l'enceinte de l'IUT, sur le réseau **Eduroam**.  

## Navigation  
À votre arrivée sur l'application, après vous être connecté, vous trouverez sur la page du menu **trois boutons** :  
![Capture d'écran 2025-02-20 194825](https://github.com/user-attachments/assets/75143203-0bf4-4ab4-9e56-a532c0d5c69b)  
- **Le premier** permet de modifier le prévisionnel, accessible uniquement lorsqu'il y a suffisamment de données.  
- **Le deuxième** permet d'accéder au paramétrage de l'application et des données.  
- **Le troisième et dernier** permet de consulter le prévisionnel sans pouvoir le modifier.  

Dans la page des paramètres, vous trouverez **cinq boutons** :  
![Capture d'écran 2025-02-20 194909](https://github.com/user-attachments/assets/75396990-c41c-47e1-a1ea-2a94e635165f)  
Ils permettent, dans l'ordre:  
1. **D'insérer** un fichier **MCCC**  
2. **De gérer** les départements  
3. **De gérer** les utilisateurs  
4. **De gérer** les groupes d'étudiants  
5. **De gérer** les enseignants et leurs enseignements

## Fichiers  
Voici la structure des fichiers importants du projet :  

- `./app` contient le code du frontend.  
  - `./app/src` contient le code et les composants frontend.  
  - `./app/public` contient les images utilisées dans le frontend.  
  - `./app/electron` contient les fichiers de la version application de l'application web.  
- `./backend` contient le code du backend.  
  - `./backend/src/controller` contient les routes de l'API.  
  - `./backend/entity` contient les entités pour l'ORM.  
- `./res` contient les ressources utiles pour faire fonctionner le projet, notamment des fichiers tableurs MCCC préremplis.  
- `./backend/public/uploads` contient les fichiers tableurs MCCC envoyés.  

