const Category = require("../models/categoryModel");
const asyncHandler = require("express-async-handler");
const {
  imageDeleteHandler,
} = require("../utils/deleteImageFromDatabaseAndCloud");

exports.getAllCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find();
  res.status(200).json(categories);
});

exports.getOneCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const category = await Category.findById(id);

  if (!category)
    return res.status(404).json({
      message: `Requested Category is not exist with this ${id} ID !`,
    });

  res.status(201).json(category);
});

exports.createCategory = asyncHandler(async (req, res) => {
  const { name, description, cat_image } = req.body;
  const category = await Category.findOne({ name });
  if (category)
    return res
      .status(500)
      .json({ message: `With ${name} name category already exist!` });
  const newCategory = await Category.create({ name, description, cat_image });
  const returnedCategory = await Category.findById(newCategory._id).populate(
    "cat_image"
  );
  res.status(201).json(returnedCategory);
});

exports.deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const category = await Category.findById(id);

  if (!category)
    return res
      .status(500)
      .json({ message: `${id} number Category is not exist exist!` });
  //WE SHOULD DELETE CATEGORY IMAGE FROM DATABASE AND CLOUD. WE SHOULD BE AWAERE OF OUR SPACES !!!!
  imageDeleteHandler(category.cat_image, res);

  await Category.findByIdAndDelete(category._id);

  res.status(200).json({ message: "Category has been deleted" });
});
exports.updateCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, description, cat_image } = req.body;

  const category = await Category.findById(id);

  if (!category)
    return res
      .status(500)
      .json({ message: `${id} number Category is not exist exist!` });

  const updatedCat = await Category.findByIdAndUpdate(
    id,
    { name, description, cat_image },
    { new: true }
  );

  res.status(200).json(updatedCat);
});
