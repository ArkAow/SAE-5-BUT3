# Base image nodejs 22.9
FROM node:22.9

# Installation de dépendances supplémentaires
RUN apt-get update && \
    apt-get install -y xvfb

WORKDIR /app

# Copie du code source et installation des dépendances
COPY ./../. /app
RUN npm install

RUN xhost local:root
