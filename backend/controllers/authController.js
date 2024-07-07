// controllers/authController.js
const authService = require("../services/authService");

// Controller for user registration
exports.register = async (req, res) => {
  try {
    const { username, password } = req.body;
    const { user, token } = await authService.registerUser({
      username,
      password,
    });
    res.status(201).json({ user, token });
  } catch (err) {
    if (err.message === "Username already taken") {
      res.status(400).json({ error: err.message });
    } else {
      res.status(500).json({ error: "Error registering user" });
    }
  }
};

// Controller for user login
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const { user, token } = await authService.authenticateUser({
      username,
      password,
    });
    res.json({ user, token });
  } catch (err) {
    if (err.message === "Invalid credentials") {
      res.status(401).json({ error: err.message });
    } else {
      res.status(500).json({ error: "Error logging in" });
    }
  }
};
