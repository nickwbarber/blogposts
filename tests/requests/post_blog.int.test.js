// TODO: rename foundBlog to something else
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

// TODO: move this somewhere more reasonable
const blogToRequestFormat = (blog) => {
  blog.userId = blog.user;
  delete blog.user;
  return blog;
};

describe("Submitting a blog", () => {
  describe("with all required information", () => {
    let response;
    let foundBlog;

    beforeAll(async () => {
      response = await api
        .post("/api/blogs")
        .send(
          blogToRequestFormat(
            withoutProps(await getDummyBlogWithUser(), ["likes"])
          )
        );

      foundBlog = response.body;
    });

    test("returns status 201", async () => {
      expect(response.status).toBe(201);
    });
    test("response returns in application-json format", async () => {
      expect(response.get("content-type")).toMatch(/application\/json/);
    });
    test("defaults missing likes to 0", async () => {
      expect(foundBlog.likes).toBe(0);
    });

    // TODO: test for user information
    // test("", async () => {})
    // test("contains information about submitting user", async () => {
    //   const response = await api
    //     .post("/api/blogs")
    //     .send(blogToRequestFormat(await getDummyBlogWithUser()));
    //   const foundBlog = response.body;
    //   expect(foundBlog.user).toBeDefined();
    // });
  });

  describe("without", () => {
    describe("title", () => {
      let response;
      beforeAll(async () => {
        response = await api
          .post("/api/blogs")
          .send(
            blogToRequestFormat(
              withoutProps(await getDummyBlogWithUser(), ["title"])
            )
          );
      });

      test("returns status 400", async () => {
        expect(response.status).toBe(400);
      });
    });

    describe("url", () => {
      let response;
      beforeAll(async () => {
        response = await api
          .post("/api/blogs")
          .send(
            blogToRequestFormat(
              withoutProps(await getDummyBlogWithUser(), ["url"])
            )
          );
      });

      test("returns status 400", async () => {
        expect(response.status).toBe(400);
      });
    });

    describe("user", () => {
      let response;
      beforeAll(async () => {
        response = await api
          .post("/api/blogs")
          .send(
            blogToRequestFormat(
              withoutProps(await getDummyBlogWithUser(), ["user"])
            )
          );
      });

      test("returns status 400", async () => {
        expect(response.status).toBe(400);
      });
    });
  });
});
