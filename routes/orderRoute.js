const router = require("express").Router();
const {
  getAllOrders,
  createOrder,
  getUserOrders,
  cancelOrder,
  cancelOrders,
  returnOrder,
  updateOrderStatus,
} = require("../controllers/orderController");
const { protect, restrictTo } = require("../middleWares/authMiddleWare");

router.get(
  "/all_orders",
  protect,
  restrictTo("Admin", "Co-host"),
  getAllOrders
);

router.patch(
  "/order_status/:id",
  protect,
  restrictTo("Admin", "Co-host"),
  updateOrderStatus
);
router.post("/create_order/:id", protect, createOrder);
router.get("/my_orders/:id", protect, getUserOrders);
router.delete("/cancel_order/:id", protect, cancelOrder);
router.post("/cancel_orders", protect, cancelOrders);
router.patch("/return_order/:id", protect, returnOrder);

module.exports = router;
