// get_blog.int.test.js
//
// Desc: Test getting a specific blog by id

const supertest = require('supertest');
const mongoose = require('mongoose');
const app = require('../../app');
const Blog = require('../../models/blog');

const api = supertest(app);

const tV = {
  'blogToGet': undefined,
  'blogsBefore': undefined,
  'response': undefined,
  'blogsAfter': undefined,
};

beforeAll(async () => {
  tV.blogToGet = await Blog.findOne();
  tV.blogsBefore = await api.get('/api/blogs');
  tV.response = await api.get(`/api/blogs/id/${tV.blogToGet.id}`);
  tV.blogsAfter = await api.get('/api/blogs');
})

afterAll(async () => {
  mongoose.connection.close();
});

describe('Updating a blog', () => {
  test('returns with code 200', async () => {
    expect(tV.response.status).toBe(200);
  });

  test('does not alter blog list length', () => {
    expect(tV.blogsAfter.length).toBe(tV.blogsBefore.length);
  });

  test('blog has the correct id', () => {
    expect(tV.response.body.id).toEqual(tV.blogToGet.id);
  })
});
