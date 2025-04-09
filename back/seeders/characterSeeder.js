const db = require('../models');

// const scenarios = [
//     { id: 1, name: 'Default Scenario', description: 'Le premier scénario par défaut.' },
// ];

const characters = [
    {
        userId: 1,
        name: 'John the Brave',
        species: 'human',
        life: 100,
        charisma: 70,
        dexterity: 80,
        intelligence: 90,
        luck: 60,
    },
    {
        userId: 2,
        name: 'Admin Borg',
        species: 'cyborg',
        life: 150,
        charisma: 30,
        dexterity: 100,
        intelligence: 130,
        luck: 20,
    },
];

const seedData = async () => {
    try {
        await db.Character.bulkCreate(characters);
        console.log('✅ Personnages insérés avec succès !');
    } catch (error) {
        console.error('❌ Erreur lors de l\'insertion:', error);
    }
};

module.exports = seedData;
