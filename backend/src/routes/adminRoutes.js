const express = require("express");
const {
  getAllUsers,
  runDrawAdmin,
  getDrawResults,
} = require("../controllers/adminController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/users", protect, adminOnly, getAllUsers);
router.post("/draw/run", protect, adminOnly, runDrawAdmin);
router.get("/draw/results", protect, adminOnly, getDrawResults);

module.exports = router;
