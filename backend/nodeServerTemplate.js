const express = require("express");
const app = express();
const port = process.argv[2] || 8080; // Use PORT from arguments or default to 8080

app.get("/health", (req, res) => {
  res.status(200).send("UP");
});

app.listen(port, () => {
  console.log(`Node server running on port ${port}`);
});
