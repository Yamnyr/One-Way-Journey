const db = require('../models');

const scenarios = [
    {
        title: 'Le réveil dans la station spatiale',
        description: 'Tu te réveilles dans une station spatiale abandonnée. Une alarme retentit. Que veux-tu faire ?',
        type: 'choice',
        is_final: false,
    },
    {
        title: 'Le message crypté',
        description: 'Un signal étrange provenant de l\'intérieur du vaisseau te parvient. Tu décodes un message crypté. Que fais-tu ?',
        type: 'choice',
        is_final: false,
    },
    {
        title: 'L\'attaque des créatures de l\'ombre',
        description: 'Des créatures sombres et insidieuses attaquent la station. Que veux-tu faire pour te défendre ?',
        type: 'choice',
        is_final: false,
    },
    {
        title: 'Le vaisseau fantôme',
        description: 'En explorant, tu tombes sur un vaisseau fantôme flottant dans le vide sidéral.',
        type: 'destiny',
        is_final: false,
    },
    {
        title: 'Le trou noir',
        description: 'Un trou noir massif apparaît devant toi, attirant tout sur son passage.',
        type: 'destiny',
        is_final: true,
    },
    {
        title: 'La planète inconnue',
        description: 'Tu atterris sur une planète étrange et te retrouves face à une créature extraterrestre.',
        type: 'choice',
        is_final: false,
    },
    {
        title: 'Les trous de ver instables',
        description: 'Les trous de ver sont instables et tu te retrouves projeté dans un autre coin de la galaxie.',
        type: 'destiny',
        is_final: false,
    },
    {
        title: 'Le retour sur Terre',
        description: 'Après des années dans l\'espace, tu vois enfin la Terre apparaître au loin. Mais elle semble différente.',
        type: 'choice',
        is_final: false,
    },
    {
        title: 'La rencontre avec des clones',
        description: 'Tu fais la rencontre d\'un groupe de clones qui te ressemblent exactement. Quelle est leur intention ?',
        type: 'choice',
        is_final: false,
    },
    {
        title: 'Le virus galactique',
        description: 'Un virus inconnu se répand dans l\'espace, menaçant de détruire toute forme de vie. Comment l\'arrêter ?',
        type: 'choice',
        is_final: false,
    },
    {
        title: 'La flotte ennemie',
        description: 'Une flotte de vaisseaux ennemis arrive à grande vitesse. Que fais-tu pour te défendre ?',
        type: 'choice',
        is_final: false,
    },
    {
        title: 'La planète morte',
        description: 'Tu explores une planète morte où aucune vie n\'a survécu. Mais quelque chose semble encore bouger dans l\'ombre...',
        type: 'choice',
        is_final: false,
    },
    {
        title: 'Les vagues de plasma',
        description: 'Une vague de plasma géante traverse l\'espace, engloutissant tout sur son passage.',
        type: 'destiny',
        is_final: true,
    },
    {
        title: 'Le supernova',
        description: 'Une étoile proche devient supernova, menaçant de tout annihiler.',
        type: 'destiny',
        is_final: true,
    }
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
