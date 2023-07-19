require("dotenv").config();
const config = require("./utils/config");
const mongoose = require("mongoose");
const Blog = require("./models/blog");
const User = require("./models/user");
const { setupTestDB } = require("./utils/test_helper");

// connect to db
// determine what mode we are in based on the number of arguments
const MODE = process.argv[2];

const GET_MODE = "get";
const POPULATE_SAMPLE_MODE = "sample";

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
      console.log("getting info...");
      await getInfo(target);
      break;
    }
    case POPULATE_SAMPLE_MODE: {
      console.log("populating database with sample data...");
      await setupTestDB({ numOfBlogs: 10, numOfUsers: 5 });
      console.log(`users created: ${await User.estimatedDocumentCount({})}`);
      console.log(`blogs created: ${await Blog.estimatedDocumentCount({})}`);
      console.log("sample data populated");
      break;
    }
  }
  mongoose.connection.close();
};

main();
