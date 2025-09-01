const jwt = require("jsonwebtoken")
const { User } = require("../models")
const { errorResponse } = require("../utils/responseHelpers")
const {
  JWT_DEFAULTS,
  COOKIE_CONFIG,
  HTTP_STATUS,
  MESSAGES
} = require("../config/constants")

// JWT secret - in production, use environment variable
const JWT_SECRET = process.env.JWT_SECRET || JWT_DEFAULTS.SECRET

/**
 * Middleware to authenticate JWT token from httpOnly cookie
 */
async function authenticateToken(req, res, next) {
  try {
    // Get token from httpOnly cookie
    const token = req.cookies[COOKIE_CONFIG.NAME]

    if (!token) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json(errorResponse(MESSAGES.ACCESS_TOKEN_REQUIRED))
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET)

    // Find user by ID
    const user = await User.findByPk(decoded.userId)
    if (!user) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json(errorResponse(MESSAGES.USER_NOT_FOUND))
    }

    // Add user to request object
    req.user = user
    req.userId = user.id
    req.userRole = user.role

    next()
  } catch (err) {
    if (err.name === "JsonWebTokenError") {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json(errorResponse(MESSAGES.INVALID_TOKEN))
    }
    if (err.name === "TokenExpiredError") {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json(errorResponse(MESSAGES.TOKEN_EXPIRED))
    }
    console.error("Authentication error:", err)
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(errorResponse(MESSAGES.AUTHENTICATION_FAILED))
  }
}

/**
 * Middleware to check if user has admin role
 */
function requireAdmin(req, res, next) {
  if (!req.user || !req.user.isAdmin()) {
    return res.status(HTTP_STATUS.FORBIDDEN).json(errorResponse(MESSAGES.ADMIN_ACCESS_REQUIRED))
  }
  next()
}

/**
 * Middleware to check if user has specific role
 */
function requireRole(allowedRoles) {
  return function (req, res, next) {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(HTTP_STATUS.FORBIDDEN).json(errorResponse(MESSAGES.INSUFFICIENT_PERMISSIONS))
    }
    next()
  }
}

/**
 * Optional authentication - doesn't fail if no token
 */
async function optionalAuth(req, res, next) {
  try {
    const token = req.cookies[COOKIE_CONFIG.NAME]

    if (token) {
      const decoded = jwt.verify(token, JWT_SECRET)
      const user = await User.findByPk(decoded.userId)
      if (user) {
        req.user = user
        req.userId = user.id
        req.userRole = user.role
      }
    }

    next()
  } catch (err) {
    // Continue without authentication
    next()
  }
}

module.exports = {
  authenticateToken,
  requireAdmin,
  requireRole,
  optionalAuth,
  JWT_SECRET,
}
