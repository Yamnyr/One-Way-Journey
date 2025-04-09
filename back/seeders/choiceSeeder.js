const db = require('../models');

const choices = [
    {
        scenarioId: 1,  // Scénario 1 : Le réveil dans la station spatiale
        description: 'Examiner les systèmes de la station',
        required_stat: 'intelligence',
        required_value: 50,
        result: 'Tu découvres que la station est défectueuse et risque de se détruire.',
        effect_intelligence: 10,    // Gagné de l'expérience en analysant les systèmes
        effect_life: -5,           // Un peu stressant pour la santé
        nextScenarioId: 2,
    },
    {
        scenarioId: 1,  // Scénario 1 : Le réveil dans la station spatiale
        description: 'Chercher un moyen de sortir',
        required_stat: 'dexterity',
        required_value: 40,
        result: 'Tu trouves une capsule de sauvetage prête à décoller, mais il faut savoir où aller.',
        effect_dexterity: 5,       // Amélioration en cherchant et naviguant
        effect_luck: 15,           // Chanceux de trouver une capsule fonctionnelle
        nextScenarioId: 9,         // La rencontre avec des clones
    },
    {
        scenarioId: 1,  // Scénario 1 : Le réveil dans la station spatiale
        description: 'Tenter de réparer la station',
        required_stat: 'engineering',
        required_value: 60,
        result: 'Tu répares un système vital, mais le temps presse.',
        effect_intelligence: 15,   // Amélioration significative des compétences techniques
        effect_life: -10,          // Effort physique et stress
        nextScenarioId: 3,         // L'attaque des créatures de l'ombre
    },
    {
        scenarioId: 2,  // Scénario 2 : Le message crypté
        description: 'Suivre les instructions du message',
        required_stat: 'charisma',
        required_value: 50,
        result: 'Le message te mène à une zone sécurisée de la station.',
        effect_charisma: 5,        // Confiance augmentée par la réussite
        effect_life: 15,           // Zone sécurisée permet de récupérer
        nextScenarioId: 9,         // La rencontre avec des clones
    },
    {
        scenarioId: 2,  // Scénario 2 : Le message crypté
        description: 'Ignorer le message et partir explorer',
        required_stat: 'courage',
        required_value: 60,
        result: 'Le message semble provenir d\'une intelligence artificielle ancienne qui t\'observe.',
        effect_courage: 10,        // Bravoure récompensée
        effect_luck: -5,           // Pas idéal d'être surveillé
        nextScenarioId: 4,         // Le vaisseau fantôme
    },
    {
        scenarioId: 2,  // Scénario 2 : Le message crypté
        description: 'Tenter de répondre au message',
        required_stat: 'intelligence',
        required_value: 70,
        result: 'Un portail spatial s\'ouvre, te permettant de traverser vers un autre vaisseau.',
        effect_intelligence: 15,   // Grandes découvertes intellectuelles
        effect_life: -5,           // Voyage par portail légèrement dangereux
        nextScenarioId: 5,         // Le trou noir
    },
    {
        scenarioId: 3,  // Scénario 3 : L'attaque des créatures de l'ombre
        description: 'Utiliser des armes énergétiques',
        required_stat: 'strength',
        required_value: 50,
        result: 'Tu repousses les créatures, mais tes ressources sont épuisées.',
        effect_strength: 10,       // Combat améliore la force
        effect_life: -25,          // Combat épuisant et dangereux
        effect_dexterity: 5,       // Manipulation d'armes améliore la dextérité
        nextScenarioId: 6,         // La découverte d'une porte interdimensionnelle
    },
    {
        scenarioId: 3,  // Scénario 3 : L'attaque des créatures de l'ombre
        description: 'Trouver un moyen de fuir',
        required_stat: 'dexterity',
        required_value: 70,
        result: 'Tu réussis à activer une capsule de sauvetage et t\'enfuis dans l\'espace.',
        effect_dexterity: 15,      // Évasion réussie améliore significativement la dextérité
        effect_life: -10,          // Stress de la fuite
        effect_luck: 10,           // Chance d'avoir réussi
        nextScenarioId: 7,         // Les trous de ver instables
    },
    {
        scenarioId: 3,  // Scénario 3 : L'attaque des créatures de l'ombre
        description: 'Chercher un abri pour te cacher',
        required_stat: 'stealth',
        required_value: 50,
        result: 'Tu attends que la menace passe, mais tu es vulnérable.',
        effect_stealth: 10,        // Pratique de la furtivité
        effect_life: -15,          // Stress de l'attente
        effect_luck: -10,          // Situation précaire
        nextScenarioId: 12,        // Le supernova
    },
    {
        scenarioId: 4,  // Scénario 4 : Le vaisseau fantôme
        description: 'Monter à bord du vaisseau',
        required_stat: 'courage',
        required_value: 60,
        result: 'Tu découvres une technologie avancée qui peut t\'aider.',
        effect_courage: 15,        // Acte de bravoure significatif
        effect_intelligence: 20,   // Découverte de nouvelles technologies
        effect_luck: 10,           // Chance de trouver quelque chose d'utile
        nextScenarioId: 10,        // Le retour sur Terre
    },
    {
        scenarioId: 4,  // Scénario 4 : Le vaisseau fantôme
        description: 'Analyser le vaisseau depuis l\'extérieur',
        required_stat: 'intelligence',
        required_value: 50,
        result: 'Le vaisseau semble avoir des systèmes de défense actifs.',
        effect_intelligence: 10,   // Analyse technique réussie
        effect_life: -5,           // Léger risque
        nextScenarioId: 3,         // L'attaque des créatures de l'ombre
    },
    {
        scenarioId: 4,  // Scénario 4 : Le vaisseau fantôme
        description: 'Ignorer le vaisseau et repartir',
        required_stat: 'courage',
        required_value: 40,
        result: 'Tu te diriges vers un autre secteur de l\'espace, évitant les pièges du vaisseau.',
        effect_luck: 15,           // Évitement des dangers potentiels
        effect_courage: -5,        // Choix prudent mais moins courageux
        nextScenarioId: 8,         // La rencontre avec des clones
    },
    {
        scenarioId: 9,  // Scénario 9 : La rencontre avec des clones
        description: 'T\'entretenir avec eux',
        required_stat: 'charisma',
        required_value: 60,
        result: 'Ils t\'expliquent qu\'ils veulent t\'aider.',
        effect_charisma: 15,       // Dialogue réussi
        effect_life: 10,           // Aide reçue améliore la santé
        effect_luck: 5,            // Rencontre favorable
        nextScenarioId: 5,         // Le trou noir
    },
    {
        scenarioId: 9,  // Scénario 9 : La rencontre avec des clones
        description: 'Te méfier d\'eux',
        required_stat: 'courage',
        required_value: 50,
        result: 'Les clones t\'attaquent, pensant que tu es une menace.',
        effect_courage: 5,         // Position défensive montre du courage
        effect_life: -20,          // Blessures dans la confrontation
        effect_charisma: -10,      // Relations détériorées
        nextScenarioId: 6,         // La découverte d'une porte interdimensionnelle
    },
    {
        scenarioId: 9,  // Scénario 9 : La rencontre avec des clones
        description: 'T\'unir avec eux',
        required_stat: 'charisma',
        required_value: 70,
        result: 'Vous devenez plus puissants et prêts à affronter l\'inconnu.',
        effect_charisma: 20,       // Alliance réussie démontre un excellent charisme
        effect_life: 15,           // Force du nombre améliore les chances de survie
        effect_luck: 10,           // Bonne fortune d'avoir des alliés
        nextScenarioId: 11,        // La planète morte
    }
];

// Pour les scénarios finaux ou de type "destiny", on ajoute des effets plus dramatiques
const finalChoices = [
    {
        scenarioId: 5,  // Le trou noir
        description: 'Tenter de s\'échapper du trou noir',
        required_stat: 'intelligence',
        required_value: 90,
        result: 'Tu calcules une trajectoire impossible pour t\'échapper, mais la gravité est trop forte.',
        effect_intelligence: 30,   // Calculs incroyables
        effect_life: -50,          // Dommages physiques graves
        is_game_over: true,        // Fin du jeu
        nextScenarioId: null,
    },
    {
        scenarioId: 14, // Le supernova
        description: 'Essayer de se protéger derrière une planète',
        required_stat: 'luck',
        required_value: 80,
        result: 'Tu te places derrière une planète gazeuse, qui absorbe une partie de l\'explosion.',
        effect_luck: 20,           // Chance incroyable
        effect_life: -40,          // Quand même très dangereux
        effect_dexterity: 15,      // Manœuvres spatiales impressionnantes
        is_game_over: true,        // Fin du jeu
        nextScenarioId: null,
    },
    {
        scenarioId: 7,  // Les trous de ver instables
        description: 'Se laisser emporter par le courant spatial',
        required_stat: 'courage',
        required_value: 75,
        result: 'Tu es projeté à travers la galaxie vers un lieu inconnu et mystérieux.',
        effect_courage: 25,        // Acte de bravoure extrême
        effect_luck: -15,          // Destination aléatoire dangereuse
        effect_life: -20,          // Voyage traumatisant
        is_game_over: false,       // Continue le jeu
        nextScenarioId: 12,        // La planète morte
    }
];

// Combinaison des tableaux de choix
const allChoices = [...choices, ...finalChoices];

const seedChoices = async () => {
    try {
        for (let choiceData of allChoices) {
            await db.Choice.create(choiceData);
        }
        console.log('✅ Choix insérés avec succès !');
    } catch (error) {
        console.error('❌ Erreur lors de l\'insertion des choix:', error);
    }
};

module.exports = seedChoices;