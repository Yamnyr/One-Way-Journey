const express = require('express');
const bodyParser = require('body-parser');
const db = require('./models');  // Import des modèles
const seedUsers = require('./seeders/userSeeder');
const seedCharacters = require('./seeders/characterSeeder');
const seedScenarios = require('./seeders/scenarioSeeder');
const seedChoices = require('./seeders/choiceSeeder');
const { verifyToken } = require('./middleware/authMiddleware'); // Import des middlewares
const cors = require('cors');

const app = express();
const port = 3333;

app.use(cors());
app.use(bodyParser.json());
const mysql = require('mysql2/promise');

async function createDatabaseIfNotExists() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD
    });

    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\`;`);
    console.log(`📁 Base de données "${process.env.DB_NAME}" vérifiée/créée`);
    await connection.end();
}

// Importation des routes
const userRoutes = require('./routes/userRoutes');
const characterRoutes = require('./routes/characterRoutes');
const scenarioRoutes = require('./routes/scenarioRoutes');
const choiceRoutes = require('./routes/choiceRoutes');

// Routes d'utilisateur
app.use('/users', userRoutes);

// Routes de personnage, scénario et choix qui nécessitent une authentification
app.use('/characters', verifyToken, characterRoutes);
app.use('/scenarios', verifyToken, scenarioRoutes);
app.use('/choices', verifyToken, choiceRoutes);

// Synchronisation de la base de données et exécution des seeders
createDatabaseIfNotExists()
    .then(() => db.sequelize.sync({ force: true })) // ⚠️ "force: true" réinitialise tout à chaque lancement
    .then(async () => {
        console.log('✅ Base de données synchronisée');

        // Exécution des seeders
        await seedUsers();
        await seedScenarios();
        await seedCharacters();
        await seedChoices();
    })
    .catch(error => console.error('❌ Erreur de synchronisation de la base de données:', error));

app.listen(port, () => {
    console.log(`✅ Serveur démarré sur http://localhost:${port}`);
});
