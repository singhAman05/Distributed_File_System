// utils/parseConnectionString.js
const { URL } = require("url");
const crypto = require("crypto");

function parseConnectionString(connectionString) {
  const url = new URL(connectionString);

  const hostname = url.hostname;
  const ipAddress = "N/A"; // Atlas uses hostnames, not static IPs
  const port = url.port || 27017;

  // Generate a unique ID based on the hostname and port
  const id = crypto
    .createHash("md5")
    .update(`${hostname}:${port}`)
    .digest("hex");

  return {
    id,
    hostname,
    ipAddress,
    port,
    connectionString,
  };
}

module.exports = { parseConnectionString };
