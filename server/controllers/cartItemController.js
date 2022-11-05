const CartItem = require("../models/cartItemModel");
const asyncHandler = require("express-async-handler");

exports.createCartItem = asyncHandler(async (req, res) => {
  const { quantity, owner, product } = req.body;

  const newCart = await CartItem.create({ quantity, owner, product });

  res.status(201).json(newCart);
});
exports.deleteCartItem = asyncHandler(async (req, res) => {
  await CartItem.findByIdAndDelete(req.params.id);

  res.status(200).json({ message: "Cart item has been removed!" });
});
