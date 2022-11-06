const router = require("express").Router();
const {
  getAProduct,
  getAllProducts,
  deleteAllProducts,
  createProduct,
  deleteProduct,
  updateProduct,
  getProductReviews,
} = require("../controllers/productController");
const { protect, restrictTo } = require("../middleWares/authMiddleWare");

router.get("/get_one/:id", getAProduct);
router.get("/get_reviews/:id", getProductReviews);
router.get("/get_all", getAllProducts);
router.post("/create", protect, restrictTo("Admin", "Co-host"), createProduct);
router.delete("/delete_one/:id", protect, restrictTo("Admin"), deleteProduct);
router.delete("/delete_all", protect, restrictTo("Admin"), deleteAllProducts);
router.patch(
  "/update/:id",
  protect,
  restrictTo("Admin", "Co-host"),
  updateProduct
);

module.exports = router;
