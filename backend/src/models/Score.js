const mongoose = require("mongoose");

const scoreEntrySchema = new mongoose.Schema(
  {
    value: {
      type: Number,
      required: true,
      min: 1,
      max: 45,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const scoreSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    scores: {
      type: [scoreEntrySchema],
      default: [],
      validate: {
        validator: function validateScoresLength(entries) {
          return entries.length <= 5;
        },
        message: "Scores array can contain at most 5 entries",
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Score", scoreSchema);
