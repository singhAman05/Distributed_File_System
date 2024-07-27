const mongoose = require("mongoose");
const { Schema } = mongoose;

const chunkSchema = new Schema(
  {
    data: {
      type: Buffer,
      required: true,
    },
    sequence: {
      type: Number,
      required: true,
      index: true,
    },
    fileId: {
      type: String,
      required: true,
      ref: "File",
    },
    nodeId: {
      type: String,
      required: true,
      index: true,
    },
    replicaNodeId: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Chunk", chunkSchema);
