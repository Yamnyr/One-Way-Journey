const express = require('express');
const router = express.Router();
const choiceController = require('../controllers/choiceController');

router.post('/', choiceController.createChoice);
router.get('/:scenarioId', choiceController.getScenarioChoices);

module.exports = router;
