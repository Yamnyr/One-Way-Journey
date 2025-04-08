const express = require('express');
const router = express.Router();
const choiceController = require('../controllers/choiceController');
const {verifyToken, verifyAdmin} = require("../middleware/authMiddleware");

router.post('/',verifyToken, verifyAdmin, choiceController.createChoice);
router.get('/:scenarioId',verifyToken, choiceController.getScenarioChoices);

module.exports = router;
