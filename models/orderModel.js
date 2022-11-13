const mongoose = require("mongoose");

const orderModel = new mongoose.Schema(
  {
    value: Number,
    status: {
      type: String,
      enum: [
        "pending",
        "processing",
        "ontheway",
        "delivered",
        "cancelled",
        "returned",
      ],
      default: "pending",
    },
    explains: {
      //For cancellation || returned we will get this info from customer
      type: String,
      default: "OK",
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderModel);

module.exports = Order;
