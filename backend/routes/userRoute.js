const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const userController = require("../controllers/userController");

router.get("/me", authMiddleware, userController.getUserProfile);
router.get("/recentActions", authMiddleware, userController.getRecentActions);
router.get("/chartData", authMiddleware, userController.getChartData);
router.get("/system/status", authMiddleware, userController.getSystemStatus);

module.exports = router;
