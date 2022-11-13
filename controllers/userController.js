const User = require("../models/userModel");
const CartItem = require("../models/cartItemModel");
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

/* populate({
            path: "comments",
            populate: {
                path: "owner likes",
                select: "-password"
            } */

exports.getUserCartInfo = asyncHandler(async (req, res) => {
  const cartItems = await CartItem.find({ owner: req.params.id })
    .populate("owner")
    .populate({
      path: "product",
      populate: {
        path: "images",
      },
    });

  res.status(201).json(cartItems);
});

exports.updateUserDetail = asyncHandler(async (req, res) => {
  const { street, zipCode, city, country, gender, avatar } = req.body;

  await User.findByIdAndUpdate(
    req.params.id,
    {
      address: {
        street,
        zipCode: Number(zipCode),
        city,
        country,
      },
      gender,
      avatar,
    },
    { new: true }
  );

  res.status(200).json({ message: "Your profile updated successufully" });
});
