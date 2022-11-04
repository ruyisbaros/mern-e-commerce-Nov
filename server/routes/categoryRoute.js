const router = require("express").Router();
const {
  getAllCategories,
  getOneCategory,
  createCategory,
  deleteCategory,
  updateCategory,
} = require("../controllers/categoryController");
const { protect, restrictTo } = require("../middleWares/authMiddleWare");

router.get("/all_cats", getAllCategories);
router.get("/get_one/:id", getOneCategory);
router.post("/create", protect, restrictTo("Admin", "Co-host"), createCategory);
router.delete("/delete/:id", protect, restrictTo("Admin"), deleteCategory);
router.patch(
  "/update/:id",
  protect,
  restrictTo("Admin", "Co-host"),
  updateCategory
);

module.exports = router;
