/**
 * Application constants and configuration values
 */
import { StatusCodes } from 'http-status-codes';

// Environment constants
export const NODE_ENVIRONMENTS = {
  PRODUCTION: "production",
  DEVELOPMENT: "development",
  TEST: "test"
} as const;

// JWT constants
export const JWT_DEFAULTS = {
  SECRET: "your-super-secret-jwt-key",
  EXPIRES_IN: "7d"
} as const;

// Cookie constants
export const COOKIE_CONFIG = {
  NAME: "token",
  SAME_SITE: "strict",
  HTTP_ONLY: true,
  MAX_AGE: 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
} as const;

// Response status constants
export const RESPONSE_STATUS = {
  SUCCESS: "success",
  ERROR: "error"
} as const;

// User role constants (should match your User model)
export const USER_ROLES = {
  ADMIN: 1,
  USER: 2,
  ADMIN_NAME: "admin",
  USER_NAME: "user"
} as const;

// Default user credentials (for seeding)
export const DEFAULT_ADMIN = {
  USERNAME: "admin",
  EMAIL: "admin@example.com",
  PASSWORD: "admin123"
} as const;

// HTTP status codes - using http-status-codes library
export const HTTP_STATUS = StatusCodes;
