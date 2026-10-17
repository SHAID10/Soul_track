const express = require("express");
const router = express.Router();

const { signup, login, me } = require("../controllers/authController");
const requireAuth = require("../middleware/auth");

// PUBLIC ROUTES

// POST /api/auth/signup
router.post("/signup", signup);

// POST /api/auth/login
router.post("/login", login);

// PROTECTED ROUTES

// Get /api/auth/me
router.get("/me", requireAuth, me);

module.exports = router;