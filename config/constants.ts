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

// HTTP status codes - using http-status-codes library
export const HTTP_STATUS = StatusCodes;
