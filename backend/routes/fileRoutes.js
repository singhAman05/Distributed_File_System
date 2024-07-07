// routes/fileRoutes.js
const express = require("express");
const router = express.Router();
const fileController = require("../controllers/fileController");
const authMiddleware = require("../middleware/auth");

router.post("/upload", authMiddleware, fileController.uploadFile);
router.get("/download/:id", authMiddleware, fileController.downloadFile);
router.get("/listFiles", authMiddleware, fileController.listFiles);
router.delete("/delete/:id", authMiddleware, fileController.deleteFile); // New route

module.exports = router;
