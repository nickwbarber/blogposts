const randomIntBetween = (min, max) => {
  if (min > max) {
    throw new SyntaxError("first number should be less than the second");
  }
  if ((typeof min !== "number") | (typeof max !== "number")) {
    throw new TypeError("must use numbers");
  }
  return Math.floor((max - min + 1) * Math.random()) + 1;
};

module.exports = {
  randomIntBetween,
};
