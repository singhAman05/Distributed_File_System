const jwt = require("jsonwebtoken");
const { verifyToken } = require("../config/auth");

function authMiddleware(req, res, next) {
  const token = req.headers["authorization"];
  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const decoded = verifyToken(token.split(" ")[1]); // Remove 'Bearer ' if token is prefixed
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
}

module.exports = authMiddleware;
