# One Way Journey

[//]: # (![One Way Journey Logo]&#40;./assets/logo.png&#41;)

## Description

One Way Journey est un jeu d'aventure à choix multiple en React Native où les joueurs créent des personnages et prennent des décisions qui influencent le déroulement de l'histoire. Dans un univers spatial futuriste, chaque choix peut avoir des conséquences sur les statistiques de votre personnage et déterminer son destin.

Le jeu propose une expérience immersive avec un système de statistiques (vie, charisme, dextérité, intelligence, chance), des scénarios variés et des fins multiples.

## Technologies utilisées

### Frontend
- **React Native** - Framework pour le développement d'applications mobiles
- **Expo** - Plateforme pour faciliter le développement React Native

### Backend
- **Express.js** - Framework Node.js pour l'API REST
- **Sequelize** - ORM pour interagir avec la base de données
- **MySQL** - Base de données relationnelle

## Fonctionnalités

- **Système d'authentification** - Inscription et connexion des utilisateurs
- **Création de personnages** - Créez des personnages avec différentes espèces
- **Système de scénarios** - Parcourez des histoires interactives
- **Système de choix** - Prenez des décisions qui influencent le déroulement de l'histoire
- **Statistiques de personnage** - Gérez les attributs de votre personnage
- **Interface d'administration** - Créez et gérez des scénarios (pour les administrateurs)
- **Animations spatiales** - Fond spatial animé avec étoiles filantes et nébuleuses accompagné d'une musique

## Installation


```bash
# Cloner le dépôt
git clone https://github.com/Yamnyr/One-Way-Journey.git
cd One-Way-Journey/back
```
### Installation du backend

```bash
cd back
# Installer les dépendances
npm install


# Créer un fichier .env à la racine du dossier /back avec les variables suivantes :
# .env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=one_way_journey
DB_PORT=3306
SECRET_KEY=pomme

# Lancer l'application
node index.js
```

### Installation du frontend
```bash
cd front
# Installer les dépendances
npm install


# Créer un fichier .env à la racine du dossier /back avec les variables suivantes :
# .env
EXPO_PUBLIC_API_URL=http://{VOTRE_IP_V4}:3333


# Lancer l'application
npx expo start
```

## Équipe de développement

Ce projet a été développé dans le cadre d'un projet à l'école IPSSI par :

- **Marine RAPIN**
- **Corentin BOUET**
- **Quentin WAROQUET**


## Liens

- [GitHub Repository](https://github.com/Yamnyr/One-Way-Journey.git)
- [Trello Board](https://trello.com/invite/b/67f6c1b54137337469a1da8e/ATTIe6f5629b52789465136ec01465b0debdE5CADE57/one-way-journey)
