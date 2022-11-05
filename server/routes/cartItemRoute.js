const router = require("express").Router();
const {
  createCartItem,
  deleteCartItem,
} = require("../controllers/cartItemController");
const { protect } = require("../middleWares/authMiddleWare");

router.post("/create", protect, createCartItem);
router.delete("/delete/:id", protect, deleteCartItem);

module.exports = router;
