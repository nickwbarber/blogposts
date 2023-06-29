const userHelper = require('../utils/user_helper');

const users = [
  {
    username: 'user1',
    name: 'User One',
    password: 'password1',
  },
  {
    username: 'user2',
    name: 'User Two',
    password: 'password2',
  },
];

describe('isUnique', () => {
  test('should return true if username is unique', () => {
    const newUser = {
      username: 'user3',
      name: 'User Three',
      password: 'password3',
    };
    expect(userHelper.isUnique(users, newUser)).toBe(true);
  });

  test('should return false if username is not unique', () => {
    const newUser = {
      username: 'user2',
      name: 'User Three',
      password: 'password3',
    };

    expect(userHelper.isUnique(users, newUser)).toBe(false);
  });

  test('should return true if username is unique, but name is not', () => {
    const newUser = {
      username: 'user3',
      name: 'User One',
      password: 'password3',
    };

    expect(userHelper.isUnique(users, newUser)).toBe(true);
  });

  test('should return true if username is unique, but password is not', () => {
    const newUser = {
      username: 'user3',
      name: 'User Three',
      password: 'password1',
    };

    expect(userHelper.isUnique(users, newUser)).toBe(true);
  });
});
