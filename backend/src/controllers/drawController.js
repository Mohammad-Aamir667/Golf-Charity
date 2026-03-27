const Draw = require("../models/Draw");
const Score = require("../models/Score");

const generateRandomNumbers = () => {
  const numbersSet = new Set();
  while (numbersSet.size < 5) {
    const randomNumber = Math.floor(Math.random() * 45) + 1;
    numbersSet.add(randomNumber);
  }
  return Array.from(numbersSet).sort((a, b) => a - b);
};

const runDrawAndPersist = async () => {
  const numbers = generateRandomNumbers();
  const scoreDocs = await Score.find({}).select("userId scores");

  const winners = scoreDocs
    .map((doc) => {
      const userNumbers = doc.scores.map((entry) => entry.value);
      const matchCount = userNumbers.filter((value) => numbers.includes(value)).length;

      return {
        userId: doc.userId,
        matchCount,
      };
    })
    .filter((winner) => [3, 4, 5].includes(winner.matchCount));

  const draw = await Draw.create({
    drawDate: new Date(),
    numbers,
    winners,
  });

  return draw;
};

const runDraw = async (req, res) => {
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

module.exports = { runDraw, runDrawAndPersist };
