const mongoose = require("mongoose");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
/* const mongoosastic = require("mongoosastic"); */

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
      type: mongoose.Schema.Types.ObjectId,
      ref: "Image",
    },
    role: {
      type: Array,
      /* enum: ["Admin", "Co-host", "User"], */
      default: ["User"],
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      default: "Other",
    },
    cart: [{ type: mongoose.Schema.Types.ObjectId, ref: "CartItem" }],
    address: {
      street: {
        type: String,
        default: "",
      },
      zipCode: {
        type: Number,
        default: 0,
      },
      city: {
        type: String,
        default: "",
      },
      country: {
        type: String,
        default: "",
      },
    },
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
/* userSchema.plugin(mongoosastic, {
  host: "localhost",
  port: 9200,
}); */

/* User.createMapping((err, mapping) => {
  console.log("mapping created");
}); */
const User = mongoose.model("User", userSchema);

module.exports = User;
