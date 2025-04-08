const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('../models');

// Fonction pour générer un token JWT
const generateToken = (user) => {
    return jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        process.env.SECRET_KEY,  // Utiliser une clé secrète dans .env
        { expiresIn: '1h' }     // Expiration du token (1 heure par exemple)
    );
};

// Inscription d'un utilisateur
exports.createUser = async (req, res) => {
    try {
        const { username, password, email, role } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await db.User.create({ username, password: hashedPassword, email, role });

        // Générer un token pour l'utilisateur
        const token = generateToken(user);

        // Renvoi de la réponse avec le token
        res.status(201).json({ user, token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Connexion de l'utilisateur avec génération du token
exports.loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await db.User.findOne({ where: { username } });

        if (!user) {
            return res.status(404).json({ error: 'Utilisateur non trouvé' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ error: 'Mot de passe incorrect' });
        }

        // Générer un token pour l'utilisateur
        const token = generateToken(user);

        res.json({ message: 'Connexion réussie', user, token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Récupérer tous les utilisateurs
exports.getAllUsers = async (req, res) => {
    try {
        const users = await db.User.findAll();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};