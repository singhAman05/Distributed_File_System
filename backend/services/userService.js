const User = require("../models/user");

exports.getUserProfile = async (userId) => {
  try {
    const user = await User.findById(userId).select("-password");
    return user;
  } catch (error) {
    throw new Error("Error fetching user profile");
  }
};

exports.getRecentActions = async (userId) => {
  try {
    const user = await User.findById(userId).select("recentActions");
    return user.recentActions
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 10);
  } catch (error) {
    throw new Error("Error fetching recent actions");
  }
};

exports.getChartData = async (userId) => {
  try {
    // Fetch and prepare your chart data
    const chartData = {}; // Example placeholder, replace with actual data fetching logic
    return chartData;
  } catch (error) {
    throw new Error("Error fetching chart data");
  }
};

exports.getSystemStatus = async () => {
  try {
    const status = {
      connected: 5, // Example data
      total: 10,
    };
    return status;
  } catch (error) {
    throw new Error("Error fetching system status");
  }
};
