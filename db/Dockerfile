# Utiliser l'image officielle MySQL de Docker Hub
FROM mysql:8.0


# Copier le script SQL dans le conteneur Docker
COPY ./init_db.sql /docker-entrypoint-initdb.d/

# Exposer le port MySQL
EXPOSE 3306

# Commande par défaut pour lancer MySQL
CMD ["mysqld"]