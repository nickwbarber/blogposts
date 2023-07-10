const supertest = require("supertest");
const mongoose = require("mongoose");
const app = require("../../app");
const { setupTestDB } = require("../../utils/test_helper");
const api = supertest(app);
const Blog = require("../../models/blog");
const { randomIntBetween } = require("../../utils/misc");

const dbConfig = {
  numOfBlogs: randomIntBetween(4, 7),
  numOfUsers: randomIntBetween(3, 5),
};

afterAll(async () => {
  Blog.deleteMany({});
  mongoose.connection.close();
});

describe("deletion of a blog", () => {
  let blogsBefore;
  let blog;
  let response;
  let blogsAfter;

  beforeAll(async () => {
    await setupTestDB(dbConfig);
    blogsBefore = await Blog.find({});
    blog = await Blog.findOne({});
    response = await api.delete(`/api/blogs/delete/${blog.id}`);
    blogsAfter = await Blog.find({});
  });

  test("returns with code 204", async () => {
    expect(response.status).toBe(204);
  });

  test("shortens blog list length by one", () => {
    expect(blogsAfter.length).toBe(blogsBefore.length - 1);
  });

  test("new blog list does not contain the deleted blog", () => {
    expect(blogsAfter).not.toContainEqual(blog);
  });
});
