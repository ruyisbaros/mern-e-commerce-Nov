const router = require("express").Router();
const {
  register,
  login,
  logout,
  generateRefreshToken,
  updatePassword,
} = require("../controllers/authController");
const { protect } = require("../middleWares/authMiddleWare");

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.patch("/update_pwd/:id", protect, updatePassword);
router.get("/refresh_token", generateRefreshToken);

module.exports = router;
