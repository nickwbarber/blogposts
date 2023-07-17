const blogRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

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

blogRouter.post("/", async (req, res) => {
  const user = req.user;
  const body = req.body;

  // ensure the request has enough information
  const hasRequiredFields = ["title", "url", "author"].reduce((acc, field) => {
    return acc && field in body;
  }, true);
  if (!hasRequiredFields) {
    res
      .status(400)
      .json({ error: "blogs need a 'title', 'url', and 'author'" })
      .end();
    return;
  }

  // create the blog
  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    user: user,
    likes: body.likes ? body.likes : 0,
  });

  // save the blog
  const savedBlog = await blog.save();

  // add the blog to the user's blog list
  user.blogs = user.blogs.concat(blog._id);
  await user.save();

  res.status(201).json(savedBlog).end();
});

blogRouter.delete("/delete/:id", async (req, res) => {
  // find the blog requested for deletion
  const { id } = req.params;
  const blogToDelete = await Blog.findById(id);
  if (!blogToDelete) {
    res.status(404).end();
    return;
  }

  // authorize the action
  const authorized = req.user._id.toString() === blogToDelete.user.toString();

  if (!authorized) {
    res.status(401).end();
    return;
  }

  // actually delete
  await blogToDelete.deleteOne();
  res.status(204).end();
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
