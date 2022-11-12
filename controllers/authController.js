const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");

//Sign Up or Register
exports.register = asyncHandler(async (req, res) => {
  const { name, email, password, avatar, gender, address } = req.body;
  const { street, zipCode, city, country } = address;

  const uniqueCheck = await User.findOne({ email });
  if (uniqueCheck) {
    return res
      .status(401)
      .json({ message: `${email} emailId is already in Used` });
  }
  const registeredUser = await User.create({
    name,
    email,
    password,
    avatar,
    gender,
    address: { street, zipCode, city, country },
  });

  const accessToken = registeredUser.createJwtToken();
  const refreshToken = registeredUser.createReFreshToken();

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    path: "/api/v1/auth/refresh_token",
    maxAge: 7 * 24 * 60 * 60 * 1000, //7 days
  });

  const returnedUser = await User.findById(registeredUser._id)
    .populate("avatar")
    .select("-password");

  res.status(200).json({ returnedUser, accessToken });
});

//Login
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res
      .status(401)
      .json({ message: `No user exists with ${email} emailId!` });
  }
  const passowrdMatches = await user.isPasswordTrue(password);
  if (!passowrdMatches) {
    return res.status(401).json({ message: "Wrong credentials" });
  }
  const accessToken = user.createJwtToken();
  const refreshToken = user.createReFreshToken();

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    path: "/api/v1/auth/refresh_token",
    maxAge: 7 * 24 * 60 * 60 * 1000, //7 days
  });

  const returnedUser = await User.findById(user._id)
    .populate("avatar")
    .select("-password");

  res.status(200).json({ returnedUser, accessToken });
});

//Re Freshing Tokens
exports.generateRefreshToken = asyncHandler(async (req, res) => {
  const rf_token = req.cookies.refreshToken;
  //console.log(rf_token);
  if (!rf_token)
    return res.status(401).json({ message: "Please relogin or Register!" });

  const decoded = jwt.verify(rf_token, process.env.REFRESH_TOKEN_KEY);
  //console.log(decoded);
  if (!decoded)
    return res.status(401).json({ message: "Please login or register" });

  const current_user = await User.findById(decoded.id)
    .populate("avatar")
    .select("-password");
  //console.log(current_user);

  const accessToken = current_user.createJwtToken();
  res.status(200).json({ accessToken, current_user });
});

// Logout
exports.logout = asyncHandler(async (req, res) => {
  res.clearCookie("refreshToken", { path: "/api/v1/auth/refresh_token" });
  return res.status(200).json({ message: "You have been logged out!" });
});

exports.updatePassword = asyncHandler(async (req, res) => {
  const { current_password, new_password } = req.body;
  const user = await User.findById(req.params.id);

  const passowrdMatches = await user.isPasswordTrue(current_password);
  if (!passowrdMatches) {
    return res.status(401).json({ message: "Wrong credentials" });
  }

  const hashed_password = await bcrypt.hash(new_password, 10);

  await User.findByIdAndUpdate(user._id, { password: hashed_password });
  res.status(201).json({ message: "Password has been updated" });
});
