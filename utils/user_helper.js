const isUnique = (users, user) =>
  !users.map((u) => u.username).includes(user.username);

const isValidUsername = (username) => username.length >= 3;

module.exports = {
  isUnique,
  isValidUsername,
};
