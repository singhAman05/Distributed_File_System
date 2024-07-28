const express = require("express");
const router = express.Router();
const File = require("../models/file"); // Adjust the path as necessary
const Fuse = require("fuse.js");

// Search files by filename with fuzzy search using fuse.js
router.get("/search-files", async (req, res) => {
  const { query } = req.query;
  if (!query) {
    return res.status(400).json({ error: "Query parameter is required" });
  }

  try {
    const files = await File.find({}); // Fetch all files
    const fuse = new Fuse(files, {
      keys: ["filename"],
      threshold: 0.3, // Adjust the threshold for fuzziness
    });
    const results = fuse.search(query);
    res.json(results.map((result) => result.item)); // Extract and send the matched items
  } catch (error) {
    console.error("Error searching files:", error);
    res.status(500).json({ error: "Error searching files" });
  }
});

module.exports = router;
