const express = require("express");
const { getScores, addScore } = require("../controllers/scoreController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, getScores);
router.post("/", protect, addScore);

module.exports = router;
