const { spawn } = require("child_process");
const axios = require("axios");

const numberOfNodes = 5; // Number of nodes to start
const basePort = 4000; // Starting port number
const mainServerUrl = "http://localhost:5000/api/nodes/v1/joining";

(async () => {
  for (let i = 0; i < numberOfNodes; i++) {
    const port = basePort + i;
    const nodeId = `node-${i + 1}`;
    const hostname = "localhost";
    const ipAddress = "127.0.0.1";

    // Spawn a new server process
    const serverProcess = spawn("node", ["nodeServerTemplate.js", port]);

    serverProcess.stdout.on("data", (data) => {
      console.log(`Server started on port ${port}: ${data}`);
    });

    serverProcess.stderr.on("data", (data) => {
      console.error(`Error starting server on port ${port}: ${data}`);
    });

    serverProcess.on("close", (code) => {
      console.log(`Server process exited with code ${code}`);
    });

    // Register the node with the main server
    try {
      // Delay to ensure the server process has time to start
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const response = await axios.post(mainServerUrl, {
        id: nodeId,
        hostname: hostname,
        ipAddress: ipAddress,
        port: port,
        isHealthy: true, // Initially mark the node as healthy
      });
      console.log(`Node ${nodeId} registered successfully:`, response.data);
    } catch (error) {
      console.error(`Error registering node ${nodeId}:`, error.message);
      break;
    }
  }
})();
