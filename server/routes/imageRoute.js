const router = require("express").Router();
const { uploadImage, deleteImage } = require("../controllers/imageController");

router.post("/upload", uploadImage);
router.delete("/delete/:public_id", deleteImage);

module.exports = router;
