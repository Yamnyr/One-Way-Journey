const express = require('express');
const router = express.Router();
const choiceController = require('../controllers/choiceController');
const {verifyToken, verifyRole} = require("../middleware/authMiddleware");

router.post('/',verifyToken, verifyRole(['admin']), choiceController.createChoice);
router.get('/:scenarioId',verifyToken, choiceController.getScenarioChoices);

module.exports = router;
