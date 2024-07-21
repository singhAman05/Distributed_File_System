// routes/systemStatus.js
const express = require("express");
const router = express.Router();
const loadBalancer = require("../services/loadBalancer");

router.get("/system-status", async (req, res) => {
  const runningNodes = await loadBalancer.getRunningNodesCount();
  const totalNodes = loadBalancer.totalNodes;
  res.json({ totalNodes, runningNodes });
});

module.exports = router;
