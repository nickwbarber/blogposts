const supertest = require("supertest");
const mongoose = require("mongoose");
const app = require("../../app");
const { setupTestDB, getDummyUser } = require("../../utils/test_helper");
const api = supertest(app);
const Blog = require("../../models/blog");
const User = require("../../models/user");
const { randomIntBetween, createTokenFor } = require("../../utils/misc");

const dbConfig = {
  numOfBlogs: randomIntBetween(4, 7),
  numOfUsers: randomIntBetween(3, 5),
};

afterAll(async () => {
  Blog.deleteMany({});
  User.deleteMany({});
  mongoose.connection.close();
});

describe("DELETE /api/blogs", () => {
  describe("with valid credentials", () => {
    let blogsBefore;
    let blog;
    let user;
    let response;
    let blogsAfter;

    beforeAll(async () => {
      await setupTestDB(dbConfig);

      blogsBefore = await Blog.find({});

      blog = await Blog.findOne({});
      user = await User.findById(blog.user.toString());

      response = await api
        .delete(`/api/blogs/delete/${blog._id.toString()}`)
        .set("authorization", `Bearer ${createTokenFor(user)}`);

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

  describe("without valid credentials", () => {
    let blogsBefore;
    let blog;
    let requestingUser;
    let response;
    let blogsAfter;

    beforeAll(async () => {
      await setupTestDB(dbConfig);

      blogsBefore = await Blog.find({});

      blog = await Blog.findOne({});
      requestingUser = await User.findById(blog.user.toString());
      const wrongUser = await User.create(getDummyUser());

      response = await api
        .delete(`/api/blogs/delete/${blog._id.toString()}`)
        .set("authorization", `Bearer ${createTokenFor(wrongUser)}`);

      blogsAfter = await Blog.find({});
    });

    test("returns with code 401", async () => {
      expect(response.status).toBe(401);
    });

    test("does not alter the blog list length", () => {
      expect(blogsAfter.length).toBe(blogsBefore.length);
    });

    test("new blog list contains the deleted blog", () => {
      expect(blogsAfter).toContainEqual(blog);
    });
  });
});
