const db = require('../models');

const choices = [
    {
        scenario_id: 1,  // Scénario 1 : Le réveil dans la station spatiale
        description: 'Examiner les systèmes de la station',
        required_stat: 'intelligence',
        required_value: 50,
        result: 'Tu découvres que la station est défectueuse et risque de se détruire.',
        next_scenario_id: 2,
    },
    {
        scenario_id: 1,  // Scénario 1 : Le réveil dans la station spatiale
        description: 'Chercher un moyen de sortir',
        required_stat: 'dexterity',
        required_value: 40,
        result: 'Tu trouves une capsule de sauvetage prête à décoller, mais il faut savoir où aller.',
        next_scenario_id: 9,  // La rencontre avec des clones
    },
    {
        scenario_id: 1,  // Scénario 1 : Le réveil dans la station spatiale
        description: 'Tenter de réparer la station',
        required_stat: 'engineering',
        required_value: 60,
        result: 'Tu répares un système vital, mais le temps presse.',
        next_scenario_id: 3,  // L\'attaque des créatures de l\'ombre
    },
    {
        scenario_id: 2,  // Scénario 2 : Le message crypté
        description: 'Suivre les instructions du message',
        required_stat: 'charisma',
        required_value: 50,
        result: 'Le message te mène à une zone sécurisée de la station.',
        next_scenario_id: 9,  // La rencontre avec des clones
    },
    {
        scenario_id: 2,  // Scénario 2 : Le message crypté
        description: 'Ignorer le message et partir explorer',
        required_stat: 'courage',
        required_value: 60,
        result: 'Le message semble provenir d\'une intelligence artificielle ancienne qui t\'observe.',
        next_scenario_id: 4,  // Le vaisseau fantôme
    },
    {
        scenario_id: 2,  // Scénario 2 : Le message crypté
        description: 'Tenter de répondre au message',
        required_stat: 'intelligence',
        required_value: 70,
        result: 'Un portail spatial s\'ouvre, te permettant de traverser vers un autre vaisseau.',
        next_scenario_id: 5,  // Le trou noir
    },
    {
        scenario_id: 3,  // Scénario 3 : L\'attaque des créatures de l\'ombre
        description: 'Utiliser des armes énergétiques',
        required_stat: 'strength',
        required_value: 50,
        result: 'Tu repousses les créatures, mais tes ressources sont épuisées.',
        next_scenario_id: 6,  // La découverte d\'une porte interdimensionnelle
    },
    {
        scenario_id: 3,  // Scénario 3 : L\'attaque des créatures de l\'ombre
        description: 'Trouver un moyen de fuir',
        required_stat: 'dexterity',
        required_value: 70,
        result: 'Tu réussis à activer une capsule de sauvetage et t\'enfuis dans l\'espace.',
        next_scenario_id: 7,  // Les trous de ver instables
    },
    {
        scenario_id: 3,  // Scénario 3 : L\'attaque des créatures de l\'ombre
        description: 'Chercher un abri pour te cacher',
        required_stat: 'stealth',
        required_value: 50,
        result: 'Tu attends que la menace passe, mais tu es vulnérable.',
        next_scenario_id: 12,  // Le supernova
    },
    {
        scenario_id: 4,  // Scénario 4 : Le vaisseau fantôme
        description: 'Monter à bord du vaisseau',
        required_stat: 'courage',
        required_value: 60,
        result: 'Tu découvres une technologie avancée qui peut t\'aider.',
        next_scenario_id: 10,  // Le retour sur Terre
    },
    {
        scenario_id: 4,  // Scénario 4 : Le vaisseau fantôme
        description: 'Analyser le vaisseau depuis l\'extérieur',
        required_stat: 'intelligence',
        required_value: 50,
        result: 'Le vaisseau semble avoir des systèmes de défense actifs.',
        next_scenario_id: 3,  // L\'attaque des créatures de l\'ombre
    },
    {
        scenario_id: 4,  // Scénario 4 : Le vaisseau fantôme
        description: 'Ignorer le vaisseau et repartir',
        required_stat: 'courage',
        required_value: 40,
        result: 'Tu te diriges vers un autre secteur de l\'espace, évitant les pièges du vaisseau.',
        next_scenario_id: 8,  // La rencontre avec des clones
    },
    {
        scenario_id: 9,  // Scénario 9 : La rencontre avec des clones
        description: 'T\'entretenir avec eux',
        required_stat: 'charisma',
        required_value: 60,
        result: 'Ils t\'expliquent qu\'ils veulent t\'aider.',
        next_scenario_id: 5,  // Le trou noir
    },
    {
        scenario_id: 9,  // Scénario 9 : La rencontre avec des clones
        description: 'Te méfier d\'eux',
        required_stat: 'courage',
        required_value: 50,
        result: 'Les clones t\'attaquent, pensant que tu es une menace.',
        next_scenario_id: 6,  // La découverte d\'une porte interdimensionnelle
    },
    {
        scenario_id: 9,  // Scénario 9 : La rencontre avec des clones
        description: 'T\'unir avec eux',
        required_stat: 'charisma',
        required_value: 70,
        result: 'Vous devenez plus puissants et prêts à affronter l\'inconnu.',
        next_scenario_id: 11,  // La planète morte
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
