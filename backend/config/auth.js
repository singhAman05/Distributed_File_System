const jwt = require("jsonwebtoken");

function generateToken(user) {
  // Extract necessary fields for the token payload
  const payload = {
    id: user.id,
    username: user.username,
  };

  // Generate and return the token
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
}

function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      throw new Error("Token has expired");
    } else {
      throw new Error("Invalid token");
    }
  }
}

module.exports = {
  generateToken,
  verifyToken,
};
