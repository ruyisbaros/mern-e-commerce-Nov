const Product = require("../models/productModel");
const Rate = require("../models/rateModel");
const asyncHandler = require("express-async-handler");
const {
  imageDeleteHandler,
} = require("../utils/deleteImageFromDatabaseAndCloud");

//Filter sorting pagination Class

class APIfeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  /* filtering() {
    const queryObj = { ...this.queryString };
    const removedKeys = ["page", "sort", "limit"];
    removedKeys.forEach((key) => delete queryObj[key]);
    //console.log(queryStr);
    let queryStr = JSON.stringify(queryObj);
    //console.log(queryStr);
    queryStr = queryStr.replace(
      /\b(gte|gt|lt|lte|regex)\b/g,
      (match) => "$" + match
    );
    //console.log(queryStr);
    this.query.find(JSON.parse(queryStr));

    return this;
  } */

  sorting() {
    if (this.queryString.sort) {
      //console.log(this.queryString.sort);
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }

    return this;
  }

  paginating() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 20;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

exports.getAllProducts = asyncHandler(async (req, res) => {
  const features = new APIfeatures(Product.find(), req.query)
    /* .filtering() */
    .sorting()
    .paginating();
  const products = await features.query.populate("category images");

  res.status(200).json({ pageSize: products.length, products });
});

exports.getAllProductsSearched = asyncHandler(async (req, res) => {
  //console.log(req.query ? "var" : "yok");
  const { title } = req.query;
  //let products = await Product.find({}).populate({ path: "images" });
  //console.log(products);
  const products = await Product.aggregate([
    {
      $search: {
        autocomplete: {
          query: title,
          path: "title",
          fuzzy: {
            maxEdits: 2,
          },
        },
      },
    },
    {
      $limit: 5,
    },

    /* {
      $lookup: {
        from: "Product",
        localField: "Product.images",
        foreignField: "Image",
        as: "images",
      },
    }, */

    {
      $project: {
        _id: 1,
        title: 1,
      },
    },
  ]);
  //Patients.populate(result, {path: "patient"}, callback);
  /* const returned_products = Promise.all(
    products.map(
      async (product) =>
        await Product.findById(product._id).populate("category images")
    )
  ); */
  //console.log(products);
  res.status(200).json(products);
});

exports.getAProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id).populate("category images");

  if (!product)
    return res
      .status(400)
      .json({ message: `No Product found with ${id} ID number` });

  res.status(200).json(product);
});

exports.createProduct = asyncHandler(async (req, res) => {
  const { title, description, price, quantity, category, images } = req.body;

  const product = await Product.findOne({ title: title.toLowerCase() });
  if (product)
    return res.status(400).json({ message: `${title} is already used` });

  if (!images)
    return res.status(400).json({ message: "Please attach at least 1 image" });

  const createdProduct = await Product.create({
    title: title.toLowerCase(),
    description,
    price,
    quantity,
    category,
    images,
  });

  const fulledProduct = await Product.findById(createdProduct._id).populate(
    "category images"
  );

  res.status(201).json(fulledProduct);
});
exports.deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);

  if (!product)
    return res
      .status(400)
      .json({ message: `No Product found with ${id} ID number` });
  //DELETE PRODUCT IMAGES FROM DATABASE AND CLOUD
  product.images.forEach((pr) => {
    imageDeleteHandler(pr, res);
  });

  await Product.findByIdAndDelete(product._id);
  res.status(200).json({ message: "Product has been deleted successufully" });
});
exports.deleteAllProducts = asyncHandler(async (req, res) => {
  const products = await Product.find();

  products.forEach(async (product) => {
    //DELETE PRODUCT IMAGES FROM DATABASE AND CLOUD
    product.images.forEach((pr) => {
      imageDeleteHandler(pr, res);
    });
    await Product.findByIdAndDelete(product._id);
  });

  res
    .status(200)
    .json({ message: "All product have been deleted successufully" });
});
exports.updateProduct = asyncHandler(async (req, res) => {
  const { title, description, price, quantity, category, images } = req.body;

  if (!images)
    return res.status(400).json({ message: "Please attach at least 1 image" });

  const updatedProduct = await Product.findByIdAndUpdate(
    req.params.id,
    {
      title: title.toLowerCase(),
      description,
      price,
      quantity,
      category,
      images,
    },
    { new: true }
  ).populate("category images");

  res.status(201).json(updatedProduct);
});

/* RATINGs */

exports.getProductReviews = asyncHandler(async (req, res) => {
  const rates = await Rate.find({ rated: req.params.id }).populate("rater");

  res.status(200).json(rates);
});
