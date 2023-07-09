const supertest = require("supertest");
const mongoose = require("mongoose");
const app = require("../../app");
const Blog = require("../../models/blog");
const { setupTestDB } = require("../../utils/test_helper");

const api = supertest(app);

afterAll(async () => {
  Blog.deleteMany({});
  mongoose.connection.close();
});

describe("Updating the author of a blog", () => {
  const TEST_NUM_OF_LIKES = Math.floor(Math.random() * 10000);
  const TEST_TITLE = `title-${Math.floor(Math.random() * 10000)}`;
  const TEST_AUTHOR = `author-${Math.floor(Math.random() * 10000)}`;
  const TEST_URL = `url-${Math.floor(Math.random() * 10000)}`;

  let blogsBefore;
  let blogToUpdate;
  let responseOnUpdate;
  let blogsAfter;
  let blogAfterUpdate;

  beforeAll(async () => {
    await setupTestDB({ numOfBlogs: 3, numOfUsers: 0 });
    blogsBefore = await Blog.find({});
    blogToUpdate = await Blog.findOne({});
    console.log(blogToUpdate);
    responseOnUpdate = await api
      .put(`/api/blogs/${blogToUpdate._id.toString()}`)
      .send({
        title: TEST_TITLE,
        author: TEST_AUTHOR,
        likes: TEST_NUM_OF_LIKES,
        url: TEST_URL,
      });
    blogsAfter = await Blog.find({});
    blogAfterUpdate = await Blog.findOne({ _id: blogToUpdate._id });
  });

  test("when sucessful, returns with code 200", async () => {
    expect(responseOnUpdate.status).toBe(200);
  });

  test("does not change the length of blog list", () => {
    expect(blogsAfter.length).toBe(blogsBefore.length);
  });

  test("blog after update contains the right author", () => {
    expect(blogAfterUpdate.author).toBe(TEST_AUTHOR);
  });

  test("blog after update contains the right title", () => {
    expect(blogAfterUpdate.title).toBe(TEST_TITLE);
  });

  test("blog after update contains the right url", () => {
    expect(blogAfterUpdate.url).toBe(TEST_URL);
  });

  test("blog after update contains the right number of likes", () => {
    expect(blogAfterUpdate.likes).toBe(TEST_NUM_OF_LIKES);
  });
});
