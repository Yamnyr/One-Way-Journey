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
        nextScenarioId: 2,              // Une réparation nécessaire
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
        nextScenarioId:2,         //Le message 
    },
    //Une réparation nécessaire
    {
        scenarioId: 1,  
        description: 'Tenter de réparer la station',
        required_stat: 'intelligence',
        required_value: 70,
        result: 'Vous avez reparé la station, sur les écrans un message d\'alerte s\'affiche',
        effect_intelligence: 15,   
        effect_luck: 10,   
        effect_dexterity: 5,      
        nextScenarioId:2,         //La supernova
    },

    {
        scenarioId: 1,  
        description: 'Vous n\'êtes pas capable de réparer la station',
        required_stat: '',
        required_value: 0,
        result: 'BOOM !',
        effect_intelligence: 15,   
        effect_life: -9999, 
        nextScenarioId:2,         // la station explose
    },
    
    //La supernova

    {
        scenarioId: 1,  
        description: 'Tenter de déplacer la station derriere une planète pour se proteger',
        required_stat: 'dexterity',
        required_value: 80,
        result: 'Vous reussissez assez rapidement à vous cacher derriere une planète.',
        effect_intelligence: 15,   
        effect_luck: 5,           
        nextScenarioId:2,         //Une Planete Morte
    },
    {
        scenarioId: 1,  
        description: 'Tenter de réparer la station',
        required_stat: 'intelligence',
        required_value: 70,
        result: 'Vous avez reparé la station, sur les écrans un message d\'alerte s\'affiche',
        effect_intelligence: 15,   
        effect_luck: 10,   
        effect_dexterity: 5,      
        nextScenarioId:2,         //La supernova
    },
    //Une Planete Morte

    {
        scenarioId: 1,  
        description: 'La planète semble avoir souffert mais peut etre qu\'il y a encore des êtres vivant ?',
        required_stat: 'dexterity',
        required_value: 80,
        result: 'Vous Vous posez sur la planète.',
        effect_intelligence: 15,   
        effect_luck: 5,           
        nextScenarioId:2,         //La planète morte.
    },
    {
        scenarioId: 1,  
        description: 'Tenter de réparer la station',
        required_stat: 'intelligence',
        required_value: 70,
        result: 'Vous avez reparé la station, sur les écrans un message d\'alerte s\'affiche',
        effect_intelligence: 15,   
        effect_luck: 10,   
        effect_dexterity: 5,      
        nextScenarioId:2,         //La supernova
    },

    //La planète morte.
    {
        scenarioId: 3,  
        description: 'tu decides d\'aller voir ce qui bouge',
        required_stat: '',
        required_value: 0,
        result: 'Tu vois un alien mourant qui dit "il y en a d\'autre fuyer !" en pointant le ciel .',        
        effect_dexterity: 999, 
        effect_intelligence: 999,     
        effect_life: 999,          
        effect_luck: 999,  
        nextScenarioId: 7,         //Run
    },

    //Run

    {
        scenarioId: 3,  
        description: 'Tu prends l\'alien et tu fuis',
        required_stat: 'courage',
        required_value: 70,
        result: 'L\'alien etant trop lourd tu ne reussi pas a fuir assez vite.',        
        nextScenarioId: 7,         //Echec fuite
    },
    {
        scenarioId: 3,  
        description: 'Tu prends l\'alien et tu fuis',
        required_stat: 'Dexterity',
        required_value: 80,
        result: 'Tu es assez fort pour sauver l\'alien et toi par la même occasion.',        
        effect_dexterity: 20,     
        effect_life: -10,          
        effect_charisma: 50,  
        nextScenarioId: 7,         //Win fuite
    },
    {
        scenarioId: 3,  
        description: 'Tu Prends pas l\'alien tu le laisse mourir et tu t\'enfuis',
        required_stat: '',
        required_value: 0,
        result: '.',        
        effect_courage : -50,
        effect_luck : -50,
        nextScenarioId: 7,         //Pas fou
    },
    //Win fuite

    {
        scenarioId: 3,  
        description: 'Un signal retenti dans toute la station',
        required_stat: '',
        required_value: 0,
        result: 'L\'alien t\'aide a repondre au signal de son espèce en chantant vos louanges puis meurt...',        
        effect_dexterity: 20,     
        effect_life: -10,          
        effect_charisma: 50,  
        nextScenarioId: 7,         //Une nouvelle vie
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
        nextScenarioId: 4,         // Choisir une direction
    },
    {
        scenarioId: 2,  // Scénario 2 : Le message crypté
        description: 'Tenter de répondre au message',
        required_stat: 'intelligence',
        required_value: 70,
        result: 'Des aliens cherche à entrer en contact, ca à l\'aire important.',
        effect_intelligence: 15,   
        effect_life: -5,           
        nextScenarioId: 5,         // Communication alien
    },

    // Communication alien

    {
        scenarioId: 2,  
        description: 'Vous tentez de communiquer avec les aliens',
        required_stat: 'charisma',
        required_value: 70,
        result: 'Vous communiquer parfaitement avec les aliens, il arrivent vous aider !',
        effect_courage: 15,        
        effect_luck: 15, 
        effect_charisma:20,          
        nextScenarioId: 4,         //Une nouvelle vie
    },
    {
        scenarioId: 2,  
        description: 'Vous ne parlez pas alien mais esseyez quand même',
        required_stat: 'intelligence',
        required_value: 70,
        result: 'Vous parlez difficilement avec les aliens mais ils semblent comprendre, il arrivent vous aider !',
        effect_intelligence: 15,   
        effect_life: -5,           
        nextScenarioId: 5,         //Maison ou pas Maison
    },
    {
        scenarioId: 2,  
        description: 'Vous ne parlez pas alien, Pourquoi s\'embeter à leur parler ?',
        required_stat: '',
        required_value: 0,
        result: 'Vous laissez un VU au Alien pas sur qu\'ils aiment ca ...',
        effect_intelligence: -15,   
        effect_life: -15,           
        nextScenarioId: 5,         // La flotte ennemie X
    },

    //Maison ou pas Maison

    {
        scenarioId: 2,  
        description: 'Deposez moi sur la terre !',
        required_stat: 'Luck',
        required_value: 80,
        result: 'Une chance un traducteur est abord ils vous ont parfaitement compris !',  
        effect_luck: +100,           
        nextScenarioId: 5,         //Home sweet Home
    },
    {
        scenarioId: 2,  
        description: 'Deposez moi sur la terre !',
        required_stat: 'Charisma',
        required_value: 80,
        result: 'Grâce à votre charisme les aliens parviennent à vous comprendre partiellement... ',
        effect_charisma: 10 ,              
        nextScenarioId: 5,         //Le retour sur Terre
    },
    {
        scenarioId: 2,  
        description: 'Deposez moi sur la terre !',
        required_stat: '',
        required_value: 0,
        result: 'Malgrès votre quinte de toux les aliens arrivent à vous comprendre parfaitement !',
        effect_intelligence: -15,   
        effect_life: -15,           
        nextScenarioId: 5,         //La peste
    },

    //La peste

    {
        scenarioId: 2,  
        description: 'La terre a un antidote',
        required_stat: 'Luck',
        required_value: 70,
        result: 'Par chance la Terre a un antidote vous etes sauver et la Terre aussi',  
        effect_luck: +100,           
        nextScenarioId: 5,         //Home sweet Home
    },
    {
        scenarioId: 2,  
        description: 'Extinction',
        required_stat: '',
        required_value: 0,
        result: 'Malheureusement la terre n\'avais pas de solution vous avez une maladie trop dangereuse, vous etes responsable de l\'extinction de l\'humanité',
        effect_charisma: 10 ,              
        nextScenarioId: 5,         //Le retour sur Terre
    },

     //Une nouvelle vie
     {
        scenarioId: 2,  
        description: 'Devenir l\'ambassadeur de votre espèce',
        required_stat: '',
        required_value: 0,
        result: 'Vous choissez une carriere politique dans la quelle vous evolurer progressivement afin de devenir l\'embassadeur de toutes les espèce !',
        effect_intelligence: 15,   
        effect_life: -5,           
        nextScenarioId: 5,         // La flotte ennemie X
    },
    {
        scenarioId: 2,  
        description: 'Faire prosperer le réarmemant démographic Alien',
        required_stat: '',
        required_value: 0,
        result: 'Vous vous reproduisez avec une autre espèce créant ainsi une nouvelle espèce hybride !',
        effect_intelligence: 15,   
        effect_life: -5,           
        nextScenarioId: 5,         // La flotte ennemie X
    },

    //La flotte ennemie

    {
        scenarioId: 2,  
        description: 'Mourir',
        required_stat: 'intelligence',
        required_value: 70,
        result: 'Les aliens decident de tirer sur vous, car votre maman ne vous à pas apris la politesse',
        effect_life: -999,           
        nextScenarioId: 5,        
    },

    // Choisir une direction
    {
        scenarioId: 1,  
        description: 'DROITE',
        required_stat: '',
        required_value: 0,
        result: 'j\'ai l\'impression de voir quelque chose de metalique au loin',
        effect_dexterity: 5,       
        effect_luck: 5,           
        nextScenarioId: 9,         // Le vaisseau fantôme
    },
    {
        scenarioId: 1,  
        description: 'GAUCHE',
        required_stat: '',
        required_value: 0,
        result: 'Par la c\'est quand même un peu beaucoup sombre non ?',
        effect_life: -999,            
        nextScenarioId: 9,         // Le trou noir X
    },
    {
        scenarioId: 1,  
        description: 'DEVANT',
        required_stat: '',
        required_value: 0,
        result: 'Je croit voir quelque chose au loin !',
        effect_dexterity: 10,       
        effect_luck: 5,           
        nextScenarioId: 9,         // Les trous de ver instables
    },

    // Le vaisseau fantôme

    {
        scenarioId: 1,  
        description: 'Ce vaisseau ne me donne pas confiance... Je passe mon tour !',
        required_stat: '',
        required_value: 0,
        result: 'j\'ai l\'impression que ça va etre long',
        effect_life: -999,       
        effect_luck: -999,           
        nextScenarioId: 9,         // Un voyage infini X
    },

    {
        scenarioId: 1,  
        description: 'DROITE',
        required_stat: 'dexterity',
        required_value: 5,
        result: 'j\'ai l\'impression de voir quelque chose de metalique au loin',
        effect_dexterity: 15,                
        nextScenarioId: 9,         // Je rentre dans le vaisseau
    },
    // Je rentre dans le vaisseau

    {
        scenarioId: 1,  
        description: 'Suivre un bruit érange',
        required_stat: 'dexterity',
        required_value: 15,
        result: 'j\'ai l\'impression de voir quelque chose de metalique au loin',
        effect_dexterity: 15,                
        nextScenarioId: 9,         //L\'attaque des créatures de l\'ombre   
    },

    {
        scenarioId: 1,  
        description: 'Chercher de l\'équipement.',
        required_stat: 'intelligence',
        required_value: 45,
        result: 'Vous trouvez un pistolet et une boite de soin. vous sentez une présence derriere vous',
        effect_dexterity: 85  ,
        effect_life: 15      ,        
        nextScenarioId: 9,         // //L\'attaque des créatures de l\'ombre   
    },

    // //L\'attaque des créatures de l\'ombre

    {
        scenarioId: 3,  // Scénario 3 : L'attaque des créatures de l'ombre
        description: 'Vous vous battez au poing',
        required_stat: 'dexterity',
        required_value: 20,
        result: 'Vous perdez ils vous on tuer.',
        effect_life: -999,               
        nextScenarioId: 6,         // Mort dans l'agonie X
    },
    {
        scenarioId: 3,  // Scénario 3 : L'attaque des créatures de l'ombre
        description: 'Combattez avec votre équipement.',
        required_stat: 'dexterity',
        required_value: 150,
        result: 'Tu réussis à activer une capsule de sauvetage et t\'enfuis dans l\'espace.',
        effect_dexterity: 85,     
        effect_life: -10,          
        effect_luck: 10,           
        nextScenarioId: 7,         // Direction la Terre ! X
    },
    

    //Les trous de ver instables

    {
        scenarioId: 3,  
        description: 'Trou de ver Gauche',
        required_stat: '',
        required_value: 0,
        result: 'Une fois le trou de ver traverser vous tomber face a une planete au allure famillliere.',              
        nextScenarioId: 6,         // Le retour sur Terre
    },
    {
        scenarioId: 3,  
        description: 'Trou de ver Droit.',
        required_stat: '',
        required_value: 0,
        result: 'Après etre sorti du trou de ver tu te retrouve face à une immense planette au allure étrange..',        
        nextScenarioId: 7,         //La planète morte
    },

    // Le retour sur Terre

    {
        scenarioId: 3,  
        description: 'Rentrez a la maison !',
        required_stat: '',
        required_value: 0,
        result: 'Vous atterissez tranquillement sur la terre 2.0.',        
        nextScenarioId: 7,         // La rencontre avec des clones
    },

    // La rencontre avec des clones

    {
        scenarioId: 3,  
        description: 'Communiquer avec les clones',
        required_stat: '',
        required_value: 0,
        result: 'Tu vis ta meilleure vie avec les tes nouveaux amis les clones.',        
        effect_dexterity: 999, 
        effect_intelligence: 999,     
        effect_life: 999,          
        effect_luck: 999,  
        nextScenarioId: 7,         // Just a chill clone X
    },

    {
        scenarioId: 3,  
        description: 'Se méfier des clones',
        required_stat: '',
        required_value: 0,
        result: 'Les clones t\'apprecient pas ils te mettent dans un vaisseau et mettent l\'auto pilote droit vers le soleil.',  
        effect_dexterity: -999, 
        effect_intelligence: -999,     
        effect_life: -999,          
        effect_luck: -999,       
        nextScenarioId: 7,         // Just a Bruler X
    },

    //La planète morte
    {
        scenarioId: 3,  
        description: 'tu decides d\'aller voir ce qui bouge',
        required_stat: '',
        required_value: 0,
        result: 'Tu vois un alien mourant qui dit "il y en a d\'autre fuyer !" en pointant le ciel .',        
        effect_dexterity: 999, 
        effect_intelligence: 999,     
        effect_life: 999,          
        effect_luck: 999,  
        nextScenarioId: 7,         //asteroide
    },


    
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