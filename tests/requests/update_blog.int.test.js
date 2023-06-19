// update_blog.int.test.js
//
// Desc: Test updating blogs

const supertest = require('supertest');
const mongoose = require('mongoose');
const app = require('../../app');

const api = supertest(app);

/* Make some data available to all tests */

const TEST_NUM_OF_LIKES = Math.floor(Math.random()*10000);

let blogToUpdate;
let blogsAfter;
let blogsBefore;
let responseOnUpdate;
let blogAfterUpdate;

beforeAll(async () => {
  blogsBefore = (await api.get('/api/blogs')).body;
  blogToUpdate = blogsBefore[blogsBefore.length - 1];
  responseOnUpdate = await api.put(`/api/blogs/${blogToUpdate.id}`).send({ likes: TEST_NUM_OF_LIKES });
  blogsAfter = (await api.get('/api/blogs')).body;
  blogAfterUpdate = blogsAfter[blogsAfter.length - 1];
});

afterAll(async () => {
  mongoose.connection.close();
});

/* pre-run validity check */
describe('pre-run', () => {
  test('blogs were fetched', () => {
    expect(blogsBefore).toBeDefined();
  });

  test('the blog to update was found', () => {
    expect(blogToUpdate).toBeDefined();
  });
});

/* actual tests */
describe('update a blog', () => {
  test('returns with code 200', async () => {
    expect(responseOnUpdate.status).toBe(200);
  });

  test('does not alter blog list length', () => {
    expect(blogsAfter.length).toBe(blogsBefore.length);
  });

  test('blog after update contains the right number of likes', () => {
    expect(blogAfterUpdate.likes).toBe(TEST_NUM_OF_LIKES);
  });
});
