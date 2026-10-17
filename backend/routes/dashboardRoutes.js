const express = require("express");
const router = express.Router();
const requireAuth = require("../middleware/auth");
const { getStats, getAlerts } = require("../controllers/dashboardController");

// Both routes are protected — only a logged-in pastor can see their church's dashboard.
router.get("/stats", requireAuth, getStats);
router.get("/alerts", requireAuth, getAlerts);

module.exports = router;