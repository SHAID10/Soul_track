const express = require("express");
const router = express.Router();

const { getProfile, updateProfile } = require("../controllers/churchController");
const requireAuth = require("../middleware/auth");

//Both routes are protected

// GET /api/church/profile 
router.get("/profile", requireAuth, getProfile);

// PUT /api/church/profile
router.put("/profile", requireAuth, updateProfile);

module.exports = router;