const db = require('../models');

// const scenarios = [
//     { id: 1, name: 'Default Scenario', description: 'Le premier scénario par défaut.' },
// ];

const characters = [
    {
        userId: 1,
        name: 'John the Brave',
        species: 'Human',
        life: 100,
        charisma: 50,
        dexterity: 60,
        intelligence: 70,
        luck: 80,
    },
    {
        userId: 2,
        name: 'Admin Lord',
        species: 'Elf',
        life: 120,
        charisma: 90,
        dexterity: 80,
        intelligence: 100,
        luck: 70,
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
