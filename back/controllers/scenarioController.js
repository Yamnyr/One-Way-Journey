const db = require('../models');

// Création d'un scénario
exports.createScenario = async (req, res) => {
    try {
        const { title, description, type, is_final } = req.body;
        const scenario = await db.Scenario.create({ title, description, type, is_final });
        res.status(201).json(scenario);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Récupérer tous les scénarios
exports.getAllScenarios = async (req, res) => {
    try {
        const scenarios = await db.Scenario.findAll();
        res.json(scenarios);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
