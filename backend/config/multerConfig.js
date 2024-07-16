// backend/config/multerConfig.js
const multer = require("multer");

const storage = multer.memoryStorage(); // Store files in memory as Buffer

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 100 }, // Limit file size to 100MB
});

module.exports = upload;
