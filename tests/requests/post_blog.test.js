// post_blog.test.js
//
// Desc: Test the post-blog

const supertest = require('supertest')
const app = require('../../app')
const mongoose = require('mongoose')

const api = supertest(app)


describe('POST /api/blogs', () => {
  const newBlog = {
    title: "React patterns",
    author: "Michael Chan",
    url: `https://reactpatterns.com/test/${Math.round(Math.random()*1000)}`,
    likes: 0,
  }

  describe('POST sends successfully', () => {
    let blogsBefore, postResponse, blogsAfter
  
    const getBlogWithoutId = blog => {
      const blogWithoutId = { ...blog }
      delete blogWithoutId.id
      return blogWithoutId
    }

    beforeAll(async () => {
      blogsBefore = await api.get('/api/blogs')

      postResponse =  await api
        .post('/api/blogs')
        .send(newBlog)

      blogsAfter = await api.get('/api/blogs')
    })

    test('returns successfully', async () => {
      expect(postResponse.status).toBe(201)
    })

    test('returns in application-json format', async () => {
      expect(postResponse.get('content-type')).toMatch(/application\/json/)
    })

    test('new blog list is one more than before', () => {
      expect(blogsAfter.body.length).toBe(blogsBefore.body.length + 1)
    })

    test('new blog list contains the new blog', () => {
      expect(blogsAfter.body.map(getBlogWithoutId))
        .toContainEqual(getBlogWithoutId(newBlog))
    })
  })
})


afterAll(async () => {
  mongoose.connection.close()
})
