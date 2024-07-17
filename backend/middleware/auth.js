// auth.js (middleware)
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { verifyToken } = require("../config/auth");

const authMiddleware = async (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  console.log(token);
  if (!token) {
    return res.status(401).send({ error: "No token provided." });
  }

  try {
    const decoded = await verifyToken(token);
    // console.log(decoded);
    const user = await User.findById(decoded.id);

    if (!user) {
      throw new Error();
    }
    // console.log(user);
    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    res.status(401).send({ error: "Invalid token. Please authenticate." });
  }
};

module.exports = authMiddleware;
