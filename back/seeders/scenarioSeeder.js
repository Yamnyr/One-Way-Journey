// Mise à jour du fichier scenarioSeeder.js avec 20 scénarios
const db = require('../models');

const scenarios = [
    {
        title: 'Le réveil dans la station spatiale',
        description: 'Tu te réveilles dans une station spatiale abandonnée. Une alarme retentit.',
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
        title: 'Une réparation nécessaire',
        description: 'La station est sur le point d\'exploser que faire ?',
        type: 'choice',
        is_final: false,
    },
    {
        title: 'La station explose',
        description: 'La Station explose tu es mort !',
        type: 'destiny',
        is_final: true,
    },
    {
        title: 'L\'attaque des créatures de l\'ombre',
        description: 'Des créatures sombres et insidieuses attaquent . Que veux-tu faire pour te défendre ?',
        type: 'choice',
        is_final: false,
    },
    {
        title: 'Mort dans l\'agonie',
        description: 'Des créatures sombres et insidieuses vous ont tué ...',
        type: 'destiny',
        is_final: true,
    },
    {
        title: 'Un voyage infini',
        description: 'Vous voguez à l\'infini dans l\'immensité de l\'espace... ',
        type: 'destiny',
        is_final: true,
    },

    {
        title: 'Je rentre dans le vaisseau',
        description: 'Avec votre petite capsule vous rentrez dans le vaisseau fantôme.',
        type: 'choice',
        is_final: false,
    },


    {
        title: 'Choisir une direction',
        description: 'Dans l\'espace vous poouvez vous diriger ou aller vous ?',
        type: 'choice',
        is_final: false,
    },
    {
        title: 'Le vaisseau fantôme',
        description: 'En explorant, tu tombes sur un vaisseau fantôme flottant dans le vide sidéral.',
        type: 'choice',
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
        type: 'choice',
        is_final: false,
    },
    {
        title: 'Direction la Terre !',
        description: 'Après un beau combat vous trouvez comment piloter le vaisseau et vous rentrez chez vous !.',
        type: 'destiny',
        is_final: true,
    },
    {
        title: 'Le retour sur Terre',
        description: 'Après des années dans l\'espace, tu vois enfin la Terre apparaître au loin. Mais elle semble différente.',
        type: 'choice',
        is_final: false,
    },

    {
        title: 'Maison ou pas Maison',
        description: 'Les aliens veulent t\'aider demande leurs de rentrer chez toi ! ',
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
        title: 'Just a chill clone',
        description: 'Une vie Chill entre clone',
        type: 'destiny',
        is_final: true,
    },
    {
        title: 'Communication alien',
        description: 'Des aliens cherche à entrer en contact, ca à l\'aire important a changer',
        type: 'choice',
        is_final: false,
    },
    {
        title: 'Echec fuite',
        description: 'L\'alien etant trop lourd tu ne ne réussis pas à fuir assez vite vous mourrez ...',
        type: 'destiny',
        is_final: true,
    },
    {
        title: 'Win fuite',
        description: 'Vous parvenez à fuire avec l\'alien lorsque vous recevez un signal',
        type: 'choice',
        is_final: false,
    },

    {
        title: 'Just a Bruler',
        description: 'hummm mergez',
        type: 'destiny',
        is_final: true,
    },
    {
        title: 'Home sweet Home',
        description: 'Vous rentrez sur terre !',
        type: 'destiny',
        is_final: true,
    },
    {
        title: 'La peste',
        description: 'Vous toussez de plus en plus vous trouverez une solution sur terre ?',
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
        description: 'Une flotte de vaisseaux ennemis arrive à grande vitesse. laisser un VU c\'est pas ouf...',
        type: 'choice',
        is_final: false,
    },
    {
        title: 'Une nouvelle vie',
        description: 'Les aliens vous trouvent super charismatique ! tellement qu\'ils vous proposent différentes options.',
        type: 'choice',
        is_final: false,
    },
    {
        title: 'La planète morte',
        description: ' Tu explores une planète morte où aucune vie n\'a survécu. Mais quelque chose semble encore bouger dans l\'ombre...',
        type: 'choice',
        is_final: false,
    },
    {
        title: 'La planète morte.',
        description: '. Tu explores une planète morte où aucune vie n\'a survécu. Mais quelque chose semble encore bouger dans l\'ombre...',
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
        title: 'La supernova',
        description: 'Une étoile proche devient supernova, menaçant de tout annihiler.',
        type: 'choice',
        is_final: false,
    },

    {
        title: 'Une Planete Morte',
        description: 'La planète derrière laquelle vous vous cachiez semble étrange.',
        type: 'choice',
        is_final: false,
    },
    {
        title: 'asteroide',
        description: 'Des Miliers d\'asteroide font droit sur vous !.',
        type: 'destiny',
        is_final: true,
    },
    {
        title: 'Run',
        description: 'Dans l\'urgence un choix s\'impose ! Que faire ?',
        type: 'choice',
        is_final: false,
    },
    {
        title: 'Président des aliens',
        description: 'Vous vivez une vie grandiose en montant les échellons de votre carrière politique !',
        type: 'destiny',
        is_final: true,
    },
    {
        title: 'Heureux evenement',
        description: 'Vous apprecier enormement vos ami les aliens tellement que vous faite 500 bébés !',
        type: 'destiny',
        is_final: true,
    },
    {
        title: 'Mort',
        description: 'Dans la vie il faut être poli sinon on meurt !',
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
