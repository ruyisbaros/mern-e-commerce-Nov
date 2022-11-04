const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      trim: true,
    },
    quantity: {
      type: Number,
      default: 0,
    },
    sold: {
      type: Number,
      default: 0,
    },
    checked: {
      type: Boolean,
      default: false,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    images: [{ type: mongoose.Schema.Types.ObjectId, ref: "Image" }],
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;