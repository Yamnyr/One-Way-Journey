const db = require('../models');
const { Scenario, Choice } = db;  // Import des modèles Scenario et Choice

// 1️⃣ Créer un scénario avec des choix
exports.createScenario = async (req, res) => {
    try {
        // Vérification que l'utilisateur est administrateur via le middleware
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Accès interdit. Seul un administrateur peut créer un scénario.' });
        }

        const { title, description, type, choices } = req.body;

        // Créer le scénario
        const scenario = await Scenario.create({
            title,
            description,
            type,
            is_final: false,  // Le scénario peut être marqué comme final selon le besoin
        });

        // Créer les choix associés au scénario
        if (choices && choices.length > 0) {
            const choicePromises = choices.map(async (choice) => {
                const { description, required_stat, required_value, result, nextScenarioId, effect_life, effect_charisma, effect_dexterity, effect_luck, is_game_over } = choice;

                await Choice.create({
                    scenarioId: scenario.id,
                    description,
                    required_stat,
                    required_value,
                    result,
                    nextScenarioId,
                    effect_life,
                    effect_charisma,
                    effect_dexterity,
                    effect_luck,
                    is_game_over,
                });
            });

            // Attendre que tous les choix soient créés
            await Promise.all(choicePromises);
        }

        res.status(201).json({
            message: 'Scénario créé avec succès !',
            scenario,
        });
    } catch (error) {
        console.error('❌ Erreur lors de la création du scénario:', error);
        res.status(500).json({ message: 'Erreur serveur lors de la création du scénario.' });
    }
};

// In scenarioController.js - getScenarioWithChoices method
exports.getScenarioWithChoices = async (req, res) => {
    try {
        const scenarioId = req.params.id;

        // Now explicitly using the 'choices' alias
        const scenario = await Scenario.findOne({
            where: { id: scenarioId },
            include: [{
                model: Choice,
                as: 'choices', // Now this matches the alias in the model
                required: false
            }]
        });

        if (!scenario) {
            return res.status(404).json({ message: 'Scénario non trouvé.' });
        }

        res.status(200).json({ scenario });
    } catch (error) {
        console.error('❌ Erreur lors de la récupération du scénario:', error);
        res.status(500).json({ message: 'Erreur serveur lors de la récupération du scénario.' });
    }
};

// 2️⃣ Récupérer tous les scénarios avec leurs choix associés
exports.getAllScenarios = async (req, res) => {
    try {
        // Récupère tous les scénarios avec leurs choix
        const scenarios = await Scenario.findAll({
            include: [{
                model: Choice,
                as: 'choices', // Correspond à l'alias défini dans les associations Sequelize
                required: false
            }]
        });

        res.status(200).json({ scenarios });
    } catch (error) {
        console.error('❌ Erreur lors de la récupération des scénarios :', error);
        res.status(500).json({ message: 'Erreur serveur lors de la récupération des scénarios.' });
    }
};
