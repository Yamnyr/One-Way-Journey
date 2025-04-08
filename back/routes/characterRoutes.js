const express = require('express');
const router = express.Router();
const characterController = require('../controllers/characterController');
const { verifyToken } = require('../middleware/authMiddleware');  // Middleware pour vérifier le token
const { verifyAdmin } = require('../middleware/authMiddleware');  // Middleware pour vérifier que l'utilisateur est admin

// 1️⃣ Route pour créer un personnage
router.post('/create', verifyToken, characterController.createCharacter);

// 2️⃣ Route pour supprimer un personnage
router.delete('/:id', verifyToken, characterController.deleteCharacter);

// 3️⃣ Route pour voir la liste des personnages de l'utilisateur connecté
router.get('/', verifyToken, characterController.getUserCharacters);

// 4️⃣ Route pour mettre à jour un personnage
router.put('/:id', verifyToken, characterController.updateCharacter);  // Ajout de la route pour mettre à jour un personnage

module.exports = router;
