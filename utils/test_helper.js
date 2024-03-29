const Blog = require("../models/blog");
const User = require("../models/user");
const bcrypt = require("bcrypt");

/** Returns a random user from the database */
const getRandomUser = async () => {
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
    users.push(await User.create(await getDummyUser()));
  }
  return users;
};

const createDummyBlogs = async (n, withUsers = true) => {
  const blogs = [];
  for (let i = 0; i < n; i++) {
    if (withUsers) {
      const blog = await getDummyBlogWithUser();
      const createdBlog = await Blog.create(blog);
      blogs.push(createdBlog);
      const user = await User.findById(createdBlog.user);
      user.blogs.push(createdBlog.id);
      await user.save();
    } else {
      blogs.push(await Blog.create(getDummyBlogWithoutUser()));
    }
  }
  return blogs;
};

const createDummyBlogsWithUsers = async (n) => {
  return await createDummyBlogs(n, true);
};

/** Returns an Object that mimics the User structure that hasn't been entered into the database yet */
const getDummyUser = async (password = "") => {
  const user = {
    username: `TestUser${Math.round(Math.random() * 1000)}`,
    name: `TestName${Math.round(Math.random() * 1000)}`,
    passwordHash: password
      ? await bcrypt.hash(password, 10)
      : await bcrypt.hash(
          `testpassword-${Math.floor(Math.random() * 1000)}`,
          10
        ),
    blogs: [],
  };
  return user;
};

const setupTestDB = async ({ numOfUsers, numOfBlogs, withUsers = true }) => {
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

const expectToHaveProperties = (thing, properties) => {
  properties.forEach((property) => {
    expect(thing).toHaveProperty(property);
  });
};

const expectPropertiesToBeDefined = (thing, properties) => {
  properties.forEach((property) => {
    expect(thing[property]).toBeDefined();
  });
};

const expectPropertyTypesToBe = (thing, propertyTypes) => {
  Object.entries(propertyTypes).forEach(([property, type]) => {
    expect(typeof thing[property]).toBe(type);
  });
};

module.exports = {
  expectToHaveProperties,
  expectPropertyTypesToBe,
  expectPropertiesToBeDefined,
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
