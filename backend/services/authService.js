// services/authService.js
const User = require("../models/user");
const { generateToken } = require("../config/auth");

// Register a new user
async function registerUser({ username, password }) {
  // Check if username already exists
  const existingUser = await User.findOne({ username });
  if (existingUser) {
    throw new Error("Username already taken");
  }

  // Create and save new user
  const user = new User({ username, password });
  await user.save();

  // Generate a token for the user
  const token = generateToken({ id: user._id, username: user.username });

  return { user, token };
}

// Authenticate a user
async function authenticateUser({ username, password }) {
  const user = await User.findOne({ username });
  if (!user || !(await user.comparePassword(password))) {
    throw new Error("Invalid credentials");
  }

  const token = generateToken({ id: user._id, username: user.username });
  return { user, token };
}

module.exports = {
  registerUser,
  authenticateUser,
};
