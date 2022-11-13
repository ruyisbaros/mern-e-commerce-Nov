const router = require("express").Router();
const {
  getProfileInfo,
  getAnyUser,
  getUserCartInfo,
  updateUserDetail,
  closeAccount,
} = require("../controllers/userController");
const { protect } = require("../middleWares/authMiddleWare");

router.get("/get_profile", protect, getProfileInfo);
router.get("/get_one/:id", protect, getAnyUser);
router.get("/get_cart/:id", protect, getUserCartInfo);
router.patch("/update_user/:id", protect, updateUserDetail);
router.delete("/delete_user/:id", protect, closeAccount);

module.exports = router;
