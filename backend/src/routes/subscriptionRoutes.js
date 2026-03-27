const express = require("express");
const { activateSubscription } = require("../controllers/subscriptionController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/activate", protect, activateSubscription);

module.exports = router;
