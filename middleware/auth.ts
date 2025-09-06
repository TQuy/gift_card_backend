import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { User } from "@/models";
import { errorResponse } from "@/utils/responseHelpers";
import {
  JWT_DEFAULTS,
  COOKIE_CONFIG,
  HTTP_STATUS
} from "@/config/constants";

// JWT secret - in production, use environment variable
const JWT_SECRET: string = process.env.JWT_SECRET || JWT_DEFAULTS.SECRET;

/**
 * Middleware to authenticate JWT token from httpOnly cookie
 */
async function authenticateToken(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
  try {
    // Get token from httpOnly cookie
    const token = req.cookies[COOKIE_CONFIG.NAME];

    if (!token) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json(errorResponse("Access token required"));
    }

    // Verify token
    const decoded: any = jwt.verify(token, JWT_SECRET);

    // Find user by ID
    const user = await User.findByPk(decoded.id || decoded.userId);
    if (!user) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json(errorResponse("Invalid token - user not found"));
    }

    // Add user to request object
    (req as any).user = user;
    (req as any).userId = user.id;
    (req as any).userRole = user.role;

    next();
  } catch (err: any) {
    if (err.name === "JsonWebTokenError") {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json(errorResponse("Invalid token"));
    }
    if (err.name === "TokenExpiredError") {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json(errorResponse("Token expired"));
    }
    console.error("Authentication error:", err);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(errorResponse("Authentication failed"));
  }
}

/**
 * Middleware to check if user has admin role
 */
function requireAdmin(req: Request, res: Response, next: NextFunction): Response | void {
  const user = (req as any).user;
  if (!user || !user.isAdmin()) {
    return res.status(HTTP_STATUS.FORBIDDEN).json(errorResponse("Admin access required"));
  }
  next();
}

/**
 * Middleware to check if user has specific role
 */
function requireRole(allowedRoles: number[]) {
  return function (req: Request, res: Response, next: NextFunction): Response | void {
    const user = (req as any).user;
    if (!user || !allowedRoles.includes(user.role)) {
      return res.status(HTTP_STATUS.FORBIDDEN).json(errorResponse("Insufficient permissions"));
    }
    next();
  };
}

/**
 * Optional authentication - doesn't fail if no token, defaults to admin role
 */
async function optionalAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const token = req.cookies[COOKIE_CONFIG.NAME];

    if (token) {
      const decoded: any = jwt.verify(token, JWT_SECRET);
      const user = await User.findByPk(decoded.id || decoded.userId);
      if (user) {
        (req as any).user = user;
        (req as any).userId = user.id;
        (req as any).userRole = user.role;
      } else {
        // If token is invalid, set default admin role
        (req as any).userRole = 1; // Admin role
      }
    } else {
      // If no token, set default admin role for development/testing
      (req as any).userRole = 1; // Admin role
    }

    next();
  } catch (err) {
    // Continue without authentication, set default admin role
    (req as any).userRole = 1; // Admin role
    next();
  }
}

export {
  authenticateToken,
  requireAdmin,
  requireRole,
  optionalAuth,
  JWT_SECRET,
};
