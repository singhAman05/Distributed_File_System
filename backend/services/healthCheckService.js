// services/healthCheckService.js

const axios = require("axios");
const Node = require("../models/node");
const { removeNode } = require("./scalabilityService");

async function checkNodeHealth(node) {
  try {
    const response = await axios.get(
      `http://${node.hostname}:${node.port}/health`
    );
    console.log(response);
    return response.status === 200;
  } catch (error) {
    return false;
  }
}

async function performHealthChecks() {
  const nodes = await Node.find();
  for (const node of nodes) {
    const isHealthy = await checkNodeHealth(node);
    if (!isHealthy) {
      console.error(`Node ${node.id} is unhealthy. Removing node...`);
      //   try {
      //     // Remove the unhealthy node and redistribute chunks
      //     await removeNode(node.id);
      //     console.log(`Node ${node.id} removed and chunks redistributed.`);
      //   } catch (error) {
      //     console.error(`Failed to remove node ${node.id}:`, error);
      //   }
    } else {
      console.log(`Node ${node.id} is healthy.`);
    }
  }
}

module.exports = { performHealthChecks };
