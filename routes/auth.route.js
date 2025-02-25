const express = require("express")
const router = express.Router()
const authController = require("../controllers/auth.controller")
const { isAuthenticated, isNotAuthenticated } = require("../middlewares/auth.middleware")

// Public routes
router.post("/register", authController.register)
router.post("/login", authController.login)

// Protected routes
router.post("/logout", isAuthenticated, authController.logout)
router.get("/current-user", isAuthenticated, authController.getCurrentUser)

module.exports = router

