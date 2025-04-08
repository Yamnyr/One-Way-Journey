const db = require('../models');

// Création d'un choix pour un scénario
exports.createChoice = async (req, res) => {
    try {
        const { scenarioId, description, required_stat, required_value, result, nextScenarioId, effect_life, effect_charisma, effect_dexterity, effect_luck, is_game_over } = req.body;
        const choice = await db.Choice.create({ scenarioId, description, required_stat, required_value, result, nextScenarioId, effect_life, effect_charisma, effect_dexterity, effect_luck, is_game_over });
        res.status(201).json(choice);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Récupérer les choix d'un scénario
exports.getScenarioChoices = async (req, res) => {
    try {
        const { scenarioId } = req.params;
        const choices = await db.Choice.findAll({ where: { scenarioId } });
        res.json(choices);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
