const Profile = require("../models/profile");

exports.getProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const profile = await Profile.findOne({ user: userId });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.json(profile);
  } catch (error) {
    console.error("Error fetching profile", error);
    res.status(500).json({ message: "Server error" });
  }
};
