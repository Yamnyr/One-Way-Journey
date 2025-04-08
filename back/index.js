const express = require('express');
const bodyParser = require('body-parser');
const db = require('./models');  // Import des modèles
const seedUsers = require('./seeders/userSeeder');
const seedCharacters = require('./seeders/characterSeeder');
const seedScenarios = require('./seeders/scenarioSeeder');
const seedChoices = require('./seeders/choiceSeeder');
const { verifyToken, verifyRole } = require('./middleware/authMiddleware'); // Import des middlewares
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

// Importation des routes
const userRoutes = require('./routes/userRoutes');
const characterRoutes = require('./routes/characterRoutes');
const scenarioRoutes = require('./routes/scenarioRoutes');
const choiceRoutes = require('./routes/choiceRoutes');

// Routes d'utilisateur
app.use('/users', userRoutes);

// Exemple d'itinéraire qui nécessite une authentification et un rôle spécifique (admin)
app.use('/admin', verifyToken, verifyRole(['admin']), (req, res) => {
    res.json({ message: 'Bienvenue dans la zone admin, ' + req.user.username });
});

// Routes de personnage, scénario et choix qui nécessitent une authentification
app.use('/characters', verifyToken, characterRoutes);
app.use('/scenarios', verifyToken, scenarioRoutes);
app.use('/choices', verifyToken, choiceRoutes);

// Synchronisation de la base de données et exécution des seeders
db.sequelize.sync({ force: true }) // ⚠️ Attention : force: true réinitialise la BDD à chaque lancement
    .then(async () => {
        console.log('✅ Base de données synchronisée');

        // Exécution des seeders
        await seedUsers();
        await seedCharacters();
        await seedScenarios();
        await seedChoices();
    })
    .catch(error => console.error('❌ Erreur de synchronisation de la base de données:', error));

app.listen(port, () => {
    console.log(`✅ Serveur démarré sur http://localhost:${port}`);
});
