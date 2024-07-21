// app.js
require("newrelic");
const express = require("express");
require("./scheduler");
const dotenv = require("dotenv");
const connectDB = require("./config/database");
const { httpLogger, errorLogger } = require("./config/logging");
const cors = require("cors");

// Load environment variables from .env file
dotenv.config();

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json()); // Body parser
app.use(cors()); // Enable CORS
app.use(httpLogger); // HTTP logging

// Routes
const fileRoutes = require("./routes/fileRoutes");
const authRoutes = require("./routes/authRoutes");
const nodeRoutes = require("./routes/nodeRoutes");
const userRoutes = require("./routes/userRoute");
const profileRoutes = require("./routes/profileRoutes");
const systemRoutes = require("./routes/systemRoutes");
const errorHandler = require("./utils/errorHandler");

app.use(errorHandler);
app.use("/api/files/v1", fileRoutes);
app.use("/api/auth/v1", authRoutes);
app.use("/api/user/v1", userRoutes);
app.use("/api/profile/v1", profileRoutes);
app.use("/api/nodes/v1", nodeRoutes);
app.use("/api/system/v1", systemRoutes);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
