const jwt = require("jsonwebtoken");

const randomIntBetween = (min, max) => {
  if (min > max) {
    throw new SyntaxError("first number should be less than the second");
  }
  if ((typeof min !== "number") | (typeof max !== "number")) {
    throw new TypeError("must use numbers");
  }
  return Math.floor((max - min + 1) * Math.random()) + 1;
};

const getTokenFrom = (request) => {
  const authorization = request.get("authorization");
  if (authorization && authorization.startsWith("Bearer ")) {
    return authorization.replace("Bearer ", "");
  }
  return null;
};

const blogToRequestFormat = (blog) => {
  blog.userId = blog.user;
  delete blog.user;
  return blog;
};

/**
  Mock logging in as the given user without depending on the login route
  @returns `token`: string 
*/
const createTokenFor = (user) => {
  const token = jwt.sign(
    { username: user.username, id: user._id },
    process.env.SECRET
  );
  return token;
};

module.exports = {
  getTokenFrom,
  randomIntBetween,
  blogToRequestFormat,
  createTokenFor,
};
