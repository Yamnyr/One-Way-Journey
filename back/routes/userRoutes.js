const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');  // Import des middlewares

// Route pour inscrire un utilisateur
router.post('/register', userController.createUser);

// Route pour connecter un utilisateur
router.post('/login', userController.loginUser);

// Route pour récupérer tous les utilisateurs (accessible uniquement par un admin)
router.get('/', verifyToken, verifyAdmin, userController.getAllUsers);

// Route pour supprimer un utilisateur (accessible uniquement par un admin)
router.delete('/:id', verifyToken, verifyAdmin, userController.deleteUser);

module.exports = router;
