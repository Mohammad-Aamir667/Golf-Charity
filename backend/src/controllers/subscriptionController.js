const Subscription = require("../models/Subscription");

const activateSubscription = async (req, res) => {
  try {
    const { planType } = req.body;

    if (!["monthly", "yearly"].includes(planType)) {
      return res
        .status(400)
        .json({ message: "planType must be either monthly or yearly" });
    }

    const startDate = new Date();
    const endDate = new Date(startDate);

    if (planType === "monthly") {
      endDate.setMonth(endDate.getMonth() + 1);
    } else {
      endDate.setFullYear(endDate.getFullYear() + 1);
    }

    const subscription = await Subscription.findOneAndUpdate(
      { userId: req.user._id },
      {
        userId: req.user._id,
        planType,
        status: "active",
        startDate,
        endDate,
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    return res.status(200).json({
      message: "Subscription activated successfully",
      subscription,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { activateSubscription };
