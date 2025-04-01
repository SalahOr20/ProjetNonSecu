# Utiliser la dernière version LTS de Node.js
FROM node:18-alpine

# Définir le répertoire de travail à /app
WORKDIR /app

# Copier package.json et package-lock.json dans le conteneur
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Installer axios
RUN npm install axios react-router-dom

# Copier le reste des fichiers de ton projet dans le conteneur
COPY . .

# Exposer le port que ton application utilise
EXPOSE 3000

# Définir la commande pour démarrer ton application
CMD ["npm", "start"]
