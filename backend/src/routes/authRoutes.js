const express = require("express");
const {
  signup,
  login,
  getProfile,
  logout,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/signup", signup);
router.post("/register", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/profile", protect, getProfile);

module.exports = router;
