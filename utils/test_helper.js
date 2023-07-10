const Blog = require("../models/blog");
const User = require("../models/user");

const getRandomUser = async () => {
  /** assumes there are already users in the db **/
  const numOfUsers = await User.estimatedDocumentCount({});
  if (numOfUsers === 0) {
    throw new Error("there must be users already in the database");
  }
  const user = (await User.find({}))[Math.floor(Math.random() * numOfUsers)];
  return user;
};

const getDummyBlogWithUser = async () => {
  const blog = getDummyBlogWithoutUser();
  const user = await getRandomUser();

  blog.user = user.id;

  return blog;
};

const getDummyBlogWithoutUser = () => {
  return {
    title: `Test Blog ${Math.round(Math.random() * 1000)}`,
    author: `Test Author ${Math.round(Math.random() * 1000)}`,
    url: `https://testurl.com/randomNumber=${Math.round(Math.random() * 1000)}`,
    likes: Math.round(Math.random() * 100),
  };
};

const createDummyUsers = async (n) => {
  const users = [];
  for (let i = 0; i < n; i++) {
    users.push(await User.create(getDummyUser()));
  }
  return users;
};

const createDummyBlogs = async (n, withUsers = false) => {
  const blogs = [];
  for (let i = 0; i < n; i++) {
    if (withUsers) {
      blogs.push(await Blog.create(await getDummyBlogWithUser()));
    } else {
      blogs.push(await Blog.create(getDummyBlogWithoutUser()));
    }
  }
  return blogs;
};

const createDummyBlogsWithUsers = async (n) => {
  return await createDummyBlogs(n, true);
};

const getDummyUser = () => {
  return {
    username: `TestUser${Math.round(Math.random() * 1000)}`,
    name: `TestName${Math.round(Math.random() * 1000)}`,
    passwordHash: `TestHash${Math.round(Math.random() * 1000)}`,
    blogs: [],
  };
};

const setupTestDB = async ({ numOfUsers, numOfBlogs, withUsers = false }) => {
  await Blog.deleteMany({});
  await User.deleteMany({});
  if (numOfUsers > 0) await createDummyUsers(numOfUsers);
  // Creating blogs must happend after creating users because they will get linked to the users
  if (numOfBlogs > 0) await createDummyBlogs(numOfBlogs, withUsers);
};

const withoutProps = (blog, props) => {
  const blogWithoutProps = { ...blog };
  props.forEach((prop) => {
    delete blogWithoutProps[prop];
  });
  return blogWithoutProps;
};

module.exports = {
  createDummyBlogs,
  createDummyBlogsWithUsers,
  createDummyUsers,
  getDummyBlogWithoutUser,
  getDummyBlogWithUser,
  getDummyUser,
  setupTestDB,
  withoutProps,
  getRandomUser,
};
