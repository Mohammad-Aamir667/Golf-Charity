const mongoose = require("mongoose");

const winnerSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    matchCount: {
      type: Number,
      required: true,
      min: 0,
      max: 5,
    },
  },
  { _id: false }
);

const drawSchema = new mongoose.Schema(
  {
    drawDate: {
      type: Date,
      required: true,
    },
    numbers: {
      type: [Number],
      required: true,
      validate: {
        validator: function validateNumbersLength(values) {
          return Array.isArray(values) && values.length === 5;
        },
        message: "Numbers array must contain exactly 5 numbers",
      },
    },
    winners: {
      type: [winnerSchema],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Draw", drawSchema);
