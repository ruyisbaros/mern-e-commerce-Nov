const Order = require("../models/orderModel");
const asyncHandler = require("express-async-handler");

exports.createOrder = asyncHandler(async (req, res) => {
  const { value, products } = req.body;

  const newOrder = await Order.create({
    owner: req.params.id,
    value,
    products,
  });

  const fulledOrder = await Order.findById(newOrder._id).populate({
    path: "products",
    populate: {
      path: "images",
    },
  });

  res.status(201).json(fulledOrder);
});
exports.getAllOrders = asyncHandler(async (req, res) => {
  const allOrders = await Order.find().populate({
    path: "owner",
    populate: {
      path: "products",
    },
  });

  res.status(201).json(allOrders);
});

exports.getUserOrders = asyncHandler(async (req, res) => {
  const myOrders = await Order.find({ owner: req.params.id }).populate({
    path: "products",
    populate: {
      path: "images",
    },
  });

  res.status(201).json(myOrders);
});

exports.cancelOrder = asyncHandler(async (req, res) => {
  await Order.findByIdAndDelete(req.params.id);

  res.status(201).json({ message: "Order has been cancelled" });
});

exports.cancelOrders = asyncHandler(async (req, res) => {
  const { orders } = req.body;
  orders.forEach(async (order) => {
    await Order.findByIdAndDelete(order._id);
  });

  res.status(201).json({ message: "Selected orders have been cancelled" });
});

exports.returnOrder = asyncHandler(async (req, res) => {
  await Order.findByIdAndUpdate(req.params.id, { status: "returned" });
});

exports.updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  await Order.findByIdAndUpdate(req.params.id, { status });
});
