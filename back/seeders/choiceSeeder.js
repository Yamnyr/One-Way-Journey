// choiceSeeder.js - version optimisée
const db = require('../models');

const choices = [
    //un debut alarmant
    {
        scenarioId: 1,
        description: 'Examiner les systèmes de la station',
        required_stat: 'intelligence',
        required_value: 50,
        result: 'Tu découvres que la station est défectueuse et risque de se détruire.',
        effect_intelligence: 10,
        effect_life: -5,
        nextScenarioId: 3,              // Une réparation nécessaire
    },
    {
        scenarioId: 1,
        description: 'Chercher un moyen de sortir',
        required_stat: 'dexterity',
        required_value: 40,
        result: 'Tu trouves une capsule de sauvetage prête à décoller, mais il faut savoir où aller.',
        effect_dexterity: 5,
        effect_luck: 15,
        nextScenarioId: 9,         // Choisir une direction
    },
    {
        scenarioId: 1,
        description: 'Tenter de trouver d\'ou vient le signal',
        required_stat: '',
        required_value: 0,
        result: 'c\'est un message crypté il a l\'air imporant.',
        effect_intelligence: 15,
        effect_luck: 5,
        nextScenarioId: 2,         //Le message 
    },
    //Une réparation nécessaire
    {
        scenarioId: 3,
        description: 'Tenter de réparer la station',
        required_stat: 'intelligence',
        required_value: 70,
        result: 'Vous avez reparé la station, sur les écrans un message d\'alerte s\'affiche',
        effect_intelligence: 15,
        effect_luck: 10,
        effect_dexterity: 5,
        nextScenarioId: 31,         //La supernova
    },

    {
        scenarioId: 3,
        description: 'Vous n\'êtes pas capable de réparer la station',
        required_stat: '',
        required_value: 0,
        result: 'BOOM !',
        effect_intelligence: 15,
        effect_life: -999,
        nextScenarioId: 4,         // la station explose
    },

    //La supernova

    {
        scenarioId: 31,
        description: 'Tenter de déplacer la station derriere une planète pour se proteger',
        required_stat: 'dexterity',
        required_value: 80,
        result: 'Vous reussissez assez rapidement à vous cacher derriere une planète.',
        effect_intelligence: 15,
        effect_luck: 5,
        nextScenarioId: 32,         //Une Planete Morte
    },
    {
        scenarioId: 31,
        description: 'Tenter de déplacer la station derriere une planète pour se proteger',
        required_stat: '',
        required_value: 0,
        result: 'Vous reussissez pas assez rapidement à vous cacher derriere une planète.',
        effect_intelligence: 15,
        effect_life: -999,
        effect_dexterity: 5,
        nextScenarioId: 4,         //boom
    },
    //Une Planete Morte

    {
        scenarioId: 32,
        description: 'La planète semble avoir souffert mais peut etre qu\'il y a encore des êtres vivant ?',
        required_stat: 'dexterity',
        required_value: 80,
        result: 'Vous Vous posez sur la planète.',
        effect_intelligence: 15,
        effect_luck: 5,
        nextScenarioId: 29,         //La planète morte.
    },
    // {
    //     scenarioId: 32,  
    //     description: 'Tenter de réparer la station',
    //     required_stat: 'intelligence',
    //     required_value: 70,
    //     result: 'Vous avez reparé la station, sur les écrans un message d\'alerte s\'affiche',
    //     effect_intelligence: 15,   
    //     effect_luck: 10,   
    //     effect_dexterity: 5,      
    //     nextScenarioId:4,         //La supernova
    // },

    //La planète morte.
    {
        scenarioId: 29,
        description: 'tu decides d\'aller voir ce qui bouge',
        required_stat: '',
        required_value: 0,
        result: 'Tu vois un alien mourant qui dit "il y en a d\'autre fuyer !" en pointant le ciel .',
        effect_dexterity: 999,
        effect_intelligence: 999,
        effect_life: 999,
        effect_luck: 999,
        nextScenarioId: 34,         //Run
    },

    //Run

    {
        scenarioId: 34,
        description: 'Tu prends l\'alien et tu fuis',
        required_stat: 'courage',
        required_value: 70,
        effect_life: -9999,
        result: 'L\'alien etant trop lourd tu ne reussi pas a fuir assez vite.',
        nextScenarioId: 20,         //Echec fuite
    },
    {
        scenarioId: 34,
        description: 'Tu prends l\'alien et tu fuis',
        required_stat: 'Dexterity',
        required_value: 80,
        result: 'Tu es assez fort pour sauver l\'alien et toi par la même occasion.',
        effect_dexterity: 20,
        effect_life: -10,
        effect_charisma: 50,
        nextScenarioId: 21,         //Win fuite
    },
    {
        scenarioId: 34,
        description: 'Tu Prends pas l\'alien tu le laisse mourir et tu t\'enfuis',
        required_stat: '',
        required_value: 0,
        result: '.',
        effect_courage: -50,
        effect_luck: -50,
        nextScenarioId: 4,         //Pas le bon
    },
    //Win fuite

    {
        scenarioId: 21,
        description: 'Un signal retenti dans toute la station',
        required_stat: '',
        required_value: 0,
        result: 'L\'alien t\'aide a repondre au signal de son espèce en chantant vos louanges puis meurt...',
        effect_dexterity: 20,
        effect_life: -10,
        effect_charisma: 50,
        nextScenarioId: 27,         //Une nouvelle vie
    },


    //Le message 
    {
        scenarioId: 2,
        description: 'Suivre les instructions du message',
        required_stat: 'charisma',
        required_value: 50,
        result: 'Le message te mène à une zone sécurisée de la station ou tu trouve un capsule de sauvetage.',
        effect_charisma: 5,
        effect_life: 15,
        nextScenarioId: 9,         // Choisir une direction
    },
    {
        scenarioId: 2,
        description: 'Ignorer le message et partir explorer',
        required_stat: 'courage',
        required_value: 60,
        result: 'Tu trouves une capsule de sauvetage prête à décoller, mais il faut savoir où aller.',
        effect_courage: 10,
        effect_luck: -5,
        nextScenarioId: 9,         // Choisir une direction
    },
    {
        scenarioId: 2,
        description: 'Tenter de répondre au message',
        required_stat: 'intelligence',
        required_value: 70,
        result: 'Des aliens cherche à entrer en contact, ca à l\'aire important.',
        effect_intelligence: 15,
        effect_life: -5,
        nextScenarioId: 19,         // Communication alien
    },

    // Communication alien

    {
        scenarioId: 19,
        description: 'Vous tentez de communiquer avec les aliens',
        required_stat: 'charisma',
        required_value: 70,
        result: 'Vous communiquer parfaitement avec les aliens, il arrivent vous aider !',
        effect_courage: 15,
        effect_luck: 15,
        effect_charisma: 20,
        nextScenarioId: 27,         //Une nouvelle vie
    },
    {
        scenarioId: 19,
        description: 'Vous ne parlez pas alien mais esseyez quand même',
        required_stat: 'intelligence',
        required_value: 70,
        result: 'Vous parlez difficilement avec les aliens mais ils semblent comprendre, il arrivent vous aider !',
        effect_intelligence: 15,
        effect_life: -5,
        nextScenarioId: 16,         //Maison ou pas Maison
    },
    {
        scenarioId: 19,
        description: 'Vous ne parlez pas alien, Pourquoi s\'embeter à leur parler ?',
        required_stat: '',
        required_value: 0,
        result: 'Vous laissez un VU au Alien pas sur qu\'ils aiment ca ...',
        effect_intelligence: -15,
        effect_life: -999,
        nextScenarioId: 26,         // La flotte ennemie X
    },

    //Maison ou pas Maison

    {
        scenarioId: 16,
        description: 'Deposez moi sur la terre !',
        required_stat: 'Luck',
        required_value: 80,
        result: 'Une chance un traducteur est abord ils vous ont parfaitement compris !',
        effect_luck: +100,
        nextScenarioId: 23,         //Home sweet Home
    },
    {
        scenarioId: 16,
        description: 'Deposez moi sur la terre !',
        required_stat: 'Charisma',
        required_value: 80,
        result: 'Grâce à votre charisme les aliens parviennent à vous comprendre partiellement... ',
        effect_charisma: 10,
        nextScenarioId: 15,         //Le retour sur Terre
    },
    {
        scenarioId: 16,
        description: 'Deposez moi sur la terre !',
        required_stat: '',
        required_value: 0,
        result: 'Malgrès votre quinte de toux les aliens arrivent à vous comprendre parfaitement !',
        effect_intelligence: -15,
        effect_life: -15,
        nextScenarioId: 24,         //La peste
    },

    //La peste

    {
        scenarioId: 24,
        description: 'La terre a un antidote',
        required_stat: 'Luck',
        required_value: 70,
        result: 'Par chance la Terre a un antidote vous etes sauver et la Terre aussi',
        effect_luck: +100,
        nextScenarioId: 23,         //Home sweet Home
    },
    {
        scenarioId: 24,
        description: 'Extinction',
        required_stat: '',
        required_value: 0,
        result: 'Malheureusement la terre n\'avais pas de solution vous avez une maladie trop dangereuse, vous etes responsable de l\'extinction de l\'humanité',
        effect_charisma: 10,
        nextScenarioId: 15,         //Le retour sur Terre
    },

    //Une nouvelle vie
    {
        scenarioId: 27,
        description: 'Devenir l\'ambassadeur de votre espèce',
        required_stat: '',
        required_value: 0,
        result: 'Vous choissez une carriere politique dans la quelle vous evolurer progressivement afin de devenir l\'embassadeur de toutes les espèce !',
        effect_intelligence: 15,
        effect_life: -5,
        nextScenarioId: 35,         // 35 Président des aliens
    },
    {
        scenarioId: 27,
        description: 'Faire prosperer le réarmemant démographic Alien',
        required_stat: '',
        required_value: 0,
        result: 'Vous vous reproduisez avec une autre espèce créant ainsi une nouvelle espèce hybride !',
        effect_intelligence: 15,
        effect_life: -5,
        nextScenarioId: 36,         // 36 Heureux evenement (500  bebe)
    },

    //La flotte ennemie

    {
        scenarioId: 26,
        description: 'Mourir',
        required_stat: 'intelligence',
        required_value: 70,
        result: 'Les aliens decident de tirer sur vous, car votre maman ne vous à pas apris la politesse',
        effect_life: -999,
        nextScenarioId: 37,  // 37 Mort      
    },

    // Choisir une direction
    {
        scenarioId: 9,
        description: 'DROITE',
        required_stat: '',
        required_value: 0,
        result: 'j\'ai l\'impression de voir quelque chose de metalique au loin',
        effect_dexterity: 5,
        effect_luck: 5,
        nextScenarioId: 10,         // Le vaisseau fantôme
    },
    {
        scenarioId: 9,
        description: 'GAUCHE',
        required_stat: '',
        required_value: 0,
        result: 'Par la c\'est quand même un peu beaucoup sombre non ?',
        effect_life: -999,
        nextScenarioId: 11,         // Le trou noir X
    },
    {
        scenarioId: 9,
        description: 'DEVANT',
        required_stat: '',
        required_value: 0,
        result: 'Je croit voir quelque chose au loin !',
        effect_dexterity: 10,
        effect_luck: 5,
        nextScenarioId: 13,         // Les trous de ver instables
    },

    // Le vaisseau fantôme

    {
        scenarioId: 10,
        description: 'Ce vaisseau ne me donne pas confiance... Je passe mon tour !',
        required_stat: '',
        required_value: 0,
        result: 'j\'ai l\'impression que ça va etre long',
        effect_life: -999,
        effect_luck: -999,
        nextScenarioId: 7,         // Un voyage infini X
    },

    {
        scenarioId: 10,
        description: 'Je vais tenter ma chance avec ce vaisseau',
        required_stat: 'luck',
        required_value: 15,
        result: 'Vous rentrez sans encombre dans le vaisseau mais il y a un bruit étrange',
        effect_dexterity: 15,
        nextScenarioId: 8,         // Je rentre dans le vaisseau
    },
    // Je rentre dans le vaisseau

    {
        scenarioId: 8,
        description: 'Suivre un bruit érange',
        required_stat: 'dexterity',
        required_value: 15,
        result: 'Vous tombez face à des créatures de l\'ombre.',
        effect_dexterity: 15,
        nextScenarioId: 5,         //L\'attaque des créatures de l\'ombre   
    },

    {
        scenarioId: 8,
        description: 'Chercher de l\'équipement.',
        required_stat: 'intelligence',
        required_value: 45,
        result: 'Vous trouvez un pistolet et une boite de soin. vous sentez une présence derriere vous',
        effect_dexterity: 85,
        effect_life: 15,
        nextScenarioId: 5,         // //L\'attaque des créatures de l\'ombre   
    },

    // //L\'attaque des créatures de l\'ombre

    {
        scenarioId: 5,  // Scénario 3 : L'attaque des créatures de l'ombre
        description: 'Vous vous battez au poing',
        required_stat: 'dexterity',
        required_value: 20,
        result: 'Vous perdez ils vous ont tuer.',
        effect_life: -999,
        nextScenarioId: 6,         // Mort dans l'agonie X
    },
    {
        scenarioId: 5,  // Scénario 3 : L'attaque des créatures de l'ombre
        description: 'Combattez avec votre équipement.',
        required_stat: 'dexterity',
        required_value: 150,
        result: 'Une fois avoir combattu les créatures, vous vous dirigez vers le poste de pilotage du vaisseau.',
        effect_dexterity: 85,
        effect_life: -10,
        effect_luck: 10,
        nextScenarioId: 14,         // Direction la Terre ! X
    },


    //Les trous de ver instables

    {
        scenarioId: 13,
        description: 'Trou de ver Gauche',
        required_stat: '',
        required_value: 0,
        result: 'Une fois le trou de ver traverser vous tomber face a une planete au allure famillliere.',
        nextScenarioId: 15,         // Le retour sur Terre
    },
    {
        scenarioId: 13,
        description: 'Trou de ver Droit.',
        required_stat: '',
        required_value: 0,
        result: 'Après etre sorti du trou de ver tu te retrouve face à une immense planette au allure étrange..',
        nextScenarioId: 28,         //La planète morte
    },

    // Le retour sur Terre

    {
        scenarioId: 15,
        description: 'Rentrez a la maison !',
        required_stat: '',
        required_value: 0,
        result: 'Vous atterissez tranquillement sur la terre 2.0.',
        nextScenarioId: 17,         // La rencontre avec des clones
    },

    // La rencontre avec des clones

    {
        scenarioId: 17,
        description: 'Communiquer avec les clones',
        required_stat: '',
        required_value: 0,
        result: 'Tu vis ta meilleure vie avec les tes nouveaux amis les clones.',
        effect_dexterity: 999,
        effect_intelligence: 999,
        effect_life: 999,
        effect_luck: 999,
        nextScenarioId: 18,         // Just a chill clone X
    },

    {
        scenarioId: 17,
        description: 'Se méfier des clones',
        required_stat: '',
        required_value: 0,
        result: 'Les clones t\'apprecient pas ils te mettent dans un vaisseau et mettent l\'auto pilote droit vers le soleil.',
        effect_dexterity: -999,
        effect_intelligence: -999,
        effect_life: -999,
        effect_luck: -999,
        nextScenarioId: 22,         // Just a Bruler X
    },

    //La planète morte
    {
        scenarioId: 28,
        description: 'tu decides d\'aller voir ce qui bouge',
        required_stat: '',
        required_value: 0,
        result: 'Tu vois un alien mourant qui dit "il y en a d\'autre fuyer !" en pointant le ciel .',
        effect_dexterity: 10,
        effect_intelligence: 5,
        nextScenarioId: 33,         //asteroide
    },



];

// Pour les scénarios finaux ou de type "destiny", on ajoute des effets plus dramatiques
const finalChoices = [
    {
        scenarioId: 5,  // Le trou noir
        description: 'Tenter de s\'échapper du trou noir',
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
