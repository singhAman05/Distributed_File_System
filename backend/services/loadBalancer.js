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
      this.nodes = allNodes.filter((node) => node.isHealthy);
      this.totalNodes = allNodes.length;
      console.log(
        `Initialized Load Balancer with ${this.nodes.length} running nodes out of ${this.totalNodes} total nodes`
      );
    } catch (error) {
      console.error("Error initializing nodes:", error);
    }
  }

  async addNode(node) {
    try {
      this.totalNodes++;
      if (node.isHealthy) {
        this.nodes.push(node);
      }
      console.log(`Node added: ${node.id}`);
    } catch (error) {
      console.error("Error adding node:", error);
    }
  }

  async removeNode(nodeId) {
    try {
      this.nodes = this.nodes.filter(
        (node) => node._id.toString() !== nodeId.toString()
      );
      this.totalNodes--;
      console.log(`Node removed from Load Balancer: ${nodeId}`);
    } catch (error) {
      console.error("Error removing node:", error);
    }
  }

  getNextNode() {
    if (this.nodes.length === 0) {
      throw new Error("No available nodes");
    }
    const node = this.nodes[this.currentNodeIndex];
    this.currentNodeIndex = (this.currentNodeIndex + 1) % this.nodes.length;
    console.log(node);
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

  // Regularly check the health of nodes in the background
  async healthCheckInterval() {
    try {
      const allNodes = await Node.find();
      this.nodes = allNodes.filter((node) => node.isHealthy);
      this.totalNodes = allNodes.length;
      console.log(
        `Health check completed. ${this.nodes.length} running nodes out of ${this.totalNodes} total nodes`
      );
    } catch (error) {
      console.error("Error during health check interval:", error);
    }
  }

  startHealthCheck(interval = 60000) {
    setInterval(() => this.healthCheckInterval(), interval);
  }

  async getNodeById(nodeId) {
    try {
      console.log(this.nodes);
      const node = this.nodes.find((node) => node.id.toString() === nodeId);
      if (!node) {
        throw new Error(`Node with ID ${nodeId} not found`);
      }
      return node;
    } catch (error) {
      console.error("Error getting node by ID:", error);
      throw error;
    }
  }
}

const loadBalancer = new LoadBalancer();
loadBalancer.startHealthCheck(); // Start health checks at a default interval of 60 seconds

module.exports = loadBalancer;
