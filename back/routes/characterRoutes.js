const express = require('express');
const router = express.Router();
const characterController = require('../controllers/characterController');
const { verifyToken } = require('../middleware/authMiddleware');  // Middleware pour vérifier le token

// 1️⃣ Route pour créer un personnage
router.post('/create', verifyToken, characterController.createCharacter);

// 2️⃣ Route pour supprimer un personnage (seul le propriétaire ou l'admin peut supprimer)
router.delete('/:id', verifyToken, characterController.deleteCharacter);

// 3️⃣ Route pour récupérer les personnages de l'utilisateur connecté
router.get('/', verifyToken, characterController.getUserCharacters);

module.exports = router;
