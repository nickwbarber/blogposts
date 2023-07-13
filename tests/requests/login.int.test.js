require("dotenv").config();
const config = require("../../utils/config");
const supertest = require("supertest");
const app = require("../../app");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const User = require("../../models/user");

const api = supertest(app);

beforeAll(async () => {
  await mongoose.connect(config.MONGODB_URI);
  await User.deleteMany({});
});

afterAll(async () => {
  await User.deleteMany({});
  await mongoose.connection.close();
});

describe("GET /api/login", () => {
  describe("logging in with valid credentials", () => {
    const name = "testname";
    const username = "testusername";
    const password = "testpassword";
    let user;
    let response;

    beforeAll(async () => {
      user = await User.create({
        name,
        username,
        passwordHash: await bcrypt.hash(password, 10),
        blogs: [],
      });
      response = await api.post("/api/login").send({ username, password });
    });

    test("returns with code 200", async () => {
      expect(response.status).toBe(200);
    });

    test("returns in application-json format", async () => {
      expect(response.get("content-type")).toMatch(/application\/json/);
    });
  });

  describe("logging in for nonexistent user", () => {
    const name = "testname";
    const username = "testusername";
    const password = "testpassword";
    let user;
    let response;

    beforeAll(async () => {
      user = await User.create({ name, username, password });
      response = await api
        .post("/api/login")
        .send({ username: "wrongname", password });
    });

    test("returns with code 401", async () => {
      expect(response.status).toBe(401);
    });

    test("returns in application-json format", async () => {
      expect(response.get("content-type")).toMatch(/application\/json/);
    });
  });

  describe("logging in with incorrect password", () => {
    const name = "testname";
    const username = "testusername";
    const password = "testpassword";
    let response;
    let user;

    beforeAll(async () => {
      user = await User.create({ name, username, password });
      response = await api
        .post("/api/login")
        .send({ username, password: "wrongpassword" });
    });

    test("returns with code 401", async () => {
      expect(response.status).toBe(401);
    });

    test("returns in application-json format", async () => {
      expect(response.get("content-type")).toMatch(/application\/json/);
    });
  });
});
