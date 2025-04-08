const db = require('../models');

const scenarios = [
    {
        title: 'Le début de l\'aventure',
        description: 'Tu te réveilles dans un village tranquille. Que veux-tu faire ?',
        type: 'choice',
        is_final: false,
    },
    {
        title: 'La forêt maudite',
        description: 'Tu es perdu dans la forêt. Un arbre géant te bloque le chemin.',
        type: 'destiny',
        is_final: false,
    },
    {
        title: 'Le dragon',
        description: 'Un dragon gigantesque apparaît devant toi !',
        type: 'destiny',
        is_final: true,
    },
];

const seedScenarios = async () => {
    try {
        for (let scenarioData of scenarios) {
            await db.Scenario.create(scenarioData);
        }
        console.log('✅ Scénarios insérés avec succès !');
    } catch (error) {
        console.error('❌ Erreur lors de l\'insertion des scénarios:', error);
    }
};

module.exports = seedScenarios;
