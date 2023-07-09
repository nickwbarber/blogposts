require("dotenv").config();
const config = require("../../utils/config");
const supertest = require("supertest");
const app = require("../../app");
const mongoose = require("mongoose");

const Blog = require("../../models/blog");
const User = require("../../models/user");
const {
  setupTestDB,
  withoutProps,
  getDummyBlogWithUser,
} = require("../../utils/test_helper");
const { randomIntBetween } = require("../../utils/misc");

const api = supertest(app);

const dbConfig = {
  numOfUsers: randomIntBetween(3, 5),
  numOfBlogs: randomIntBetween(5, 10),
};

beforeAll(async () => {
  await mongoose.connect(config.MONGODB_URI);
  await Blog.deleteMany({});
  await User.deleteMany({});
  await setupTestDB(dbConfig);
});

afterAll(async () => {
  await Blog.deleteMany({});
  await User.deleteMany({});
  await mongoose.connection.close();
});

describe("Pre-test check", () => {
  test(`there are ${dbConfig.numOfUsers} users in the db`, async () => {
    const numOfUsers = await User.estimatedDocumentCount({});
    expect(numOfUsers).toBe(dbConfig.numOfUsers);
  });

  test(`there are ${dbConfig.numOfBlogs} blogs in the db`, async () => {
    const numOfBlogs = await Blog.estimatedDocumentCount({});
    expect(numOfBlogs).toBe(dbConfig.numOfBlogs);
  });
});

describe("Submitting a blog", () => {
  test("if successful, returns with code 201", async () => {
    const response = await api
      .post("/api/blogs")
      .send(await getDummyBlogWithUser());

    expect(response.status).toBe(201);
  });

  test("response returns in application-json format", async () => {
    const response = await api
      .post("/api/blogs")
      .send(await getDummyBlogWithUser());

    expect(response.get("content-type")).toMatch(/application\/json/);
  });

  test("accepts missing likes", async () => {
    const response = await api
      .post("/api/blogs")
      .send(withoutProps(await getDummyBlogWithUser(), ["likes"]));

    const foundBlog = response.body;

    expect(response.status).toBe(201);
    expect(foundBlog.likes).toBe(0);
  });

  test("rejects missing title", async () => {
    const response = await api
      .post("/api/blogs")
      .send(withoutProps(await getDummyBlogWithUser(), ["title"]));

    expect(response.status).toBe(400);
  });

  test("rejects missing URL", async () => {
    const response = await api
      .post("/api/blogs")
      .send(withoutProps(await getDummyBlogWithUser(), ["url"]));

    expect(response.status).toBe(400);
  });

  test("contains information about submitting user", async () => {
    const response = await api
      .post("/api/blogs")
      .send(await getDummyBlogWithUser());
    const foundBlog = response.body;

    expect(foundBlog.user).toBeDefined();
  });
});
