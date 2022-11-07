const router = require("express").Router();
const { createRate, getUserRates } = require("../controllers/rateController");
const { protect } = require("../middleWares/authMiddleWare");
router.get("/get_users_all/:id", protect, getUserRates);
router.post("/create", protect, createRate);

module.exports = router;
