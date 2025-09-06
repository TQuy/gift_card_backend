import request from "supertest";
import { app } from "../server";
import { User, initializeTestDatabase } from "../models";

// Set test environment
process.env.NODE_ENV = "test";

describe("Authentication API", () => {
  // Set up test database
  beforeAll(async () => {
    await initializeTestDatabase();
  });

  describe("POST /api/auth/login", () => {
    it("should login with valid credentials", async () => {
      const loginData = {
        email: "admin@example.com",
        password: "admin123"
      };

      const res = await request(app)
        .post("/api/auth/login")
        .send(loginData)
        .expect(200);

      expect(res.body.status).toBe("success");
      expect(res.body.message).toBe("Login successful");
      expect(res.body.data).toHaveProperty("id");
      expect(res.body.data.email).toBe(loginData.email);

      // Check if cookie is set
      expect(res.headers["set-cookie"]).toBeDefined();
    });

    it("should return 400 with invalid credentials", async () => {
      const loginData = {
        email: "admin@example.com",
        password: "wrongpassword"
      };

      const res = await request(app)
        .post("/api/auth/login")
        .send(loginData)
        .expect(400);

      expect(res.body.status).toBe("error");
      expect(res.body.error).toBe("Invalid credentials");
    });

    it("should return 400 with missing email", async () => {
      const loginData = {
        password: "admin123"
      };

      const res = await request(app)
        .post("/api/auth/login")
        .send(loginData)
        .expect(400);

      expect(res.body.status).toBe("error");
      expect(res.body.error).toBe("Email and password are required");
    });

    it("should return 400 with missing password", async () => {
      const loginData = {
        email: "admin@example.com"
      };

      const res = await request(app)
        .post("/api/auth/login")
        .send(loginData)
        .expect(400);

      expect(res.body.status).toBe("error");
      expect(res.body.error).toBe("Email and password are required");
    });
  });

  describe("POST /api/auth/register", () => {
    it("should register a new user", async () => {
      const userData = {
        username: "testuser",
        email: "test@example.com",
        password: "password123"
      };

      const res = await request(app)
        .post("/api/auth/register")
        .send(userData)
        .expect(201);

      expect(res.body.status).toBe("success");
      expect(res.body.message).toBe("User registered successfully");
      expect(res.body.data).toHaveProperty("id");
      expect(res.body.data.email).toBe(userData.email);
      expect(res.body.data.username).toBe(userData.username);
    });

    it("should return 400 when registering with existing email", async () => {
      const userData = {
        username: "admin2",
        email: "admin@example.com", // This email already exists
        password: "password123"
      };

      const res = await request(app)
        .post("/api/auth/register")
        .send(userData)
        .expect(400);

      expect(res.body.status).toBe("error");
      expect(res.body.error).toContain("already exists");
    });
  });

  describe("POST /api/auth/logout", () => {
    it("should logout successfully", async () => {
      // First login to get a session
      const loginData = {
        email: "admin@example.com",
        password: "admin123"
      };

      const loginRes = await request(app)
        .post("/api/auth/login")
        .send(loginData)
        .expect(200);

      // Extract the cookie from login response
      const cookies = loginRes.headers["set-cookie"];

      // Then logout
      const res = await request(app)
        .post("/api/auth/logout")
        .set("Cookie", cookies)
        .expect(200);

      expect(res.body.status).toBe("success");
      expect(res.body.message).toBe("Logout successful");
    });
  });

  describe("GET /api/auth/me", () => {
    it("should get current user info when logged in", async () => {
      // First login to get a session
      const loginData = {
        email: "admin@example.com",
        password: "admin123"
      };

      const loginRes = await request(app)
        .post("/api/auth/login")
        .send(loginData)
        .expect(200);

      // Extract the cookie from login response
      const cookies = loginRes.headers["set-cookie"];

      // Then get current user
      const res = await request(app)
        .get("/api/auth/me")
        .set("Cookie", cookies)
        .expect(200);

      expect(res.body.status).toBe("success");
      expect(res.body.data).toHaveProperty("id");
      expect(res.body.data.email).toBe("admin@example.com");
    });

    it("should return 401 when not logged in", async () => {
      const res = await request(app)
        .get("/api/auth/me")
        .expect(401);

      expect(res.body.status).toBe("error");
      expect(res.body.error).toBe("Access token required");
    });
  });
});
