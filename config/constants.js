/**
 * Application constants and configuration values
 */

// Environment constants
const NODE_ENVIRONMENTS = {
  PRODUCTION: "production",
  DEVELOPMENT: "development",
  TEST: "test"
}

// JWT constants
const JWT_DEFAULTS = {
  SECRET: "your-super-secret-jwt-key",
  EXPIRES_IN: "7d"
}

// Cookie constants
const COOKIE_CONFIG = {
  NAME: "token",
  SAME_SITE: "strict",
  HTTP_ONLY: true,
  MAX_AGE: 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
}

// Response status constants
const RESPONSE_STATUS = {
  SUCCESS: "success",
  ERROR: "error"
}

// User role constants (should match your User model)
const USER_ROLES = {
  ADMIN: 1,
  USER: 2,
  ADMIN_NAME: "admin",
  USER_NAME: "user"
}

// Default user credentials (for seeding)
const DEFAULT_ADMIN = {
  USERNAME: "admin",
  EMAIL: "admin@example.com",
  PASSWORD: "admin123"
}

// HTTP status codes (commonly used ones)
const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500
}

// API messages
const MESSAGES = {
  // Auth messages
  LOGIN_SUCCESSFUL: "Login successful",
  LOGOUT_SUCCESSFUL: "Logout successful",
  REGISTRATION_SUCCESSFUL: "User registered successfully",
  USER_DATA_RETRIEVED: "User data retrieved successfully",

  // Error messages
  LOGIN_FAILED: "Login failed",
  REGISTRATION_FAILED: "Registration failed",
  AUTHENTICATION_FAILED: "Authentication failed",
  ACCESS_TOKEN_REQUIRED: "Access token required",
  INVALID_CREDENTIALS: "Invalid credentials",
  INVALID_TOKEN: "Invalid token",
  TOKEN_EXPIRED: "Token expired",
  ADMIN_ACCESS_REQUIRED: "Admin access required",
  INSUFFICIENT_PERMISSIONS: "Insufficient permissions",
  USERNAME_EMAIL_REQUIRED: "Username, email, and password are required",
  PASSWORD_MIN_LENGTH: "Password must be at least 6 characters long",
  USERNAME_EMAIL_EXISTS: "Username or email already exists",
  USER_NOT_FOUND: "Invalid token - user not found",
  FAILED_GET_USER_DATA: "Failed to get user data"
}

module.exports = {
  NODE_ENVIRONMENTS,
  JWT_DEFAULTS,
  COOKIE_CONFIG,
  RESPONSE_STATUS,
  USER_ROLES,
  DEFAULT_ADMIN,
  HTTP_STATUS,
  MESSAGES
}
