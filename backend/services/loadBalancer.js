const Node = require("../models/node");

class LoadBalancer {
  constructor() {
    this.nodes = [];
    this.currentNodeIndex = 0;
    this.initializeNodes();
  }

  async initializeNodes() {
    try {
      this.nodes = await Node.find();
      console.log(`Initialized Load Balancer with ${this.nodes.length} nodes`);
    } catch (error) {
      console.error("Error initializing nodes:", error);
    }
  }

  // Add a new node
  async addNode(node) {
    this.nodes.push(node);
    console.log(`Node added: ${node.id}`);
  }

  // Remove a node
  async removeNode(nodeId) {
    this.nodes = this.nodes.filter((node) => node.id !== nodeId);
    console.log(`Node removed from Load Balancer: ${nodeId}`);
  }

  // Get the next node (Round Robin)
  getNextNode() {
    if (this.nodes.length === 0) {
      throw new Error("No available nodes");
    }
    const node = this.nodes[this.currentNodeIndex];
    this.currentNodeIndex = (this.currentNodeIndex + 1) % this.nodes.length;
    return node;
  }
}

module.exports = new LoadBalancer();
