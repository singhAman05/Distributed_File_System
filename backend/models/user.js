const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  resetPasswordToken: { type: String }, // Added for password reset functionality
  resetPasswordExpires: { type: Date }, // Added for password reset functionality
  recentActions: [
    {
      actionType: { type: String, required: true }, // 'upload' or 'download'
      fileId: { type: mongoose.Schema.Types.ObjectId, ref: "File" },
      timestamp: { type: Date, default: Date.now },
    },
  ],
});

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
