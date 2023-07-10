const supertest = require("supertest");
const mongoose = require("mongoose");
const app = require("../../app");
const Blog = require("../../models/blog");
const User = require("../../models/user");
const { createDummyBlogs, setupTestDB } = require("../../utils/test_helper");
const { randomIntBetween } = require("../../utils/misc");

const api = supertest(app);

const dbConfig = {
  numOfBlogs: randomIntBetween(4, 7),
  numOfUsers: randomIntBetween(2, 4),
};

beforeAll(async () => {
  await setupTestDB(dbConfig);
});

afterAll(async () => {
  await Blog.deleteMany({});
  mongoose.connection.close();
});

describe("Pre-test check", () => {
  test("There are only 3 blogs in the list", async () => {
    const blogs = await Blog.find({});
    expect(blogs.length).toBe(dbConfig.numOfBlogs);
  });
});

describe("Getting a blog by id", () => {
  let blogId;
  let response;
  beforeAll(async () => {
    blogId = (await Blog.findOne({}))._id.toString();
    response = await api.get(`/api/blogs/id/${blogId}`);
  });

  test("returns with code 200", async () => {
    expect(response.status).toBe(200);
  });

  test("does not alter blog list length", async () => {
    expect((await Blog.find({})).length).toBe(dbConfig.numOfBlogs);
  });

  test("blog has the correct id", async () => {
    expect(response.body.id).toEqual(blogId);
  });
});
