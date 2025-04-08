const db = require('../models');
const bcrypt = require('bcrypt');

const users = [
    {
        username: 'john_doe',
        password: 'mypassword123',  // Ce mot de passe sera hashé
        email: 'john_doe@example.com',
        role: 'player',
    },
    {
        username: 'ad',
        password: 'ad',  // Ce mot de passe sera hashé
        email: 'admin@example.com',
        role: 'admin',
    },
];

const seedUsers = async () => {
    try {
        for (let userData of users) {
            const hashedPassword = await bcrypt.hash(userData.password, 10);
            await db.User.create({
                username: userData.username,
                password: hashedPassword,
                email: userData.email,
                role: userData.role,
            });
        }
        console.log('✅ Utilisateurs insérés avec succès !');
    } catch (error) {
        console.error('❌ Erreur lors de l\'insertion des utilisateurs:', error);
    }
};

module.exports = seedUsers;
