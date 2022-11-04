const mongoose = require("mongoose");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: Object,
      default: {
        url: "https://png.pngtree.com/png-vector/20190223/ourmid/pngtree-vector-avatar-icon-png-image_695765.jpg",
        public_id: String,
      },
    },
    role: {
      type: Array,
      /* enum: ["Admin", "Co-host", "User"], */
      default: ["User"],
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
    },
    cart: [{ type: mongoose.Schema.Types.ObjectId, ref: "CartItem" }],
    resetPasswordToken: String,
    resetPasswordTime: Date,
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);

  next();
});

userSchema.methods.isPasswordTrue = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

//Create access token
userSchema.methods.createJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.ACCESS_TOKEN_KEY, {
    expiresIn: "2d",
  });
};

//Create refresh token
userSchema.methods.createReFreshToken = function () {
  return jwt.sign({ id: this._id }, process.env.REFRESH_TOKEN_KEY, {
    expiresIn: "7d",
  });
};

//Forgot password
userSchema.methods.createResetToken = function () {
  //generate crypto token
  const resetToken = crypto.randomBytes(20).toString("hex");
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  //console.log({ resetToken }, this.resetPasswordToken);
  this.resetPasswordTime = Date.now() + 15 * 60 * 1000; //15 minutes

  return resetToken;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
