const mongoose = require("mongoose");
const { Schema } = mongoose;

const fileSchema = new Schema(
  {
    _id: {
      type: String, // Change from ObjectId to String to store UUID
      required: true,
    },
    filename: {
      type: String,
      required: true,
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
        type: mongoose.Schema.Types.ObjectId, // Referencing chunks by ObjectId
        ref: "Chunk",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("File", fileSchema);
