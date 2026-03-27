const Score = require("../models/Score");

const getScores = async (req, res) => {
  try {
    const scoreDoc = await Score.findOne({ userId: req.user._id });

    return res.status(200).json({
      scores: scoreDoc ? scoreDoc.scores : [],
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

const addScore = async (req, res) => {
  try {
    const { value, date } = req.body;

    if (typeof value !== "number" || value < 1 || value > 45) {
      return res
        .status(400)
        .json({ message: "Score value must be a number between 1 and 45" });
    }

    let scoreDoc = await Score.findOne({ userId: req.user._id });

    if (!scoreDoc) {
      scoreDoc = await Score.create({
        userId: req.user._id,
        scores: [],
      });
    }

    scoreDoc.scores.push({
      value,
      date: date ? new Date(date) : new Date(),
    });

    if (scoreDoc.scores.length > 5) {
      scoreDoc.scores = scoreDoc.scores.slice(-5);
    }

    await scoreDoc.save();

    return res.status(200).json({
      message: "Score added successfully",
      scores: scoreDoc.scores,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { getScores, addScore };
