const isUnique = (users, user) => !users
  .map((u) => u.username)
  .includes(user.username);

module.exports = {
  isUnique,
};
