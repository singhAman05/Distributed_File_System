const express = require("express");
const router = express.Router();
const fileController = require("../controllers/fileController");
const authMiddleware = require("../middleware/auth");
const requestSignal = require("../middleware/requestSignal");
const upload = require("../config/multerConfig");

// Middleware for handling file uploads with size limit
const handleFileUpload = (req, res, next) => {
  upload.single("file")(req, res, (err) => {
    if (err) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(413).json({
          message: "File size exceeds the maximum limit of 100MB",
        });
      }
      // An unknown error occurred when uploading
      return res.status(500).json({ message: "Internal Server Error" });
    }
    // Everything went fine
    next();
  });
};

// Route to upload a file
router.post(
  "/upload",
  authMiddleware, // Authenticate the user
  requestSignal, // Attach signal to the request
  handleFileUpload, // Then handle the file upload
  fileController.uploadFile // Finally, call the uploadFile controller
);
router.get("/download/:id", authMiddleware, fileController.downloadFile);
router.get("/listFiles", authMiddleware, fileController.listFiles);
router.delete("/delete/:id", authMiddleware, fileController.deleteFile); // New route
module.exports = router;
