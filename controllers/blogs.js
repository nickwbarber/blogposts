const blogRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");
const { setupTestDB } = require("../utils/test_helper");

blogRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });
  response.json(blogs);
});

blogRouter.get("/id/:id", async (request, response) => {
  const blog = await Blog.findById(request.params.id);
  if (!(blog instanceof Blog)) {
    response.status(404).end();
    return;
  }
  await blog.populate("user", { username: 1, name: 1 });
  response.json(blog);
});

blogRouter.post("/", async (request, response) => {
  const body = request.body;

  const hasRequiredFields = ["title", "url", "userId", "author"].reduce(
    (acc, field) => {
      return acc && field in body;
    },
    true
  );
  if (!hasRequiredFields) {
    response.status(400).end();
    return;
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    user: await User.findById(body.userId),
    likes: body.likes ? body.likes : 0,
  });

  const savedBlog = await blog.save();
  response.status(201).json(savedBlog);
});

blogRouter.delete("/delete/:id", async (request, response) => {
  const { id } = request.params;
  const blogToDelete = await Blog.findById(id);
  if (!blogToDelete) {
    response.status(404).end();
  }
  await blogToDelete.deleteOne();
  response.status(204).end();
});

blogRouter.put("/:id", async (request, response) => {
  const blogToUpdate = await Blog.findById(request.params.id);

  if (!(blogToUpdate instanceof Blog)) {
    response.status(404).end();
    return;
  }

  Object.keys(request.body).forEach((propName) => {
    if (blogToUpdate[propName] !== request.body[propName]) {
      blogToUpdate[propName] = request.body[propName];
    }
  });

  const result = await blogToUpdate.save();
  response.status(200).json(result);
});

module.exports = blogRouter;
