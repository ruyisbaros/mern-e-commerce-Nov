const Rate = require("../models/rateModel");
const asyncHandler = require("express-async-handler");

exports.createRate = asyncHandler(async (req, res) => {
  const { rate_comment, rate_value, rater, rated } = req.body; //rater is review maker, rated is product
  const newRate = await Rate.create({
    rate_comment: rate_comment.toLowerCase(),
    rate_value: Number(rate_value),
    rater,
    rated,
  });
  res.status(201).json(newRate);
});
exports.getUserRates = asyncHandler(async (req, res) => {
  const rates = await Rate.find({ owner: req.params.id }).populate("rater");

  res.status(201).json(rates);
});
