const db = require('../models');

const characters = [
    {
        user_id: 1,  // Utilisateur 1 : john_doe
        name: 'John the Brave',
        species: 'Human',
        life: 100,
        charisma: 50,
        dexterity: 60,
        intelligence: 70,
        luck: 80,
    },
    {
        user_id: 2,  // Utilisateur 2 : admin_user
        name: 'Admin Lord',
        species: 'Elf',
        life: 120,
        charisma: 90,
        dexterity: 80,
        intelligence: 100,
        luck: 70,
    },
];

const seedCharacters = async () => {
    try {
        for (let characterData of characters) {
            await db.Character.create(characterData);
        }
        console.log('✅ Personnages insérés avec succès !');
    } catch (error) {
        console.error('❌ Erreur lors de l\'insertion des personnages:', error);
    }
};

module.exports = seedCharacters;
