const userRouter = require('express').Router();
const bcrypt = require('bcrypt');
const User = require('../models/user');

const { isUnique } = require('../utils/user_helper');

// get all users
userRouter.get('/', async (request, response) => {
  const users = await User.find({});

  response.json(users);
});

// add a new user
userRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body;

  // ensure username and password are provided
  if (!username || !password) {
    response.status(400).end();
  }

  // ensure unique username
  if (!isUnique(await User.find({}), { username })) {
    response.status(400)
      .json({ error: 'username must be unique' })
      .end();
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new User({
    username,
    name,
    passwordHash,
  });

  const savedUser = await user.save();

  response.status(201).json(savedUser);
});

module.exports = userRouter;
