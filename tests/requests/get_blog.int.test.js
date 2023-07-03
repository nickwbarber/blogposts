// get_blog.int.test.js
//
// Desc: Test getting a specific blog by id

const supertest = require("supertest");
const mongoose = require("mongoose");
const app = require("../../app");
const Blog = require("../../models/blog");

const api = supertest(app);

const newBlog = {
  title: "Test Blog",
  author: "Test Author",
  url: `https://testurl.com/randomNumber=${Math.round(Math.random() * 1000)}`,
  likes: 0,
};

const tV = {
  blogToGet: undefined,
  blogsBefore: undefined,
  response: undefined,
  blogsAfter: undefined,
};

beforeAll(async () => {
  await Blog.deleteMany({});
  await Blog.create(newBlog);

  tV.blogToGet = await Blog.findOne({});
  tV.blogsBefore = await Blog.find({});
  tV.response = await api.get(`/api/blogs/id/${tV.blogToGet.id}`);
  tV.blogsAfter = await Blog.find({});
});

afterAll(async () => {
  mongoose.connection.close();
});

describe("Getting a blog by id", () => {
  test("returns with code 200", async () => {
    expect(tV.response.status).toBe(200);
  });

  test("does not alter blog list length", async () => {
    expect(tV.blogsAfter.length).toBe(tV.blogsBefore.length);
  });

  test("blog has the correct id", async () => {
    expect(tV.response.body.id).toEqual(tV.blogToGet.id);
  });
});
