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
  },
  { timestamps: true }
);

module.exports = mongoose.model("Node", nodeSchema);
