const asyncHandler = require("express-async-handler");
const cloudinary = require("cloudinary");
const Image = require("../models/imageModel");

const fs = require("fs");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const removeTmp = (path) => {
  fs.unlink(path, (err) => {
    if (err) throw err;
  });
};

exports.uploadImage = asyncHandler(async (req, res) => {
  //const images = [...req.files]
  if (!req.files || Object.keys(req.files).length === 0)
    return res.status(500).json({ message: "Please attach a file" });

  const { file } = req.files;
  //console.log(file);
  if (file.size > 1024 * 1024) {
    //1024 * 1024=1mb
    removeTmp(file.tempFilePath);
    return res
      .status(500)
      .json({ message: "Your file is too large (max 1mb allowed)" });
  }
  if (file.mimetype !== "image/jpeg" && file.mimetype !== "image/png") {
    removeTmp(file.tempFilePath);
    return res
      .status(500)
      .json({ message: "Opps! Only jpeg or png types are allowed" });
  }

  cloudinary.v2.uploader.upload(
    file.tempFilePath,
    { folder: "mern-e-commerce" },
    async (err, result) => {
      if (err) throw err;
      removeTmp(file.tempFilePath);
      const newImage = await Image.create({
        public_id: result.public_id.split("/")[1],
        url: result.secure_url,
      });
      res.status(201).json(newImage);
    }
  );
});

exports.deleteImage = asyncHandler(async (req, res) => {
  const { public_id } = req.params;
  if (!public_id) {
    return res.status(500).json({ message: "No Id payload found!" });
  }
  //Delete from database
  const image = await Image.findOne({ public_id });
  if (!image)
    return res
      .status(400)
      .json({ message: `No image found with ${public_id}  ID` });
  await Image.findByIdAndDelete(image._id);
  cloudinary.v2.uploader.destroy(
    "mern-e-commerce/" + public_id,
    async (err, result) => {
      if (err) throw err;

      res.status(200).json({ message: "Image deleted successfully" });
    }
  );
});

/* exports.deleteImagesOfProduct = asyncHandler(async (req, res) => {
    const { productId } = req.params
    const targetProduct = await Products.findById(productId)

    targetProduct.images.forEach(obj => (
        cloudinary.v2.uploader.destroy(obj.public_id, (err, result) => {
            if (err) throw err;

        })
    ))
    res.status(200).json({ message: "Image deleted successfully" })

}) */
