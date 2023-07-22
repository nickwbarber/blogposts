const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const loginRouter = require("express").Router();

loginRouter.post("/", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(401).json({
      error: "not enough information",
    });
  }

  const user = await User.findOne({ username });
  if (!user) {
    return res.status(401).json({
      error: "invalid username",
    });
  }

  const passwordCorrect =
    user === null ? false : await bcrypt.compare(password, user.passwordHash);

  if (!passwordCorrect) {
    return res.status(401).json({
      error: "invalid password",
    });
  }

  const userForToken = {
    username: user.username,
    id: user._id,
  };

  const token = jwt.sign(userForToken, process.env.SECRET, {
    expiresIn: 60 * 60,
  });

  res.status(200).send({ token, username: user.username, name: user.name });
});

module.exports = loginRouter;
