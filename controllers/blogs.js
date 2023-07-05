const blogRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user"); // TODO: delete this after implementing User info

blogRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({});
  // await blogs.populate("user");
  response.json(blogs);
});

blogRouter.get("/id/:id", async (request, response) => {
  const blog = await Blog.findById(request.params.id);
  if (!(blog instanceof Blog)) {
    response.status(404).end();
    return;
  }
  response.json(blog);
});

blogRouter.post("/", async (request, response) => {
  console.log("body:", request.body);
  const hasRequiredFields = (body) => {
    return ["title", "url"].reduce((acc, field) => {
      return acc && field in body;
    }, true);
  };

  if (!hasRequiredFields(request.body)) {
    response.status(400).end();
    return;
  }

  const blog = new Blog(request.body);

  // missing likes is okay --> default to 0
  blog.likes = blog.likes ? blog.likes : 0;

  // NOTE: This is only to test out adding a User to the blog
  await User.create({
    name: "TestName",
    username: "testusername",
    passwordHash: "asdfasdf",
  });
  const newUser = await User.findOne({});
  blog.user = newUser.id;

  const result = await blog.save();
  response.status(201).json(result);
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
