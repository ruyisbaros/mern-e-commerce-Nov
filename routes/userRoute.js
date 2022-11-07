const router = require("express").Router();
const {
  getProfileInfo,
  getAnyUser,
  getUserCartInfo,
} = require("../controllers/userController");
const { protect } = require("../middleWares/authMiddleWare");

router.get("/get_profile", protect, getProfileInfo);
router.get("/get_one/:id", protect, getAnyUser);
router.get("/get_cart/:id", protect, getUserCartInfo);

module.exports = router;
