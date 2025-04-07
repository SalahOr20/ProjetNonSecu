Sportify – Lancement avec Docker Compose
Ce projet utilise Docker Compose pour lancer automatiquement :

Une base de données MySQL

Un backend Django

Un frontend React

PhpMyAdmin pour l’administration de la base de données

Lancement rapide
bash
Copier
Modifier
docker-compose up --build
Le backend est configuré pour démarrer après 50 secondes, le temps de laisser la base de données s’initialiser. Il applique ensuite les migrations et charge un dump de données (init_data.json) automatiquement.

 -> Accès aux services
Frontend : http://localhost:3000

Backend : http://localhost:8000

PhpMyAdmin : http://localhost:8080

Utilisateur : root

Mot de passe : (vide)

Serveur : db