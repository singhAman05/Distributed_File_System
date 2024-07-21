// scheduler.js
const cron = require("node-cron");
const { performHealthChecks } = require("./services/healthCheckService");

// Schedule health checks every minute
cron.schedule("* * * * *", () => {
  console.log("Running health checks...");
  // performHealthChecks();
});
