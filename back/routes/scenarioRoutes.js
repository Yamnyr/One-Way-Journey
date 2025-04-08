const express = require('express');
const router = express.Router();
const scenarioController = require('../controllers/scenarioController');
const {verifyToken, verifyRole} = require("../middleware/authMiddleware");

router.post('/', verifyToken, verifyRole(['admin']), scenarioController.createScenario);
router.get('/', verifyToken, scenarioController.getAllScenarios);

module.exports = router;
