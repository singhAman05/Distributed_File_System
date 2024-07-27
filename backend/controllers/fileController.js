// controllers/fileController.js

const File = require("../models/file");
const Profile = require("../models/profile");
const fileService = require("../services/fileService");

// controller for uploading file
exports.uploadFile = async (req, res) => {
  try {
    const { originalname, mimetype, buffer, size } = req.file;
    const userId = req.user._id; // Get the user ID from the authenticated user

    // Prepare the file data for the service
    const fileData = {
      filename: originalname,
      mimeType: mimetype,
      fileBuffer: buffer,
    };

    // Use the fileService to upload the file
    const fileMetadata = await fileService.uploadFile(
      fileData,
      userId,
      req.signal
    );

    // Update the user's profile with upload information
    const profile = await Profile.findOne({ user: userId });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    const today = new Date().toISOString().split("T")[0];
    let todayData = profile.dates.find(
      (data) => data.date.toISOString().split("T")[0] === today
    );

    if (todayData) {
      todayData.uploadCount += 1;
      todayData.recentActions.push({
        actionType: "upload",
        fileName: originalname,
        fileType: mimetype,
        size: size,
      });
    } else {
      todayData = {
        date: new Date(),
        uploadCount: 1,
        downloadCount: 0,
        recentActions: [
          {
            actionType: "upload",
            fileName: originalname,
            fileType: mimetype,
            size: size,
          },
        ],
      };
      profile.dates.push(todayData);
    }

    // Save the updated profile
    await profile.save();
    console.log("file saved successfully");
    res.status(200).json({
      message: "File uploaded successfully",
      fileMetadata,
    });
  } catch (error) {
    console.error("Error uploading file:", error.message);
    if (error.message === "Upload canceled") {
      res.status(499).json({ message: "Client closed request" });
    } else {
      res.status(500).json({ message: "Server error" });
    }
  }
};

// controller for downloading file
exports.downloadFile = async (req, res) => {
  try {
    const fileId = req.params.id;
    const file = await fileService.downloadFile(fileId);
    const userId = req.user._id;

    // Increment download count
    await File.findByIdAndUpdate(fileId, {
      $inc: { download_count: 1 },
    });

    const profile = await Profile.findOne({ user: userId });

    const today = new Date().toISOString().split("T")[0];
    const todayData = profile.dates.find(
      (data) => data.date.toISOString().split("T")[0] === today
    );

    // Calculate the file size in bytes
    const fileSize = file.fileBuffer.length;

    if (todayData) {
      todayData.downloadCount += 1;
      todayData.recentActions.push({
        actionType: "download",
        fileName: file.filename,
        fileType: file.mimeType,
        size: fileSize,
      });
    } else {
      profile.dates.push({
        date: new Date(),
        uploadCount: 0,
        downloadCount: 1,
        recentActions: [
          {
            actionType: "download",
            fileName: file.filename,
            fileType: file.mimeType,
            size: fileSize,
          },
        ],
      });
    }

    // Save the updated profile
    await profile.save();

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
    const files = await File.find()
      .populate("uploaded_by", "username")
      .sort({ createdAt: -1 }) // Sort by createdAt in descending order
      .limit(20); // Limit to 20 files
    res.status(200).json(files);
  } catch (error) {
    console.error("Error listing files:", error.message);
    res.status(500).json({ message: "Server error" });
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
