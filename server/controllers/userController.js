const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");

exports.getProfileInfo = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  if (!user)
    return res.status(500).json({ message: `No user exist with ${id} id` });

  res.status(200).json(user);
});

exports.getAnyUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id).select("-password");
  if (!user)
    return res.status(500).json({ message: `No user exist with ${id} id` });

  res.status(200).json(user);
});
