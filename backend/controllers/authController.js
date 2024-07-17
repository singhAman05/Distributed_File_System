// controllers/authController.js
const authService = require("../services/authService");
const Profile = require("../models/profile");

// Controller for user registration
exports.register = async (req, res) => {
  try {
    const { email, username, password } = req.body;

    // Register the user
    const { user, token } = await authService.registerUserService({
      username,
      password,
      email,
    });

    // Create a new profile for the user
    const profile = new Profile({
      user: user._id, // Link the profile to the user's ID
      dates: [
        {
          date: new Date(), // Initialize with today's date
          uploadCount: 0, // Start with zero upload count
          downloadCount: 0, // Start with zero download count
          recentActions: [], // Start with an empty actions array
        },
      ],
    });

    // Save the profile to the database
    await profile.save();

    res.status(201).json({ user, token });
  } catch (err) {
    if (err.message === "Username already taken") {
      res.status(400).json({ error: err.message });
    } else {
      res
        .status(500)
        .json({ error: "Error registering user", error_message: err });
    }
  }
};

// Controller for user login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await authService.authenticateUserService({
      email,
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

// Controller for password reset
exports.sendPasswordResetEmail = async (req, res) => {
  const { email } = req.body;

  try {
    await authService.sendPasswordResetEmailService(
      email,
      `${process.env.FRONTEND_URL}`
    );
    res.status(200).send({ message: "Recovery link sent to your email" });
  } catch (error) {
    if (error.message === "Email not found") {
      res.status(400).send({ message: "Email not found" });
    } else {
      res
        .status(500)
        .send({ message: "Internal Server error", error_message: error });
    }
  }
};

exports.verifyPasswordResetToken = async (req, res) => {
  const { token } = req.params;
  try {
    const userId = await authService.verifyPasswordResetTokenService(token);
    res.status(200).send({ message: "Token is valid", userId });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  const { userId, newPassword } = req.body;
  try {
    await authService.resetPasswordService(userId, newPassword);
    res.status(200).send({ message: "Password has been reset" });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};
