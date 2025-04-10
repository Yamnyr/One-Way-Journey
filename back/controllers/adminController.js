const db = require("../models")
const User = db.User
const Character = db.Character
const Scenario = db.Scenario
const Choice = db.Choice

// Contrôleur pour récupérer les statistiques de l'application
exports.getStatistics = async (req, res) => {
    try {
        // Récupération du nombre d'utilisateurs
        const userCount = await User.count()

        // Récupération du nombre de personnages
        const characterCount = await Character.count()

        // Récupération du nombre de scénarios
        const scenarioCount = await Scenario.count()

        // Récupération du nombre de choix
        const choiceCount = await Choice.count()

        // Récupération du nombre de fins (scénarios avec is_final = 1)
        const endingCount = await Scenario.count({
            where: {
                is_final: true,
            },
        })

        // Retour des statistiques
        return res.status(200).json({
            success: true,
            data: {
                userCount,
                characterCount,
                scenarioCount,
                choiceCount,
                endingCount,
            },
        })
    } catch (error) {
        console.error("Erreur lors de la récupération des statistiques:", error)
        return res.status(500).json({
            success: false,
            message: "Erreur lors de la récupération des statistiques",
            error: error.message,
        })
    }
}
