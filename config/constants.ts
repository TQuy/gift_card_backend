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

// CORS configuration for cookie-based authentication
export const corsOptions = {
  origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    // Define allowed origins
    const allowedOrigins = [
      'http://localhost:3000',     // React development server
      'http://localhost:3001',     // Alternative React port
      'http://localhost:5173',     // Vite development server
      'http://127.0.0.1:3000',     // Local IP version
      'http://127.0.0.1:5173',     // Local IP version for Vite
    ];

    // Add production origins from environment variables
    if (process.env.FRONTEND_URLS) {
      const prodOrigins = process.env.FRONTEND_URLS.split(',').map(url => url.trim());
      allowedOrigins.push(...prodOrigins);
    }

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'), false);
    }
  },
  credentials: true,  // Allow credentials (cookies, authorization headers, TLS client certificates)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200, // Some legacy browsers (IE11, various SmartTVs) choke on 204
};