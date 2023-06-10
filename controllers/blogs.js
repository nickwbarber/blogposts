// Desc: Controller for blog routes

const blogRouter = require('express').Router()
const Blog = require('../models/blog')

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogRouter.post('/', async (request, response) => {
  const blog = new Blog(request.body)

  // missing likes is okay --> default to 0
  blog.likes = blog.likes ? blog.likes : 0

  // Title and URL is required
  // missing --> bad request
  if (!blog.title || !blog.url) {
    response.status(400).end()
    return
  }

  const result = await blog.save()
  response.status(201).json(result)
})

module.exports = blogRouter
