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
    },
    fileId: {
      type: String, // Use String to store UUID
      required: true,
      ref: "File",
    },
    nodeId: {
      type: String, // Include nodeId to indicate which node stores the chunk
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Chunk", chunkSchema);
