const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema(
  {
    quantity: {
      type: Number,
      default: 0,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
  },
  { timestamps: true }
);

const CartItem = mongoose.model("CartItem", cartItemSchema);

module.exports = CartItem;
