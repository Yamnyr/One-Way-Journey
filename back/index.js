const express = require('express');
const db = require('./models'); // Importation de tous les modèles

const app = express();
const port = 3000;

// Synchronisation avec MySQL
db.sequelize.sync({ force: true }) // Force la recréation de la base (à désactiver en prod)
    .then(async () => {
        console.log('✅ Base de données synchronisée');
    })
    .catch((error) => {
        console.error('❌ Erreur de synchronisation de la base de données :', error);
    });

// Route de test
app.get('/', (req, res) => {
    res.send('Hello, Express with Sequelize!');
});

app.listen(port, () => {
    console.log(`✅ Serveur démarré sur http://localhost:${port}`);
});
