const Blog = require("../models/blog");

const getDummyBlogWithoutUser = () => {
  return {
    title: `Test Blog ${Math.round(Math.random() * 1000)}`,
    author: `Test Author${Math.round(Math.random() * 1000)}`,
    url: `https://testurl.com/randomNumber=${Math.round(Math.random() * 1000)}`,
    likes: Math.round(Math.random() * 100),
  };
};

const createDummyBlogs = async (n) => {
  for (let i = 0; i < n; i++) {
    Blog.create(getDummyBlogWithoutUser());
  }
};

const getDummyUser = () => {
  return {
    username: `TestUser${Math.round(Math.random() * 1000)}`,
    name: `TestName${Math.round(Math.random() * 1000)}`,
    passwordHash: `TestHash${Math.round(Math.random() * 1000)}`,
    notes: [],
  };
};

module.exports = {
  createDummyBlogs,
  getDummyBlogWithoutUser,
  getDummyUser,
};
