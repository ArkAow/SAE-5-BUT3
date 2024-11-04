# Base image nodejs 22.9
FROM node:22.9

# Installation de dépendances supplémentaires
RUN apt-get update && \
    apt-get install -y xvfb  # Serveur X virtuel pour Electron

WORKDIR /app

# Copie du code source et installation des dépendances
COPY . /app
RUN npm install

# Commande de démarrage d'Electron avec un serveur X virtuel (Xvfb)
CMD ["xvfb-run", "--auto-servernum", "npm", "start"]
