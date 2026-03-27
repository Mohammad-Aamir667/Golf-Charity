const express = require("express");
const { runDraw } = require("../controllers/drawController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/run", protect, runDraw);

module.exports = router;
