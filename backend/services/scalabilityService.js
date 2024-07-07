// services/scalabilityService.js (continued)
const Chunk = require("../models/chunk");
const loadBalancer = require("./loadBalancer");
const Node = require("../models/node");

async function addNode(nodeData) {
  // Validate node data (e.g., check if node with the same ID already exists)
  if (await Node.findOne({ id: nodeData.id })) {
    throw new Error("Node already exists");
  }

  // Add node to the load balancer
  loadBalancer.addNode(nodeData);

  // Optionally, save node info to the database
  const newNode = new Node(nodeData);
  await newNode.save();

  return newNode;
}

// Remove a node from the system
async function removeNode(nodeId) {
  try {
    // Remove node from the load balancer
    loadBalancer.removeNode(nodeId);

    // Remove node info from the database
    const deletedNode = await Node.findOneAndDelete({ id: nodeId });
    console.log(deletedNode);
    if (!deletedNode) {
      throw new Error("Node not found");
    }

    // Handle redistribution of chunks stored on the removed node
    await redistributeChunks(nodeId);

    return { message: `Node ${nodeId} removed successfully` };
  } catch (error) {
    console.error(`Error removing node ${nodeId}:`, error);
    throw new Error(`Failed to remove node: ${error.message}`);
  }
}

async function redistributeChunks(nodeId) {
  try {
    // Find chunks stored on the node to be removed
    const chunks = await Chunk.find({ nodeId });

    if (!chunks.length) {
      console.log(`No chunks found on node ${nodeId} for redistribution.`);
      return;
    }

    for (const chunk of chunks) {
      // Get a new node for each chunk
      const newNode = loadBalancer.getNextNode();
      console.log(`Redistributing chunk ${chunk._id} to node ${newNode.id}`);

      // Update the chunk with the new nodeId
      chunk.nodeId = newNode.id;
      await chunk.save();
    }

    console.log(`Chunks successfully redistributed from node ${nodeId}.`);
  } catch (error) {
    console.error(`Error redistributing chunks from node ${nodeId}:`, error);
  }
}

module.exports = {
  addNode,
  removeNode,
  redistributeChunks,
};
