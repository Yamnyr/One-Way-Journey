# API Routes Documentation

Ce document décrit toutes les routes disponibles dans l'API, ainsi que leur utilisation.

## Routes pour les Personnages (`/characters`)

### 1️⃣ Créer un personnage
- **Route** : `POST /characters/create`
- **Description** : Permet de créer un nouveau personnage.
- **Middleware** : `verifyToken` (vérification du token utilisateur)
- **Contrôleur** : `createCharacter`

### 2️⃣ Supprimer un personnage
- **Route** : `DELETE /characters/:id`
- **Description** : Permet de supprimer un personnage spécifique.
- **Middleware** : `verifyToken` (vérification du token utilisateur)
- **Contrôleur** : `deleteCharacter`

### 3️⃣ Lister les personnages de l'utilisateur
- **Route** : `GET /characters/`
- **Description** : Permet de voir la liste des personnages associés à l'utilisateur connecté.
- **Middleware** : `verifyToken` (vérification du token utilisateur)
- **Contrôleur** : `getUserCharacters`

### 4️⃣ Mettre à jour un personnage
- **Route** : `PUT /characters/:id`
- **Description** : Permet de mettre à jour un personnage spécifique.
- **Middleware** : `verifyToken` (vérification du token utilisateur)
- **Contrôleur** : `updateCharacter`

---

## Routes pour les Choix (`/choices`)

### 1️⃣ Créer un choix
- **Route** : `POST /choices/`
- **Description** : Permet de créer un choix pour un scénario.
- **Middleware** : `verifyToken` (vérification du token utilisateur), `verifyAdmin` (vérification que l'utilisateur est admin)
- **Contrôleur** : `createChoice`

### 2️⃣ Récupérer les choix pour un scénario
- **Route** : `GET /choices/:scenarioId`
- **Description** : Permet de récupérer la liste des choix disponibles pour un scénario spécifique.
- **Middleware** : `verifyToken` (vérification du token utilisateur)
- **Contrôleur** : `getScenarioChoices`

---

## Routes pour les Scénarios (`/scenarios`)

### 1️⃣ Créer un scénario
- **Route** : `POST /scenarios/create`
- **Description** : Permet de créer un scénario. Cette route est réservée aux administrateurs.
- **Middleware** : `verifyToken` (vérification du token utilisateur), `verifyAdmin` (vérification que l'utilisateur est admin)
- **Contrôleur** : `createScenario`

### 2️⃣ Récupérer un scénario avec ses choix
- **Route** : `GET /scenarios/:id`
- **Description** : Permet de récupérer un scénario spécifique avec tous ses choix associés.
- **Middleware** : `verifyToken` (vérification du token utilisateur)
- **Contrôleur** : `getScenarioWithChoices`

---

## Routes pour les Utilisateurs (`/users`)

### 1️⃣ Inscription d'un utilisateur
- **Route** : `POST /users/register`
- **Description** : Permet d'inscrire un nouvel utilisateur.
- **Contrôleur** : `createUser`

### 2️⃣ Connexion d'un utilisateur
- **Route** : `POST /users/login`
- **Description** : Permet de connecter un utilisateur existant.
- **Contrôleur** : `loginUser`

### 3️⃣ Lister tous les utilisateurs
- **Route** : `GET /users/`
- **Description** : Permet de récupérer la liste de tous les utilisateurs. Cette route est réservée aux administrateurs.
- **Middleware** : `verifyToken` (vérification du token utilisateur), `verifyAdmin` (vérification que l'utilisateur est admin)
- **Contrôleur** : `getAllUsers`

### 4️⃣ Supprimer un utilisateur
- **Route** : `DELETE /users/:id`
- **Description** : Permet de supprimer un utilisateur spécifique. Cette route est réservée aux administrateurs.
- **Middleware** : `verifyToken` (vérification du token utilisateur), `verifyAdmin` (vérification que l'utilisateur est admin)
- **Contrôleur** : `deleteUser`

---

## Middleware

### `verifyToken`
- Vérifie que le token d'authentification est valide pour sécuriser l'accès aux routes.

### `verifyAdmin`
- Vérifie que l'utilisateur est un administrateur avant d'exécuter certaines actions (comme créer ou supprimer des scénarios, ou lister/supprimer des utilisateurs).
---

## Conclusion

Cette API permet de gérer des personnages, des scénarios, des choix dans ces scénarios, et de gérer des utilisateurs avec des rôles administratifs.