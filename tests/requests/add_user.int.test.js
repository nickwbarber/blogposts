const supertest = require('supertest');
const mongoose = require('mongoose');
const User = require('../../models/user');
const app = require('../../app');

const api = supertest(app);

beforeAll(async () => {
  await User.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('before tests', () => {
  test('database should be empty', async () => {
    const users = await User.find({});
    expect(users.length).toBe(0);
  });
});

describe('adding a valid user', () => {
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
