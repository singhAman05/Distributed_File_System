// services/authService.js
const User = require("../models/user");
const { generateToken } = require("../config/auth");
const crypto = require("crypto");
const { sendEmail } = require("./mailService");

// Register a new user
async function registerUserService({ username, password, email }) {
  // Check if email already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("Email already taken");
  }

  // Create and save new user
  const user = new User({ username, password, email });
  await user.save();

  // Generate a token for the user
  const token = generateToken({ id: user._id, username: user.username });

  return { user, token };
}

// Authenticate a user
async function authenticateUserService({ email, password }) {
  const user = await User.findOne({ email });
  // console.log(user);
  if (!user || !(await user.comparePassword(password))) {
    throw new Error("Invalid credentials");
  }

  const token = generateToken({ id: user._id, username: user.username });
  return { user, token };
}

async function sendPasswordResetEmailService(email, host) {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Email not found");
  }

  // Create a password reset token and expiry
  const token = crypto.randomBytes(20).toString("hex");
  user.resetPasswordToken = token;
  user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
  await user.save();

  // Send email
  const subject = "Password Reset";
  const text = `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
  Please click on the following link, or paste this into your browser to complete the process:\n\n
  ${host}/reset-password/${token}\n\n
  If you did not request this, please ignore this email and your password will remain unchanged.\n`;

  await sendEmail(user.email, subject, text);
}

async function verifyPasswordResetTokenService(token) {
  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    throw new Error("Password reset token is invalid or has expired");
  }

  return user._id;
}

async function resetPasswordService(userId, newPassword) {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  user.password = newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();
}
module.exports = {
  registerUserService,
  authenticateUserService,
  sendPasswordResetEmailService,
  verifyPasswordResetTokenService,
  resetPasswordService,
};
