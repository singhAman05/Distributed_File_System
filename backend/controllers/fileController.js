// controllers/fileController.js

const File = require("../models/file");
const fileService = require("../services/fileService");

// controller for uploading file
exports.uploadFile = async (req, res) => {
  try {
    const { filename, mimeType, fileData } = req.body;
    const fileBuffer = Buffer.from(fileData, "base64");

    const fileMetadata = await fileService.uploadFile({
      filename,
      mimeType,
      fileBuffer,
    });

    res.status(201).json({
      message: "File uploaded successfully",
      file: fileMetadata,
    });
  } catch (err) {
    console.error("Error uploading file:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// controller for downloading file
exports.downloadFile = async (req, res) => {
  try {
    const fileId = req.params.id;
    const file = await fileService.downloadFile(fileId);

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${file.filename}`
    );
    res.setHeader("Content-Type", file.mimeType);
    res.send(file.fileBuffer);
  } catch (err) {
    console.error("Error downloading file:", err);
    res.status(500).json({ error: "Error downloading file" });
  }
};

// controller for listing file
exports.listFiles = async (req, res) => {
  try {
    const files = await File.find({});
    res.status(200).json(files);
  } catch (err) {
    console.error("Error listing files:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// controller for deleting file
exports.deleteFile = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await fileService.deleteFile(id);
    res.json(result);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: "Error deleting file" });
  }
};

exports.updateFileMetadata = async (req, res) => {
  try {
    const { id } = req.params;
    const { filename, mimeType } = req.body;

    // Find and update file metadata
    const updatedFile = await File.findByIdAndUpdate(
      id,
      { filename, mimeType },
      { new: true }
    );

    if (!updatedFile) {
      return res.status(404).json({ error: "File not found" });
    }

    res.status(200).json({
      message: "File metadata updated successfully",
      file: updatedFile,
    });
  } catch (err) {
    console.error("Error updating file metadata:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
