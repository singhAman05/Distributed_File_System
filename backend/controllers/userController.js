const userService = require("../services/userService");

exports.getUserProfile = async (req, res) => {
  try {
    const user = await userService.getUserProfile(req.user._id);
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

exports.getRecentActions = async (req, res) => {
  try {
    const actions = await userService.getRecentActions(req.user._id);
    res.json(actions);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

exports.getChartData = async (req, res) => {
  try {
    const chartData = await userService.getChartData(req.user._id);
    res.json(chartData);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

exports.getSystemStatus = async (req, res) => {
  try {
    const status = await userService.getSystemStatus();
    res.json(status);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
