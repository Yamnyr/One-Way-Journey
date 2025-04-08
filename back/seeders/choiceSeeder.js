const db = require('../models');

const choices = [
    {
        scenario_id: 1,  // Scenario 1 : Le début de l'aventure
        description: 'Partir à la chasse',
        required_stat: 'dexterity',
        required_value: 50,
        result: 'Tu attrapes un gros gibier et gagnes de la vie.',
        next_scenario_id: 2,
        effect_life: 20,
    },
    {
        scenario_id: 1,  // Scenario 1 : Le début de l'aventure
        description: 'Aller parler au vieux sage',
        required_stat: 'charisma',
        required_value: 60,
        result: 'Le sage t\'offre une potion de sagesse.',
        next_scenario_id: 2,
        effect_life: 0,
        effect_charisma: 10,
    },
];

const seedChoices = async () => {
    try {
        for (let choiceData of choices) {
            await db.Choice.create(choiceData);
        }
        console.log('✅ Choix insérés avec succès !');
    } catch (error) {
        console.error('❌ Erreur lors de l\'insertion des choix:', error);
    }
};

module.exports = seedChoices;
