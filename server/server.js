require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
const fileUpload = require("express-fileupload");
const cookieParser = require("cookie-parser");

const app = express();

//Required Middle wares
app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(morgan("dev"));
app.use(
  fileUpload({
    useTempFiles: true,
  })
);

/* Import Routes */
const authRoutes = require("./routes/authRoute");
const userRoutes = require("./routes/userRoute");
const categoryRoutes = require("./routes/categoryRoute");
const imageRoutes = require("./routes/imageRoute");
const productRoutes = require("./routes/productRoute");
const cartItemRoutes = require("./routes/cartItemRoute");

/* Connect Database */
mongoose
  .connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((res) => {
    console.log("Database connection established");
  })
  .catch((err) => {
    console.log(err);
  });

/* Use Middle ware routes */
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/images", imageRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/carts", cartItemRoutes);

const port = process.env.PORT || 8080;

const server = app.listen(port, () => {
  console.log(`Server is running at port: ${port}...`);
});
