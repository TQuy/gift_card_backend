import {
  generateToken,
  findUserByUsernameOrEmail,
  checkUserExists,
  createUser,
  transformUserResponse,
  registerUser,
  loginUser,
  getUserById,
} from "../../services/auth";
import { initializeTestDatabase } from "../../models";
import { USER_ROLES } from "../../models/role/Role";
import { sampleUser } from "../../utils/seedData/sample";

// Set test environment
process.env.NODE_ENV = "test";

describe("Auth Service", function () {
  // Set up test database
  beforeAll(async function () {
    await initializeTestDatabase();
  });

  describe("Pure Functions", function () {
    describe("generateToken", function () {
      it("should generate a valid JWT token", function () {
        const mockUser = {
          id: 1,
          email: "test@example.com",
          role_id: 1,
        };

        const token = generateToken(mockUser);

        expect(typeof token).toBe("string");
        expect(token.length).toBeGreaterThan(0);
        // Token should have 3 parts separated by dots
        expect(token.split(".")).toHaveLength(3);
      });

      it("should include correct payload in token", function () {
        const mockUser = {
          id: 123,
          email: "user@test.com",
          role_id: 2,
        };

        const token = generateToken(mockUser);

        // Decode without verification to check payload
        const decoded = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());

        expect(decoded.id).toBe(123);
        expect(decoded.email).toBe("user@test.com");
        expect(decoded.role).toBe(2);
        expect(decoded.exp).toBeDefined();
      });
    });

    describe("transformUserResponse", function () {
      it("should transform user data correctly for admin", function () {
        const mockUser = {
          id: 1,
          username: sampleUser.username,
          email: sampleUser.email,
          role_id: sampleUser.role_id,
          createdAt: new Date("2023-01-01"),
          userRole: {
            name: USER_ROLES.ADMIN
          }
        };

        const result = transformUserResponse(mockUser);

        expect(result).toEqual({
          id: 1,
          username: sampleUser.username,
          email: sampleUser.email,
          role_id: 1,
          roleName: USER_ROLES.ADMIN,
          isAdmin: true,
          createdAt: new Date("2023-01-01"),
        });
      });

      it("should transform user data correctly for regular user", function () {
        const mockUser = {
          id: 2,
          username: "user",
          email: "user@example.com",
          role_id: 2,
          createdAt: new Date("2023-01-02"),
          userRole: {
            name: USER_ROLES.USER
          }
        };

        const result = transformUserResponse(mockUser);

        expect(result).toEqual({
          id: 2,
          username: "user",
          email: "user@example.com",
          role_id: 2,
          roleName: USER_ROLES.USER,
          isAdmin: false,
          createdAt: new Date("2023-01-02"),
        });
      });

      it("should handle missing role data", function () {
        const mockUser = {
          id: 3,
          username: "orphan",
          email: "orphan@example.com",
          role_id: 999,
          createdAt: new Date("2023-01-03"),
          userRole: null
        };

        const result = transformUserResponse(mockUser);

        expect(result.roleName).toBe("UNKNOWN");
        expect(result.isAdmin).toBe(false);
      });
    });
  });

  describe("Database Operations", function () {
    describe("findUserByUsernameOrEmail", function () {
      it("should find user by username", async function () {
        const user = await findUserByUsernameOrEmail(sampleUser.username);

        expect(user).toBeTruthy();
        expect(user.username).toBe(sampleUser.username);
        expect(user.userRole).toBeTruthy();
        expect(user.userRole.name).toBe(USER_ROLES.ADMIN);
      });

      it("should find user by email", async function () {
        const user = await findUserByUsernameOrEmail(sampleUser.email);

        expect(user).toBeTruthy();
        expect(user.email).toBe(sampleUser.email);
        expect(user.userRole).toBeTruthy();
      });

      it("should return null for non-existent user", async function () {
        const user = await findUserByUsernameOrEmail("nonexistent");

        expect(user).toBeNull();
      });
    });

    describe("checkUserExists", function () {
      it("should return true for existing username", async function () {
        const exists = await checkUserExists("admin", "new@example.com");

        expect(exists).toBe(true);
      });

      it("should return true for existing email", async function () {
        const exists = await checkUserExists("newuser", sampleUser.email);

        expect(exists).toBe(true);
      });

      it("should return false for non-existent user", async function () {
        const exists = await checkUserExists("newuser", "new@example.com");

        expect(exists).toBe(false);
      });
    });

    describe("createUser", function () {
      it("should create user with specified role", async function () {
        const userData = {
          username: "testuser",
          email: "test@example.com",
          password: "password123",
          roleName: USER_ROLES.ADMIN
        };

        const user = await createUser(userData);

        expect(user).toBeTruthy();
        expect(user.username).toBe(userData.username);
        expect(user.email).toBe(userData.email);
        expect(user.role_id).toBe(user.userRole.id);
        expect(user.userRole).toBeTruthy();
      });

      it("should create user with default USER role when no role specified", async function () {
        const userData = {
          username: "testuser2",
          email: "test2@example.com",
          password: "password123",
          roleName: USER_ROLES.USER
        };

        const user = await createUser(userData);

        expect(user).toBeTruthy();
        expect(user.userRole.name).toBe(USER_ROLES.USER);
      });
    });

    describe("registerUser", function () {
      it("should register new user successfully", async function () {
        const userData = {
          username: "newuser",
          email: "newuser@example.com",
          password: "password123"
        };

        const result = await registerUser(userData);

        expect(result).toBeTruthy();
        expect(result.username).toBe("newuser");
        expect(result.email).toBe("newuser@example.com");
        expect(result.roleName).toBe(USER_ROLES.USER);
        expect(result.isAdmin).toBe(false);
      });

      it("should throw error for missing required fields", async function () {
        const userData = {
          username: "",
          email: "test@example.com",
          password: "password123"
        };

        await expect(registerUser(userData)).rejects.toThrow(
          "Username, email, and password are required"
        );
      });

      it("should throw error for short password", async function () {
        const userData = {
          username: "testuser",
          email: "test@example.com",
          password: "123"
        };

        await expect(registerUser(userData)).rejects.toThrow(
          "Password must be at least 6 characters long"
        );
      });

      it("should throw error for existing username", async function () {
        const userData = {
          username: sampleUser.username, // Already exists
          email: "newemail@example.com",
          password: "password123"
        };

        await expect(registerUser(userData)).rejects.toThrow(
          "Username or email already exists"
        );
      });
    });

    describe("loginUser", function () {
      it("should login with valid credentials", async function () {
        const credentials = {
          username: sampleUser.username,
          password: sampleUser.password
        };

        const result = await loginUser(credentials);

        expect(result).toBeTruthy();
        expect(result.username).toBe(sampleUser.username);
        expect(result.roleName).toBe(USER_ROLES.ADMIN);
        expect(result.isAdmin).toBe(true);
      });

      it("should login with email as username", async function () {
        const credentials = {
          username: sampleUser.email,
          password: sampleUser.password
        };

        const result = await loginUser(credentials);

        expect(result).toBeTruthy();
        expect(result.email).toBe(sampleUser.email);
      });

      it("should throw error for invalid password", async function () {
        const credentials = {
          username: sampleUser.email,
          password: "wrongpassword"
        };

        await expect(loginUser(credentials)).rejects.toThrow("Invalid credentials");
      });

      it("should throw error for non-existent user", async function () {
        const credentials = {
          username: "nonexistent@example.com",
          password: "password123"
        };

        await expect(loginUser(credentials)).rejects.toThrow("Invalid credentials");
      });

      it("should throw error for missing credentials", async function () {
        const credentials = {
          username: "",
          password: "password123"
        };

        await expect(loginUser(credentials)).rejects.toThrow(
          "Username and password are required"
        );
      });
    });

    describe("getUserById", function () {
      it("should return user with role information", async function () {
        // First create a user to test with
        const userData = {
          username: "testgetuser",
          email: "testget@example.com",
          password: "password123"
        };

        const createdUser = await registerUser(userData);
        const result = await getUserById(createdUser.id);

        expect(result).toBeTruthy();
        expect(result!.id).toBe(createdUser.id);
        expect(result!.username).toBe("testgetuser");
        expect(result!.email).toBe("testget@example.com");
        expect(result!.roleName).toBe(USER_ROLES.USER);
        expect(result!.isAdmin).toBe(false);
      });

      it("should return null for non-existent user", async function () {
        const result = await getUserById(999999);

        expect(result).toBeNull();
      });
    });
  });
});
