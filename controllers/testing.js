const testingRouter = require("express").Router();
const { setupTestDB } = require("../utils/test_helper");

testingRouter.post("/reset", async (req, res) => {
  const numberOfBlogs = req.body || 0;
  const numberOfUsers = req.body || numberOfBlogs ? 1 : 0;

  await setupTestDB({ numberOfUsers, numberOfBlogs });
  res.status(200).end();
});

module.exports = testingRouter;
