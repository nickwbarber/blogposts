require("dotenv").config();
const config = require("./utils/config");
const mongoose = require("mongoose");
const Blog = require("./models/blog");
const User = require("./models/user");

// connect to db
// determine what mode we are in based on the number of arguments
const GET_MODE = "get";
const MODE = process.argv[2];

// connect to the database
(async () => {
  try {
    await mongoose.connect(config.MONGODB_URI);
  } catch (err) {
    console.error("Error connecting to MongoDB:", err.message);
  }
})();

const getInfo = async (target) => {
  if (target === "blogs" || target === "all") {
    const blogs = await Blog.find({});
    console.log("blogs:", blogs);
  }
  if (target === "users" || target === "all") {
    const users = await User.find({});
    console.log("users:", users);
  }
};

const main = async () => {
  switch (MODE) {
    case GET_MODE: {
      const target = process.argv[3];
      await getInfo(target);
      break;
    }
  }
  mongoose.connection.close();
};

main();
