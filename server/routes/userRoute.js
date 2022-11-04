const router = require("express").Router();
const { getProfileInfo, getAnyUser } = require("../controllers/userController");
const { protect } = require("../middleWares/authMiddleWare");

router.get("/get_profile", protect, getProfileInfo);
router.get("/get_one/:id", protect, getAnyUser);

module.exports = router;
