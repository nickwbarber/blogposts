const supertest = require('supertest');
const mongoose = require('mongoose');

const User = require('../../models/user');
const app = require('../../app');

const api = supertest(app);

beforeEach(async () => {
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

  test('should successfully add the user to the server', async () => {
    const testUser = {
      username: 'username1',
      name: 'Test User 1',
      password: 'password1',
    };

    await api.post('/api/users').send(testUser);

    const users = await User.find({});
    const foundUser = users[0];

    expect(users.length).toBe(1);
    expect(foundUser.username).toEqual(testUser.username);
    expect(foundUser.name).toEqual(testUser.name);
  });
});

describe('adding an user with username shorter than 3 characters', () => {
  test('should return status 400', async () => {
    const response = await api.post('/api/users').send({
      username: 'us',
      name: 'Test User 1',
      password: 'password1',
    });

    expect(response.status).toBe(400);
  });
});
