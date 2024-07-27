const mongoose = require("mongoose");
const { Schema } = mongoose;

const nodeSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      index: true, // Indexing for faster querying
    },
    hostname: {
      type: String,
      required: true,
      index: true, // Indexing for faster querying
    },
    ipAddress: {
      type: String,
      required: true,
    },
    port: {
      type: Number,
      required: true,
    },
    isHealthy: {
      type: Number,
      required: true,
      default: 1, // 1 means healthy, 0 means unhealthy
    },
    connectionString: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Node", nodeSchema);
