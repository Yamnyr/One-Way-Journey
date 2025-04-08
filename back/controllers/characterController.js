const db = require('../models');

// Création d'un personnage
exports.createCharacter = async (req, res) => {
    try {
        const { userId, name, species } = req.body;
        const character = await db.Character.create({ userId, name, species });
        res.status(201).json(character);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Récupérer tous les personnages d'un utilisateur
exports.getUserCharacters = async (req, res) => {
    try {
        const { userId } = req.params;
        const characters = await db.Character.findAll({ where: { userId } });
        res.json(characters);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
