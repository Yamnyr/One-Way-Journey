const express = require('express');
const bodyParser = require('body-parser');
const db = require('./models'); // Import des modèles

const app = express();
const port = 3333;

app.use(bodyParser.json());

// Importation des routes
const userRoutes = require('./routes/userRoutes');
const characterRoutes = require('./routes/characterRoutes');
const scenarioRoutes = require('./routes/scenarioRoutes');
const choiceRoutes = require('./routes/choiceRoutes');

app.use('/users', userRoutes);
app.use('/characters', characterRoutes);
app.use('/scenarios', scenarioRoutes);
app.use('/choices', choiceRoutes);

// Synchronisation de la base de données
db.sequelize.sync({ force: true }) // ⚠️ Attention : force: true réinitialise la BDD à chaque lancement
    .then(() => console.log('✅ Base de données synchronisée'))
    .catch(error => console.error('❌ Erreur de synchronisation de la base de données:', error));

app.listen(port, () => {
    console.log(`✅ Serveur démarré sur http://localhost:${port}`);
});
