const router = require("express").Router();
const {
  register,
  login,
  logout,
  generateRefreshToken,
} = require("../controllers/authController");

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/refresh_token", generateRefreshToken);

module.exports = router;
