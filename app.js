require("dotenv").config();

// external imports
const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
require("express-async-errors");

// internal imports
const config = require("./utils/config");
const blogRouter = require("./controllers/blogs");
const userRouter = require("./controllers/users");
const loginRouter = require("./controllers/login");
const logger = require("./utils/logger");
const middleware = require("./utils/middleware");

const app = express();

(async () => {
  try {
    await mongoose.connect(config.MONGODB_URI);
  } catch (err) {
    logger.error("Error connecting to MongoDB:", err.message);
  }
})();

app.use(cors());
app.use(express.json());
app.use(middleware.requestLogger);

app.use("/api/blogs", middleware.userExtractor, blogRouter);
app.use("/api/users", userRouter);
app.use("/api/login", loginRouter);

if (process.env.NODE_ENV === "test") {
  const testingRouter = require("./controllers/testing");
  app.use("/api/testing", testingRouter);
}

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
