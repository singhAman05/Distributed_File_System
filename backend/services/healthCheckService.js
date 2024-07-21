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
      console.error(
        `Node ${node.id} is unhealthy. Marking node as unhealthy...`
      );
      try {
        await Node.findOneAndUpdate({ id: node.id }, { isHealthy: 0 });
        console.log(`Node ${node.id} marked as unhealthy.`);
        // Uncomment the following lines if you want to remove the node
        // await removeNode(node.id);
        // console.log(`Node ${node.id} removed and chunks redistributed.`);
      } catch (error) {
        console.error(`Failed to mark node ${node.id} as unhealthy:`, error);
      }
    } else {
      console.log(`Node ${node.id} is healthy. Marking node as healthy...`);
      try {
        await Node.findOneAndUpdate({ id: node.id }, { isHealthy: 1 });
        console.log(`Node ${node.id} marked as healthy.`);
      } catch (error) {
        console.error(`Failed to mark node ${node.id} as healthy:`, error);
      }
    }
  }
}

module.exports = { performHealthChecks };
