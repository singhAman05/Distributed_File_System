const Node = require("../models/node");

class LoadBalancer {
  constructor() {
    this.nodes = [];
    this.currentNodeIndex = 0;
    this.totalNodes = 0;
    this.initializeNodes();
  }

  async initializeNodes() {
    try {
      const allNodes = await Node.find();
      this.nodes = allNodes.filter((node) => node.isHealthy); // Assuming 'isHealthy' field
      this.totalNodes = allNodes.length;
      console.log(
        `Initialized Load Balancer with ${this.nodes.length} running nodes out of ${this.totalNodes} total nodes`
      );
    } catch (error) {
      console.error("Error initializing nodes:", error);
    }
  }

  async addNode(node) {
    this.totalNodes++;
    if (node.isHealthy) {
      this.nodes.push(node);
    }
    console.log(`Node added: ${node._id}`);
  }

  async removeNode(nodeId) {
    this.nodes = this.nodes.filter(
      (node) => node._id.toString() !== nodeId.toString()
    );
    this.totalNodes--;
    console.log(`Node removed from Load Balancer: ${nodeId}`);
  }

  getNextNode() {
    if (this.nodes.length === 0) {
      throw new Error("No available nodes");
    }
    const node = this.nodes[this.currentNodeIndex];
    this.currentNodeIndex = (this.currentNodeIndex + 1) % this.nodes.length;
    return node;
  }

  async getRunningNodesCount() {
    try {
      const allNodes = await Node.find();
      this.nodes = allNodes.filter((node) => node.isHealthy);
      return this.nodes.length;
    } catch (error) {
      console.error("Error fetching running nodes count:", error);
      return 0;
    }
  }
}

module.exports = new LoadBalancer();
