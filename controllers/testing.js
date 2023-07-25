const testingRouter = require("express").Router();
const { setupTestDB } = require("../utils/test_helper");

testingRouter.post("/reset", async (req, res) => {
  const numOfBlogs = req.body.numOfBlogs ? req.body.numOfBlogs : req.body.numOfUsers ? 1 : 0;
  const numOfUsers = req.body.numOfUsers ? req.body.numOfUsers : numOfBlogs ? 1 : 0;

  console.log('Resetting test database...');

  await setupTestDB({ numOfUsers, numOfBlogs });

  console.log('numOfBlogs', numOfBlogs);
  console.log('numOfUsers', numOfUsers);

  res.status(200).end();
});

module.exports = testingRouter;
