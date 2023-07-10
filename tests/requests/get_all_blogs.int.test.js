require("dotenv").config();
const config = require("../../utils/config");
const supertest = require("supertest");
const mongoose = require("mongoose");
const app = require("../../app");
const User = require("../../models/user");
const Blog = require("../../models/blog");
const th = require("../../utils/test_helper");
const { randomIntBetween } = require("../../utils/misc");

const api = supertest(app);

beforeAll(async () => {
  await mongoose.connect(config.MONGODB_URI);
});

afterAll(async () => {
  User.deleteMany({});
  Blog.deleteMany({});
  mongoose.connection.close();
});

describe("GET /api/blogs", () => {
  let response;
  let body;

  beforeAll(async () => {
    await th.setupTestDB({
      numOfUsers: randomIntBetween(3, 5),
      numOfBlogs: randomIntBetween(5, 10),
    });
    response = await api.get("/api/blogs");
    body = response.body;
  });

  test("on success, returns status 200", () => {
    expect(response.status).toBe(200);
  });

  test("returns correct content-type", () => {
    expect(response.header["content-type"]).toMatch(/application\/json/);
  });

  describe("has all props correctly defined", () => {
    test("title", () => {
      body.forEach((blog) => {
        expect(typeof blog.title).toBe("string");
      });
    });

    test("author", () => {
      body.forEach((blog) => {
        expect(typeof blog.author).toBe("string");
      });
    });

    test("url", () => {
      body.forEach((blog) => {
        expect(typeof blog.url).toBe("string");
      });
    });

    test("likes", () => {
      body.forEach((blog) => {
        expect(typeof blog.likes).toBe("number");
      });
    });

    test("user", () => {
      body.forEach((blog) => {
        expect(blog.user).toHaveProperty("username");
        expect(blog.user).toHaveProperty("name");
        expect(blog.user).not.toHaveProperty("passwordHash");
      });
    });
  });
});
