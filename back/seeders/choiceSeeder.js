const db = require('../models');

const choices = [
    {
        scenarioId: 1,  // Scénario 1 : Le réveil dans la station spatiale
        description: 'Examiner les systèmes de la station',
        required_stat: 'intelligence',
        required_value: 50,
        result: 'Tu découvres que la station est défectueuse et risque de se détruire.',
        nextScenarioId: 2,
    },
    {
        scenarioId: 1,  // Scénario 1 : Le réveil dans la station spatiale
        description: 'Chercher un moyen de sortir',
        required_stat: 'dexterity',
        required_value: 40,
        result: 'Tu trouves une capsule de sauvetage prête à décoller, mais il faut savoir où aller.',
        nextScenarioId: 9,  // La rencontre avec des clones
    },
    {
        scenarioId: 1,  // Scénario 1 : Le réveil dans la station spatiale
        description: 'Tenter de réparer la station',
        required_stat: 'engineering',
        required_value: 60,
        result: 'Tu répares un système vital, mais le temps presse.',
        nextScenarioId: 3,  // L\'attaque des créatures de l\'ombre
    },
    {
        scenarioId: 2,  // Scénario 2 : Le message crypté
        description: 'Suivre les instructions du message',
        required_stat: 'charisma',
        required_value: 50,
        result: 'Le message te mène à une zone sécurisée de la station.',
        nextScenarioId: 9,  // La rencontre avec des clones
    },
    {
        scenarioId: 2,  // Scénario 2 : Le message crypté
        description: 'Ignorer le message et partir explorer',
        required_stat: 'courage',
        required_value: 60,
        result: 'Le message semble provenir d\'une intelligence artificielle ancienne qui t\'observe.',
        nextScenarioId: 4,  // Le vaisseau fantôme
    },
    {
        scenarioId: 2,  // Scénario 2 : Le message crypté
        description: 'Tenter de répondre au message',
        required_stat: 'intelligence',
        required_value: 70,
        result: 'Un portail spatial s\'ouvre, te permettant de traverser vers un autre vaisseau.',
        nextScenarioId: 5,  // Le trou noir
    },
    {
        scenarioId: 3,  // Scénario 3 : L\'attaque des créatures de l\'ombre
        description: 'Utiliser des armes énergétiques',
        required_stat: 'strength',
        required_value: 50,
        result: 'Tu repousses les créatures, mais tes ressources sont épuisées.',
        nextScenarioId: 6,  // La découverte d\'une porte interdimensionnelle
    },
    {
        scenarioId: 3,  // Scénario 3 : L\'attaque des créatures de l\'ombre
        description: 'Trouver un moyen de fuir',
        required_stat: 'dexterity',
        required_value: 70,
        result: 'Tu réussis à activer une capsule de sauvetage et t\'enfuis dans l\'espace.',
        nextScenarioId: 7,  // Les trous de ver instables
    },
    {
        scenarioId: 3,  // Scénario 3 : L\'attaque des créatures de l\'ombre
        description: 'Chercher un abri pour te cacher',
        required_stat: 'stealth',
        required_value: 50,
        result: 'Tu attends que la menace passe, mais tu es vulnérable.',
        nextScenarioId: 12,  // Le supernova
    },
    {
        scenarioId: 4,  // Scénario 4 : Le vaisseau fantôme
        description: 'Monter à bord du vaisseau',
        required_stat: 'courage',
        required_value: 60,
        result: 'Tu découvres une technologie avancée qui peut t\'aider.',
        nextScenarioId: 10,  // Le retour sur Terre
    },
    {
        scenarioId: 4,  // Scénario 4 : Le vaisseau fantôme
        description: 'Analyser le vaisseau depuis l\'extérieur',
        required_stat: 'intelligence',
        required_value: 50,
        result: 'Le vaisseau semble avoir des systèmes de défense actifs.',
        nextScenarioId: 3,  // L\'attaque des créatures de l\'ombre
    },
    {
        scenarioId: 4,  // Scénario 4 : Le vaisseau fantôme
        description: 'Ignorer le vaisseau et repartir',
        required_stat: 'courage',
        required_value: 40,
        result: 'Tu te diriges vers un autre secteur de l\'espace, évitant les pièges du vaisseau.',
        nextScenarioId: 8,  // La rencontre avec des clones
    },
    {
        scenarioId: 9,  // Scénario 9 : La rencontre avec des clones
        description: 'T\'entretenir avec eux',
        required_stat: 'charisma',
        required_value: 60,
        result: 'Ils t\'expliquent qu\'ils veulent t\'aider.',
        nextScenarioId: 5,  // Le trou noir
    },
    {
        scenarioId: 9,  // Scénario 9 : La rencontre avec des clones
        description: 'Te méfier d\'eux',
        required_stat: 'courage',
        required_value: 50,
        result: 'Les clones t\'attaquent, pensant que tu es une menace.',
        nextScenarioId: 6,  // La découverte d\'une porte interdimensionnelle
    },
    {
        scenarioId: 9,  // Scénario 9 : La rencontre avec des clones
        description: 'T\'unir avec eux',
        required_stat: 'charisma',
        required_value: 70,
        result: 'Vous devenez plus puissants et prêts à affronter l\'inconnu.',
        nextScenarioId: 11,  // La planète morte
    }
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
