const express = require("express")
const router = express.Router()
const adminController = require("../controllers/adminController")
const { verifyToken, verifyAdmin } = require("../middleware/authMiddleware")

// Route pour récupérer les statistiques (accessible uniquement par un admin)
router.get("/statistics", verifyToken, verifyAdmin, adminController.getStatistics)

module.exports = router
