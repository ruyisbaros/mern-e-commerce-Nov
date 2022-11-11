const mongoose = require("mongoose");
/* const mongoosastic = require("mongoosastic"); */

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

/* productSchema.plugin(mongoosastic, {
  host: "localhost",
  port: 9200,
}); */

const Product = mongoose.model("Product", productSchema);

/* Product.createMapping((err, mapping) => {
  console.log("mapping created");
}); */

module.exports = Product;
