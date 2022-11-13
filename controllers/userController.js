const User = require("../models/userModel");
const CartItem = require("../models/cartItemModel");
const Image = require("../models/imageModel");
const asyncHandler = require("express-async-handler");

/* Admin */

exposrts.getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password").populate("avatar");

  res.status(200).json(users);
});

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

exports.closeAccount = asyncHandler(async (req, res) => {
  const todelete = await User.findById(req.params.id);
  //1. delete user image from database and Cloud
  const image = await Image.findById(todelete.avatar);
  if (image) {
    await Image.findByIdAndDelete(image._id);
    cloudinary.v2.uploader.destroy(
      "mern-e-commerce/" + image.public_id,
      async (err, result) => {
        if (err) throw err;
      }
    );
  }
  //2. delete user cart item(s)
  const cartItems = await CartItem.find({ owner: todelete._id });
  cartItems.length > 0 &&
    cartItems.forEach(
      async (item) => await CartItem.findByIdAndDelete(item._id)
    );
  //3. delete user
  await User.findOneAndDelete(todelete._id);

  res.status(200).json({ message: "Account has been deleted permenantly!" });
});
