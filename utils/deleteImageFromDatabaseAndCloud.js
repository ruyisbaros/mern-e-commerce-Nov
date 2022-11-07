const cloudinary = require("cloudinary");
const Image = require("../models/imageModel");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

exports.imageDeleteHandler = async (id, res) => {
  const image = await Image.findById(id);
  if (!image)
    return res.status(400).json({ message: `No image found with ${id}  ID` });
  await Image.findByIdAndDelete(image._id);
  cloudinary.v2.uploader.destroy(
    "mern-e-commerce/" + image.public_id,
    async (err, result) => {
      if (err) throw err;
    }
  );
};
