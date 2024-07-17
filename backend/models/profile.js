const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", unique: true },
  dates: [
    {
      date: { type: Date, default: Date.now },
      uploadCount: { type: Number, default: 0 },
      downloadCount: { type: Number, default: 0 },
      recentActions: [
        {
          actionType: { type: String },
          fileName: { type: String },
          fileType: { type: String },
          size: { type: Number },
        },
      ],
    },
  ],
});

const Profile = mongoose.model("Profile", profileSchema);

module.exports = Profile;
