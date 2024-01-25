# [Projet serveur en Node.js](https://80b6c2c7-3953-4b71-a814-379e94ef7e8a-00-3h8m6p2p24prd.kirk.replit.dev/)

## [Lien repl.it](https://replit.com/@WaaberiIbrahim/ClassroomCloneEJSAlpineExpress)

## Explication des dossiers

### Middleware

Ce dossier contient des fonctions qui sont éxécutés avant que les fonctions finales du serveur (pour répondre aux requètes web) soient executés. Cela aide beaucoup avec l'authentification.

### Models_sql

Ce dossier contient le code nécéssaire pour communiquer avec la base de donnée SQLite. Tout le SQL est généré dans ce fichier, les fonctions pour répondre aux requètes web n'écrivent pas leur propre SQL.

### public

Ce dossier contient les fichiers statiques (css, javascript, images)

### routes

Ce dossier contient les "routeurs" ou les fonctions qui répondent aux requètes sont définies

### views

Ce dossier contient les pages HTML. L'extension est .ejs mais cela n'est pas important.

## Fichier principal

### app.js

Ce fichier est le fichier principal du serveur. Il importe toutes les librairies nécéssaires pour le serveur Express et pour la base de données. Il crée une instance du serveur dans un port (probablement le port 3000).

