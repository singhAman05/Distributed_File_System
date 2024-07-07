// tests/authService.test.js
const authService = require("../services/authService");
const User = require("../models/user");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("AuthService Edge Cases", () => {
  test("should not register user with duplicate username", async () => {
    const userData = { username: "testuser", password: "testpass" };
    await authService.registerUser(userData);

    await expect(authService.registerUser(userData)).rejects.toThrow(
      "Username already taken"
    );
  });

  test("should not authenticate user with incorrect password", async () => {
    const userData = { username: "testuser", password: "testpass" };
    await authService.registerUser(userData);

    await expect(
      authService.authenticateUser({
        username: "testuser",
        password: "wrongpass",
      })
    ).rejects.toThrow("Invalid credentials");
  });

  test("should handle expired token", () => {
    const token = authService.generateToken({ username: "testuser" });
    jest.advanceTimersByTime(60 * 60 * 1000); // Fast-forward 1 hour

    expect(() => authService.verifyToken(token)).toThrow("Token has expired");
  });

  test("should handle invalid token", () => {
    const invalidToken = "invalid.token.here";

    expect(() => authService.verifyToken(invalidToken)).toThrow(
      "Invalid token"
    );
  });
});
