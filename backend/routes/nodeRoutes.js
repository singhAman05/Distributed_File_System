// routes/nodeRoutes.js
const express = require("express");
const router = express.Router();
const { addNode, removeNode } = require("../services/scalabilityService");

router.post("/joining", async (req, res) => {
  try {
    const connectionString = req.body.connectionString;
    const node = await addNode(connectionString);
    res.status(201).json(node);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/disconnecting/:id", async (req, res) => {
  try {
    const nodeId = req.params.id;
    const result = await removeNode(nodeId);
    console.log(`Node ${nodeId} successfully disconnected`);
    res.status(204).send();
  } catch (error) {
    console.error(`Error disconnecting node ${req.params.id}:`, error);
    res
      .status(500)
      .json({ error: `Failed to disconnect node: ${error.message}` });
  }
});

module.exports = router;
