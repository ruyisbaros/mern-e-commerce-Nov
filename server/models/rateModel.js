const mongoose = require("mongoose");

const rateSchema = new mongoose.Schema(
  {
    rate_comment: {
      type: String,
      required: true,
      trim: true,
    },
    rate_value: {
      type: Number,
      required: true,
    },
    rater: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    rated: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
  },
  { timestamps: true }
);

const Rate = mongoose.model("Rate", rateSchema);

module.exports = Rate;
