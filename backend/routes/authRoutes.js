const express = require("express");
const authController = require("../controllers/authController");

const router = express.Router();

// Login route
router.post("/login", authController.login);

// Registration route
router.post("/register", authController.register);

router.post("/forgot-password", authController.sendPasswordResetEmail);
router.get(
  "/verify-password-reset/:token",
  authController.verifyPasswordResetToken
);
router.post("/reset-password", authController.resetPassword);

module.exports = router;
