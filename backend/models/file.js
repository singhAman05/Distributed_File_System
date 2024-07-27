const mongoose = require("mongoose");
const { Schema } = mongoose;

const fileSchema = new Schema(
  {
    _id: {
      type: String, // Use String to store UUID
      required: true,
    },
    filename: {
      type: String,
      required: true,
      index: true, // Indexing for faster querying
    },
    size: {
      type: Number,
      required: true,
    },
    mimeType: {
      type: String,
      required: true,
    },
    chunks: [
      {
        chunkId: { type: String, required: true },
        nodeId: { type: String, required: true },
        replicaNodeId: { type: String, required: true },
      },
    ],
    uploaded_by: {
      type: mongoose.Schema.Types.ObjectId, // Reference to the user who uploaded the file
      ref: "User",
      required: true,
    },
    download_count: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("File", fileSchema);
