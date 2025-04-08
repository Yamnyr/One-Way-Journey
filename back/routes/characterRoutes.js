const express = require('express');
const router = express.Router();
const characterController = require('../controllers/characterController');

router.post('/', characterController.createCharacter);
router.get('/:userId', characterController.getUserCharacters);

module.exports = router;
