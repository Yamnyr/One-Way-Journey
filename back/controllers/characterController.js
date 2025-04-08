const db = require('../models');
const { User, Character } = db;  // Import des modèles User et Character

// 1️⃣ Créer un personnage
exports.createCharacter = async (req, res) => {
    try {
        // Récupérer l'ID de l'utilisateur connecté (via le middleware)
        const userId = req.user.id;
        const { name, species, life, charisma, dexterity, intelligence, luck } = req.body;

        // Créer un personnage lié à l'utilisateur
        const character = await Character.create({
            userId: userId,
            name,
            species,
            life,
            charisma,
            dexterity,
            intelligence,
            luck,
        });

        res.status(201).json({
            message: 'Personnage créé avec succès !',
            character,
        });
    } catch (error) {
        console.error('❌ Erreur lors de la création du personnage:', error);
        res.status(500).json({ message: 'Erreur serveur lors de la création du personnage.' });
    }
};

// 2️⃣ Supprimer un personnage
exports.deleteCharacter = async (req, res) => {
    try {
        const characterId = req.params.id;
        const userId = req.user.id;

        // Chercher le personnage dans la base de données
        const character = await Character.findOne({ where: { id: characterId } });

        // Vérifier si le personnage existe
        if (!character) {
            return res.status(404).json({ message: 'Personnage non trouvé.' });
        }

        // Vérifier que l'utilisateur connecté est soit le propriétaire, soit un administrateur
        if (character.userId !== userId && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Vous n\'avez pas la permission de supprimer ce personnage.' });
        }

        // Supprimer le personnage
        await character.destroy();

        res.status(200).json({
            message: 'Personnage supprimé avec succès !',
        });
    } catch (error) {
        console.error('❌ Erreur lors de la suppression du personnage:', error);
        res.status(500).json({ message: 'Erreur serveur lors de la suppression du personnage.' });
    }
};

// 3️⃣ Voir la liste des personnages de l'utilisateur connecté
exports.getUserCharacters = async (req, res) => {
    try {
        const userId = req.user.id;

        // Chercher tous les personnages de l'utilisateur connecté
        const characters = await Character.findAll({
            where: { userId: userId },
        });

        if (characters.length === 0) {
            return res.status(404).json({ message: 'Aucun personnage trouvé.' });
        }

        res.status(200).json({ characters });
    } catch (error) {
        console.error('❌ Erreur lors de la récupération des personnages:', error);
        res.status(500).json({ message: 'Erreur serveur lors de la récupération des personnages.' });
    }
};
