// choiceSeeder.js - version optimisée
const db = require('../models');

const choices = [
    // SCÉNARIO 1
    {
        scenarioId: 1,
        description: 'Examiner les systèmes de la station',
        required_stat: 'intelligence',
        required_value: 50,
        result: 'Tu découvres que la station est instable. Il faut agir vite.',
        effect_intelligence: 10,
        effect_life: -5,
        nextScenarioId: 2,
    },
    {
        scenarioId: 1,
        description: 'Chercher un moyen de sortir',
        required_stat: 'dexterity',
        required_value: 40,
        result: 'Tu trouves une capsule prête à décoller.',
        effect_dexterity: 5,
        effect_luck: 15,
        nextScenarioId: 9,
    },
    {
        scenarioId: 1,
        description: 'Tenter de réparer la station',
        required_stat: 'intelligence',
        required_value: 60,
        result: 'Tu gagnes du temps, mais le danger augmente.',
        effect_intelligence: 15,
        effect_life: -10,
        nextScenarioId: 3,
    },

    // SCÉNARIO 2
    {
        scenarioId: 2,
        description: 'Suivre les instructions du message',
        required_stat: 'charisma',
        required_value: 50,
        result: 'Tu es guidé vers un refuge caché.',
        effect_charisma: 5,
        effect_life: 15,
        nextScenarioId: 14,
    },
    {
        scenarioId: 2,
        description: 'Explorer sans répondre',
        required_stat: 'dexterity',
        required_value: 60,
        result: 'Tu t\'éloignes des signaux et découvres un portail.',
        effect_dexterity: 10,
        effect_luck: -5,
        nextScenarioId: 15,
    },
    {
        scenarioId: 2,
        description: 'Tenter de répondre au message',
        required_stat: 'intelligence',
        required_value: 70,
        result: 'Tu ouvres une connexion avec une IA ancienne.',
        effect_intelligence: 15,
        effect_life: -5,
        nextScenarioId: 14,
    },

    // SCÉNARIO 3
    {
        scenarioId: 3,
        description: 'Utiliser des armes énergétiques',
        required_stat: 'dexterity',
        required_value: 50,
        result: 'Les créatures fuient temporairement.',
        effect_dexterity: 10,
        effect_life: -25,
        nextScenarioId: 6,
    },
    {
        scenarioId: 3,
        description: 'Fuir dans les conduits',
        required_stat: 'dexterity',
        required_value: 70,
        result: 'Tu échappes de justesse et trouves un portail instable.',
        effect_dexterity: 15,
        effect_life: -10,
        effect_luck: 10,
        nextScenarioId: 7,
    },
    {
        scenarioId: 3,
        description: 'Chercher un abri',
        required_stat: 'dexterity',
        required_value: 50,
        result: 'Tu te caches dans une salle scellée.',
        effect_dexterity: 10,
        effect_life: -15,
        effect_luck: -10,
        nextScenarioId: 20,
    },

    // SCÉNARIO 4
    {
        scenarioId: 4,
        description: 'Monter à bord',
        required_stat: 'luck',
        required_value: 60,
        result: 'Tu trouves une salle de pilotage active.',
        effect_luck: 15,
        effect_intelligence: 20,
        nextScenarioId: 10,
    },
    {
        scenarioId: 4,
        description: 'Analyser de l\'extérieur',
        required_stat: 'intelligence',
        required_value: 50,
        result: 'Le vaisseau est un piège abandonné.',
        effect_intelligence: 10,
        effect_life: -5,
        nextScenarioId: 19,
    },
    {
        scenarioId: 4,
        description: 'Ignorer et continuer',
        required_stat: 'luck',
        required_value: 40,
        result: 'Tu te diriges vers une planète inexplorée.',
        effect_luck: 15,
        effect_dexterity: -5,
        nextScenarioId: 6,
    },

    // Ajouts SCÉNARIOS non atteints précédemment
    {
        scenarioId: 6,
        description: 'Explorer la planète',
        required_stat: 'dexterity',
        required_value: 55,
        result: 'Tu rencontres une entité étrange.',
        effect_dexterity: 10,
        nextScenarioId: 18,
    },
    {
        scenarioId: 8,
        description: 'Tenter d\'atterrir sur Terre',
        required_stat: 'luck',
        required_value: 60,
        result: 'La Terre est ravagée. Tu dois survivre.',
        effect_luck: 10,
        nextScenarioId: 11,
    },
    {
        scenarioId: 10,
        description: 'Chercher un remède',
        required_stat: 'intelligence',
        required_value: 65,
        result: 'Tu analyses le virus.',
        effect_intelligence: 15,
        nextScenarioId: 17,
    },
    {
        scenarioId: 11,
        description: 'Contacter la flotte alliée',
        required_stat: 'charisma',
        required_value: 60,
        result: 'Une bataille s\'engage dans l\'espace.',
        effect_charisma: 10,
        nextScenarioId: 13,
    },
    {
        scenarioId: 12,
        description: 'Explorer les ruines silencieuses',
        required_stat: 'luck',
        required_value: 50,
        result: 'Une énergie inconnue t\'attire.',
        effect_luck: 10,
        nextScenarioId: 17,
    },
    {
        scenarioId: 13,
        description: 'Naviguer dans la vague',
        required_stat: 'dexterity',
        required_value: 90,
        result: 'Tu en réchappes de peu.',
        effect_life: -40,
        nextScenarioId: 5,
        is_game_over: true
    },
    {
        scenarioId: 15,
        description: 'Contourner le portail',
        required_stat: 'intelligence',
        required_value: 60,
        result: 'Tu évites un piège temporel.',
        effect_intelligence: 10,
        nextScenarioId: 16,
    },
    {
        scenarioId: 17,
        description: 'Naviguer la tempête',
        required_stat: 'dexterity',
        required_value: 70,
        result: 'Tu traverses mais ton vaisseau est endommagé.',
        effect_life: -20,
        nextScenarioId: 20,
    },
    {
        scenarioId: 18,
        description: 'Approcher le cristal',
        required_stat: 'charisma',
        required_value: 75,
        result: 'Il te transmet une vision.',
        effect_charisma: 20,
        nextScenarioId: 19,
    },
    {
        scenarioId: 19,
        description: 'Analyser les données holographiques',
        required_stat: 'intelligence',
        required_value: 60,
        result: 'Tu accèdes à une mémoire ancienne.',
        effect_intelligence: 15,
        nextScenarioId: 5,
    },
    {
        scenarioId: 20,
        description: 'Revenir à la station',
        required_stat: 'luck',
        required_value: 85,
        result: 'Une boucle temporelle s\'active.',
        effect_luck: 20,
        nextScenarioId: 1,
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
