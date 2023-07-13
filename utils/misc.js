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

module.exports = {
  getTokenFrom,
  randomIntBetween,
};
