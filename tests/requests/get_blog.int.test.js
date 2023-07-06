// get_blog.int.test.js
//
// Desc: Test getting a specific blog by id

const supertest = require("supertest");
const mongoose = require("mongoose");
const app = require("../../app");
const Blog = require("../../models/blog");
const { createDummyBlogs } = require("../../utils/test_helper");

const api = supertest(app);

beforeAll(async () => {
  await Blog.deleteMany({});
  await createDummyBlogs(3);
});

afterAll(async () => {
  await Blog.deleteMany({});
  mongoose.connection.close();
});

describe("Pre-test check", () => {
  test("There are only 3 blogs in the list", async () => {
    const blogs = await Blog.find({});
    expect(blogs.length).toBe(3);
  });
});

describe("Getting a blog by id", () => {
  test("returns with code 200", async () => {
    const blogId = (await Blog.findOne({}))._id.toString();
    const response = await api.get(`/api/blogs/id/${blogId}`);
    expect(response.status).toBe(200);
  });

  test("does not alter blog list length", async () => {
    expect((await Blog.find({})).length).toBe(3);
  });

  test("blog has the correct id", async () => {
    const blogId = (await Blog.findOne({}))._id.toString();
    const response = await api.get(`/api/blogs/id/${blogId}`);
    expect(response.body.id).toEqual(blogId);
  });
});
