const db = require("../models")
const { hash, compare } = require("bcrypt")
const { sign } = require("jsonwebtoken")
const { User } = db // Import du modèle User
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")

// Fonction pour générer un token JWT
const generateToken = (user) => {
    return jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        process.env.SECRET_KEY, // Utiliser une clé secrète dans .env
        { expiresIn: "24h" }, // Expiration du token (24 heures)
    )
}

// Inscription d'un utilisateur
exports.createUser = async (req, res) => {
    try {
        const { username, password, email, role } = req.body
        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await db.User.create({ username, password: hashedPassword, email, role })

        // Générer un token pour l'utilisateur
        const token = generateToken(user)

        // Renvoi de la réponse avec le token
        res.status(201).json({ user, token })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// Connexion de l'utilisateur avec génération du token
exports.loginUser = async (req, res) => {
    try {
        const { username, password } = req.body
        const user = await db.User.findOne({ where: { username } })

        if (!user) {
            return res.status(404).json({ error: "Utilisateur non trouvé" })
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            return res.status(401).json({ error: "Mot de passe incorrect" })
        }

        // Générer un token pour l'utilisateur
        const token = generateToken(user)

        res.json({ message: "Connexion réussie", user, token })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

// Récupérer tous les utilisateurs (accessible uniquement par les administrateurs)
exports.getAllUsers = async (req, res) => {
    try {
        // Vérifier que l'utilisateur est un administrateur
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Accès interdit. Vous devez être un administrateur." })
        }

        // Récupérer tous les utilisateurs
        const users = await db.User.findAll()
        res.status(200).json(users)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

// Mettre à jour un utilisateur (accessible uniquement par les administrateurs)
exports.updateUser = async (req, res) => {
    try {
        const userId = req.params.id
        const { username, email, role, password } = req.body

        // Vérifier que l'utilisateur est un administrateur
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Accès interdit. Vous devez être un administrateur." })
        }

        // Chercher l'utilisateur dans la base de données
        const user = await db.User.findOne({ where: { id: userId } })

        if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouvé." })
        }

        // Préparer les données à mettre à jour
        const updateData = { username, email, role }

        // Si un nouveau mot de passe est fourni, le hacher
        if (password) {
            updateData.password = await bcrypt.hash(password, 10)
        }

        // Mettre à jour l'utilisateur
        await user.update(updateData)

        res.status(200).json({
            message: "Utilisateur mis à jour avec succès !",
            user,
        })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

// Supprimer un utilisateur (accessible uniquement par les administrateurs)
exports.deleteUser = async (req, res) => {
    try {
        const userId = req.params.id

        // Vérifier que l'utilisateur est un administrateur
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Accès interdit. Vous devez être un administrateur." })
        }

        // Chercher l'utilisateur dans la base de données
        const user = await db.User.findOne({ where: { id: userId } })

        if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouvé." })
        }

        // Supprimer l'utilisateur
        await user.destroy()

        res.status(200).json({
            message: "Utilisateur supprimé avec succès !",
        })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}
