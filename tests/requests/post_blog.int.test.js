const supertest = require("supertest");
const app = require("../../app");
const mongoose = require("mongoose");

const Blog = require("../../models/blog");

const api = supertest(app);

const newBlog = {
  title: "Test Blog",
  author: "Test Author",
  url: `https://testurl.com/randomNumber=${Math.round(Math.random() * 1000)}`,
  likes: 0,
};
Object.freeze(newBlog);

const withoutProps = (blog, props) => {
  const blogWithoutProps = { ...blog };
  props.forEach((prop) => {
    delete blogWithoutProps[prop];
  });
  return blogWithoutProps;
};

beforeEach(async () => {
  await Blog.deleteMany({});
});

afterAll(async () => {
  mongoose.connection.close();
});

describe("Submitting a blog", () => {
  test("if successful, returns with code 201", async () => {
    const response = await api.post("/api/blogs").send(newBlog);

    expect(response.status).toBe(201);
  });

  test("response returns in application-json format", async () => {
    const response = await api.post("/api/blogs").send(newBlog);

    expect(response.get("content-type")).toMatch(/application\/json/);
  });

  test("accepts missing likes", async () => {
    const response = await api
      .post("/api/blogs")
      .send(withoutProps(newBlog, ["likes"]));

    expect(response.body.likes).toBe(0);
  });

  test("rejects missing title", async () => {
    const response = await api
      .post("/api/blogs")
      .send(withoutProps(newBlog, ["title"]));

    expect(response.status).toBe(400);
  });

  test("rejects missing URL", async () => {
    const response = await api
      .post("/api/blogs")
      .send(withoutProps(newBlog, ["url"]));

    expect(response.status).toBe(400);
  });

  test("contains information about submitting user", async () => {
    const response = await api.post("/api/blogs").send(newBlog);

    expect(response.user.username).toBeDefined();
  });
});
