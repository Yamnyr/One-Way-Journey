const jwt = require('jsonwebtoken');

// Middleware pour vérifier le token JWT
exports.verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Token dans le header 'Authorization'

    if (!token) {
        return res.status(403).json({ error: 'Accès interdit, token manquant' });
    }

    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: 'Accès interdit, token invalide' });
        }

        req.user = decoded;  // Ajouter les données utilisateur décodées au `req`
        next();  // Passer au prochain middleware/route
    });
};

// Middleware pour vérifier le rôle de l'utilisateur
// exports.verifyRole = (roles) => {
//     return (req, res, next) => {
//         if (!roles.includes(req.user.role)) {
//             return res.status(403).json({ error: 'Accès interdit, rôle non autorisé' });
//         }
//         next();  // L'utilisateur a le bon rôle, on passe à la suite
//     };
// };

exports.verifyAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Accès interdit. Vous devez être un administrateur.' });
    }
    next();  // L'utilisateur est admin, donc on passe à la prochaine étape
};
