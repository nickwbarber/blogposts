// delete_blog.int.test.js
//
// Desc: Test deletion of blogs

const supertest = require('supertest');
const mongoose = require('mongoose');
const app = require('../../app');
const Blog = require('../../models/blog');

const api = supertest(app);

/* Make some data available to all tests */
const newBlog = {
  title: `This is a Blog That Will Be Deleted #${Math.round(Math.random() * 1000)}`,
  author: `Johnny Test #${Math.round(Math.random() * 1000)}`,
  url: `https://reactpatterns.com/test/${Math.round(Math.random() * 1000)}`,
  likes: 0,
};

let blogsBefore;
let response;
let blogsAfter;
let blogToDelete;
let idToDelete;

beforeAll(async () => {
  // add new blog that we will then use to test deletion
  await api.post('/api/blogs').send(newBlog);

  blogsBefore = (await api.get('/api/blogs')).body;

  blogToDelete = blogsBefore.find((b) => b.title === newBlog.title);
  idToDelete = blogToDelete.id;

  response = await api.delete(`/api/blogs/delete/${idToDelete}`);
  blogsAfter = (await api.get('/api/blogs')).body;
});

afterAll(async () => {
  mongoose.connection.close();
});

/* pre-run validity check */
describe('pre-run', () => {
  test('blogs were fetched', () => {
    expect(blogsBefore).toBeDefined();
  });

  test('the blog to delete was found in the initial list', () => {
    expect(blogsBefore.map((b) => b.title)).toContain(newBlog.title);
  });

  test('the id of the blog to delete was found', () => {
    expect(idToDelete).toBeDefined();
  });
});

/* actual tests */
describe('deletion of a blog', () => {
  test('returns with code 204', async () => {
    expect(response.status).toBe(204);
  });

  test('shortens blog list length by one', () => {
    expect(blogsAfter.length).toBe(blogsBefore.length - 1);
  });

  test('new blog list does not contain the deleted blog', () => {
    expect(blogsAfter).not.toContainEqual(newBlog);
  });
});
