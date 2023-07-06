const Blog = require("../models/blog");

const getDummyBlogWithoutUser = () => {
  return {
    title: `Test Blog ${Math.round(Math.random() * 1000)}`,
    author: `Test Author${Math.round(Math.random() * 1000)}`,
    url: `https://testurl.com/randomNumber=${Math.round(Math.random() * 1000)}`,
    likes: Math.round(Math.random() * 100),
  };
};

createDummyBlogs = async (n) => {
  for (let i = 0; i < n; i++) {
    Blog.create(getDummyBlogWithoutUser());
  }
};

module.exports = {
  getDummyBlogWithoutUser,
  createDummyBlogs,
};
