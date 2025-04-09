const db = require('../models');
const { User, Character } = db;  // Import des modèles User et Character

// Définition des stats par race
const raceStats = {
    humain: { life: 100, charisma: 70, dexterity: 80, intelligence: 90, luck: 60 },
    vulcain: { life: 110, charisma: 50, dexterity: 85, intelligence: 120, luck: 40 },
    cyborg: { life: 150, charisma: 30, dexterity: 100, intelligence: 130, luck: 20 },
    mutant: { life: 130, charisma: 40, dexterity: 90, intelligence: 70, luck: 80 },
    alien: { life: 120, charisma: 60, dexterity: 95, intelligence: 110, luck: 50 },
    batman: { life: 100, charisma: 85, dexterity: 110, intelligence: 140, luck: 70 }
};

exports.createCharacter = async (req, res) => {
    try {
        const userId = req.user.id;
        const { name, species } = req.body;

        // Vérifier si la race est valide
        if (!raceStats[species]) {
            return res.status(400).json({ message: "Race invalide. Choisissez parmi: humain, vulcain, cyborg, mutant, alien, batman." });
        }

        // Appliquer les stats en fonction de la race
        const { life, charisma, dexterity, intelligence, luck } = raceStats[species];

        // Créer le personnage
        const character = await Character.create({
            userId,
            name,
            species,
            life,
            charisma,
            dexterity,
            intelligence,
            luck
        });

        // Recharger avec le scénario associé
        const characterWithScenario = await Character.findByPk(character.id, {
            include: {
                model: Scenario,
                attributes: ['id', 'title']
            }
        });

        res.status(201).json({
            message: '✅ Personnage créé avec succès !',
            character: characterWithScenario
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

const Scenario = require('../models/Scenario');

exports.getUserCharacters = async (req, res) => {
    try {
        const userId = req.user.id;

        // Chercher tous les personnages de l'utilisateur avec leur scénario actuel
        const characters = await Character.findAll({
            where: { userId: userId },
            include: {
                model: Scenario,
                as: 'Scenario', // Peut être nécessaire si l'alias est défini
                attributes: ['id', 'title'], // Récupère uniquement l'id et le titre
            },
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

// 4️⃣ Mettre à jour un personnage
exports.updateCharacter = async (req, res) => {
    try {
        const characterId = req.params.id;
        const userId = req.user.id;
        const { name, species, life, charisma, dexterity, intelligence, luck, currentScenarioId } = req.body;

        // Chercher le personnage dans la base de données
        const character = await Character.findOne({ where: { id: characterId } });

        // Vérifier si le personnage existe
        if (!character) {
            return res.status(404).json({ message: 'Personnage non trouvé.' });
        }

        // Vérifier que l'utilisateur connecté est soit le propriétaire, soit un administrateur
        if (character.userId !== userId && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Vous n\'avez pas la permission de modifier ce personnage.' });
        }

        // Mettre à jour les informations du personnage
        character.name = name ?? character.name;
        character.species = species ?? character.species;
        character.life = life ?? character.life;
        character.charisma = charisma ?? character.charisma;
        character.dexterity = dexterity ?? character.dexterity;
        character.intelligence = intelligence ?? character.intelligence;
        character.luck = luck ?? character.luck;
        character.currentScenarioId = currentScenarioId ?? character.currentScenarioId;

        // Vérifier si la vie est à 0 ou moins, et mettre à jour is_alive
        if (life !== undefined && life <= 0) {
            character.is_alive = false;
        }

        await character.save();

        res.status(200).json({
            message: 'Personnage mis à jour avec succès !',
            character,
        });
    } catch (error) {
        console.error('❌ Erreur lors de la mise à jour du personnage:', error);
        res.status(500).json({ message: 'Erreur serveur lors de la mise à jour du personnage.' });
    }
};



// 🔍 Récupérer un personnage spécifique
exports.getCharacter = async (req, res) => {
    try {
        const characterId = req.params.id;
        const userId = req.user.id;

        // Chercher le personnage
        const character = await Character.findOne({ where: { id: characterId } });

        if (!character) {
            return res.status(404).json({ message: 'Personnage non trouvé.' });
        }

        // Vérifier que l'utilisateur connecté est soit le propriétaire, soit un administrateur
        if (character.userId !== userId && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Vous n\'avez pas la permission de consulter ce personnage.' });
        }

        res.status(200).json({ character });

    } catch (error) {
        console.error('❌ Erreur lors de la récupération du personnage:', error);
        res.status(500).json({ message: 'Erreur serveur lors de la récupération du personnage.' });
    }
};

