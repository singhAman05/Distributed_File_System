const mongoose = require("mongoose");
const Node = require("../models/node");
const { removeNode } = require("./scalabilityService");

// Function to check the health of a single node using the connection string
async function checkNodeHealth(node) {
  try {
    // Create a new temporary connection
    const tempConnection = await mongoose
      .createConnection(node.connectionString, {
        useNewUrlParser: true,
        serverSelectionTimeoutMS: 5000, // 5 seconds timeout for the connection
      })
      .asPromise();

    // Check if the connection is ready
    if (tempConnection.readyState === 1) {
      await tempConnection.close(); // Close the temporary connection
      return true;
    }

    return false;
  } catch (error) {
    return false;
  }
}

// Function to perform health checks on all nodes
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
        // Optionally remove the node and redistribute chunks
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
