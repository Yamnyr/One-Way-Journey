const express = require('express');
const router = express.Router();
const scenarioController = require('../controllers/scenarioController');
const { verifyToken } = require('../middleware/authMiddleware');  // Middleware pour vérifier le token
const { verifyAdmin } = require('../middleware/authMiddleware');  // Middleware pour vérifier que l'utilisateur est admin

// 1️⃣ Route pour créer un scénario (seul un admin peut créer un scénario)
router.post('/create', verifyToken, verifyAdmin, scenarioController.createScenario);

// 2️⃣ Route pour récupérer un scénario avec tous ses choix
router.get('/:id', verifyToken, scenarioController.getScenarioWithChoices);

module.exports = router;
