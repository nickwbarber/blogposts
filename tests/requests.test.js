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

afterAll(async () => {
  mongoose.connection.close()
})