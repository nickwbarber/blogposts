require("dotenv").config();
const config = require("../utils/config");
const th = require("./test_helper");
const Blog = require("../models/blog");
const User = require("../models/user");
const mongoose = require("mongoose");
const { randomIntBetween } = require("../utils/misc");

beforeAll(async () => {
  await mongoose.connect(config.MONGODB_URI);
});

afterAll(async () => {
  await User.deleteMany({});
  await Blog.deleteMany({});
  await mongoose.connection.close();
});

describe("getDummyBlogWithoutUser", () => {
  it("produces correct structure", async () => {
    const blog = th.getDummyBlogWithoutUser();
    const structure = {
      title: "string",
      author: "string",
      url: "string",
      likes: "number",
    };
    th.expectToHaveProperties(blog, Object.keys(structure));
    th.expectPropertiesToBeDefined(blog, Object.keys(structure));
    th.expectPropertyTypesToBe(blog, structure);
  });

  it("produces different blogs each time", async () => {
    const blogA = th.getDummyBlogWithoutUser();
    const blogB = th.getDummyBlogWithoutUser();
    expect(blogA).not.toEqual(blogB);
  });
});

describe("getDummyUser", () => {
  it("produces correct structure", async () => {
    const dummyUser = th.getDummyUser();
    const structure = {
      username: "string",
      name: "string",
      passwordHash: "string",
    };

    th.expectToHaveProperties(dummyUser, Object.keys(structure));
    th.expectPropertiesToBeDefined(dummyUser, Object.keys(structure));
    th.expectPropertyTypesToBe(dummyUser, structure);
  });

  it("produces different users each time", async () => {
    const userA = th.getDummyUser();
    const userB = th.getDummyUser();
    expect(userA).not.toEqual(userB);
  });
});

describe("createDummyBlogs", () => {
  // depends on `createDummyUsers`
  it("works", async () => {
    await Blog.deleteMany({});
    await User.deleteMany({});

    await th.createDummyUsers(3);

    expect(await Blog.estimatedDocumentCount({})).toBe(0);
    expect(await User.estimatedDocumentCount({})).toBe(3);

    await th.createDummyBlogs(3);

    expect(await Blog.estimatedDocumentCount({})).toBe(3);
  });
});

describe("createDummyUsers", () => {
  // depends on getDummyUser
  it("works", async () => {
    await User.deleteMany({});
    expect(await User.estimatedDocumentCount({})).toBe(0);
    await th.createDummyUsers(3);
    expect(await User.estimatedDocumentCount({})).toBe(3);
  });
});

describe("getRandomUser", () => {
  it("does get a user", async () => {
    await User.deleteMany({});
    await th.createDummyUsers(3);
    const randomUser = await th.getRandomUser();
    const structure = {
      username: "string",
      name: "string",
      passwordHash: "string",
    };

    th.expectToHaveProperties(randomUser, Object.keys(structure));
    th.expectPropertiesToBeDefined(randomUser, Object.keys(structure));
    th.expectPropertyTypesToBe(randomUser, structure);
  });
});

describe("getDummyBlogWithUser", () => {
  it("produces correct structure", async () => {
    await Blog.deleteMany({});
    await User.deleteMany({});
    expect(await Blog.estimatedDocumentCount({})).toBe(0);
    expect(await User.estimatedDocumentCount({})).toBe(0);

    await th.createDummyUsers(3);
    expect(await User.estimatedDocumentCount({})).toBe(3);

    const blog = await th.getDummyBlogWithUser();

    const structure = {
      title: "string",
      author: "string",
      url: "string",
      likes: "number",
    };
    th.expectToHaveProperties(blog, Object.keys(structure));
    th.expectPropertiesToBeDefined(blog, Object.keys(structure));
    th.expectPropertyTypesToBe(blog, structure);
    expect(blog.user).toBeDefined();
  });

  it("produces different blogs each time", async () => {
    const blogA = await th.getDummyBlogWithUser();
    const blogB = await th.getDummyBlogWithUser();
    expect(blogA).not.toEqual(blogB);
  });
});

describe("setupTestDB", () => {
  it("works", async () => {
    const dbConfig = {
      numOfBlogs: randomIntBetween(1, 5),
      numOfUsers: randomIntBetween(1, 5),
    };

    await User.deleteMany({});
    await Blog.deleteMany({});
    expect(await Blog.estimatedDocumentCount({})).toBe(0);
    expect(await User.estimatedDocumentCount({})).toBe(0);

    await th.setupTestDB(dbConfig);
    expect(await Blog.estimatedDocumentCount({})).toBe(dbConfig.numOfBlogs);
    expect(await User.estimatedDocumentCount({})).toBe(dbConfig.numOfUsers);

    // make sure users are specified
    (await Blog.find({})).forEach(async (blog) => {
      expect(blog).toHaveProperty("user");
      expect(blog.user).not.toBeNull();
    });
  });
});
