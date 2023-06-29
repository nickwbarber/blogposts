const supertest = require('supertest');
const mongoose = require('mongoose');
const User = require('../../models/user');
const app = require('../../app');

const api = supertest(app);

beforeAll(async () => {
  await User.deleteMany({});
});

afterAll(async () => {
  mongoose.connection.close();
});

describe('adding a user', () => {
  test('should return status 200', async () => {
    const response = await api.post('/api/users').send({
      username: 'username1',
      name: 'Test User 1',
      password: 'password1',
    });

    expect(response.status).toBe(201);
  });
});
describe('adding an user with username shorter than 3 characters', () => {
  test('should return status 400', async () => {
    const response = await api.post('/api/users').send({
      username: 'username1',
      name: 'Test User 1',
      password: 'password1',
    });

    expect(response.status).toBe(400);
  });
});
