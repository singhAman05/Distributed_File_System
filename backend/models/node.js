const mongoose = require("mongoose");
const { Schema } = mongoose;

const nodeSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    hostname: {
      type: String,
      required: true,
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
