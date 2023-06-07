// requests.test.js
//
// Desc: Test the requests

const supertest = require('supertest')
const app = require('../app')
const mongoose = require('mongoose')

const api = supertest(app)


test('GET /api/blogs', async () => {
  await api.get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('identifier is defined', async () => {
  const blogs = (await api.get('/api/blogs')).body
  expect(blogs.every(blog => blog.id)).toBeTruthy()
})


afterAll(async () => {
  mongoose.connection.close()
})
