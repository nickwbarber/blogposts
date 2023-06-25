// Desc: Controller for blog routes

const blogRouter = require('express').Router();
const Blog = require('../models/blog');

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({});
  response.json(blogs);
});

blogRouter.get('/id/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id);
  if (!(blog instanceof Blog)) {
    response.status(404).end();
    return;
  }
  response.json(blog);
});

blogRouter.post('/', async (request, response) => {
  const blog = new Blog(request.body);

  // missing likes is okay --> default to 0
  blog.likes = blog.likes ? blog.likes : 0;

  // Title and URL is required
  // missing --> bad request
  if (!blog.title || !blog.url) {
    response.status(400).end();
    return;
  }

  const result = await blog.save();
  response.status(201).json(result);
});

blogRouter.delete('/delete/:id', async (request, response) => {
  const { id } = request.params;
  const blogToDelete = await Blog.findById(id);
  if (!blogToDelete) {
    response.status(404).end();
  }
  await blogToDelete.deleteOne();
  response.status(204).end();
});

blogRouter.put('/:id', async (request, response) => {
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
