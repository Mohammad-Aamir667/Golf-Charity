const User = require("../models/User");
const Draw = require("../models/Draw");
const { runDrawAndPersist } = require("./drawController");

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-password");
    return res.status(200).json({ users });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

const runDrawAdmin = async (req, res) => {
  try {
    const draw = await runDrawAndPersist();
    return res.status(201).json({
      message: "Draw completed successfully",
      draw,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getDrawResults = async (req, res) => {
  try {
    const draws = await Draw.find({})
      .sort({ drawDate: -1 })
      .populate("winners.userId", "name email role");

    return res.status(200).json({ draws });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { getAllUsers, runDrawAdmin, getDrawResults };
