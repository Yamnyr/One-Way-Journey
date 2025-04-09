const express = require('express');
const router = express.Router();
const scenarioController = require('../controllers/scenarioController');
const { verifyToken } = require('../middleware/authMiddleware');  // Middleware pour vérifier le token
const { verifyAdmin } = require('../middleware/authMiddleware');  // Middleware pour vérifier que l'utilisateur est admin

// 1️⃣ Route pour créer un scénario (seul un admin peut créer un scénario)
router.post('/create', verifyToken, verifyAdmin, scenarioController.createScenario);

// 2️⃣ Route pour récupérer un scénario avec tous ses choix
router.get('/:id', verifyToken, scenarioController.getScenarioWithChoices);

// 3️⃣ Route pour récupérer tous les scénarios (seul un admin peut récupérer tous les scénarios)
router.get('/', verifyToken, verifyAdmin, scenarioController.getAllScenarios);

// 4️⃣ Route pour supprimer un scénario (seul un admin peut supprimer un scénario)
router.delete('/:id', verifyToken, verifyAdmin, scenarioController.deleteScenario);

module.exports = router;
