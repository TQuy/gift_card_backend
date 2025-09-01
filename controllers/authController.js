const jwt = require("jsonwebtoken")
const { Op } = require("sequelize")
const { User } = require("../models")
const { successResponse, errorResponse } = require("../utils/responseHelpers")
const {
  JWT_DEFAULTS,
  COOKIE_CONFIG,
  NODE_ENVIRONMENTS,
  HTTP_STATUS,
  MESSAGES
} = require("../config/constants")

// JWT secret - in production, use environment variable
const JWT_SECRET = process.env.JWT_SECRET || JWT_DEFAULTS.SECRET
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || JWT_DEFAULTS.EXPIRES_IN

/**
 * Generate JWT token
 */
function generateToken(userId, role) {
  return jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
}

/**
 * Set JWT cookie
 */
function setTokenCookie(res, token) {
  res.cookie(COOKIE_CONFIG.NAME, token, {
    httpOnly: COOKIE_CONFIG.HTTP_ONLY,
    secure: process.env.NODE_ENV === NODE_ENVIRONMENTS.PRODUCTION,
    sameSite: COOKIE_CONFIG.SAME_SITE,
    maxAge: COOKIE_CONFIG.MAX_AGE,
  })
}

/**
 * Register a new user
 */
async function register(req, res) {
  try {
    const { username, email, password, role } = req.body

    // Basic validation
    if (!username || !email || !password) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json(errorResponse(MESSAGES.USERNAME_EMAIL_REQUIRED))
    }

    if (password.length < 6) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json(errorResponse(MESSAGES.PASSWORD_MIN_LENGTH))
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      where: {
        $or: [{ username }, { email }],
      },
    })

    if (existingUser) {
      return res.status(HTTP_STATUS.CONFLICT).json(errorResponse(MESSAGES.USERNAME_EMAIL_EXISTS))
    }

    // Create new user (password will be hashed by model hook)
    const newUser = await User.create({
      username,
      email,
      password,
      role: role || User.USER_ROLES.USER,
    })

    // Generate token
    const token = generateToken(newUser.id, newUser.role)
    setTokenCookie(res, token)

    // Return user data (without password)
    const userResponse = {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      role: newUser.role,
      roleName: newUser.getRoleName(),
      isAdmin: newUser.isAdmin(),
      createdAt: newUser.createdAt,
    }

    return res.status(HTTP_STATUS.CREATED).json(successResponse(userResponse, MESSAGES.REGISTRATION_SUCCESSFUL))
  } catch (regError) {
    console.error("Registration error:", regError)
    if (regError.name === "SequelizeValidationError") {
      const messages = regError.errors.map((e) => e.message).join(", ")
      return res.status(HTTP_STATUS.BAD_REQUEST).json(errorResponse(`Validation error: ${messages}`))
    }
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(errorResponse(MESSAGES.REGISTRATION_FAILED))
  }
};

/**
 * Login user
 */
async function login(req, res) {
  try {
    const { username, password } = req.body

    // Basic validation
    if (!username || !password) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json(errorResponse("Username and password are required"))
    }

    // Find user by username or email
    const user = await User.findOne({
      where: {
        [Op.or]: [{ username }, { email: username }],
      },
    })

    if (!user) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json(errorResponse(MESSAGES.INVALID_CREDENTIALS))
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password)
    if (!isPasswordValid) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json(errorResponse(MESSAGES.INVALID_CREDENTIALS))
    }

    // Generate token
    const token = generateToken(user.id, user.role)
    setTokenCookie(res, token)

    // Return user data (without password)
    const userResponse = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      roleName: user.getRoleName(),
      isAdmin: user.isAdmin(),
      createdAt: user.createdAt,
    }

    return res.json(successResponse(userResponse, MESSAGES.LOGIN_SUCCESSFUL))
  } catch (loginError) {
    console.error("Login error:", loginError)
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(errorResponse(MESSAGES.LOGIN_FAILED))
  }
};

/**
 * Logout user
 */
async function logout(req, res) {
  try {
    // Clear the token cookie
    res.clearCookie(COOKIE_CONFIG.NAME, {
      httpOnly: COOKIE_CONFIG.HTTP_ONLY,
      secure: process.env.NODE_ENV === NODE_ENVIRONMENTS.PRODUCTION,
      sameSite: COOKIE_CONFIG.SAME_SITE,
    })

    return res.json(successResponse(null, MESSAGES.LOGOUT_SUCCESSFUL))
  } catch (logoutError) {
    console.error("Logout error:", logoutError)
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(errorResponse("Logout failed"))
  }
};

/**
 * Get current user info
 */
async function me(req, res) {
  try {
    const user = req.user // Set by auth middleware

    const userResponse = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      roleName: user.getRoleName(),
      isAdmin: user.isAdmin(),
      createdAt: user.createdAt,
    }

    return res.json(successResponse(userResponse, MESSAGES.USER_DATA_RETRIEVED))
  } catch (getUserError) {
    console.error("Get user error:", getUserError)
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(errorResponse(MESSAGES.FAILED_GET_USER_DATA))
  }
};

module.exports = {
  register,
  login,
  logout,
  me,
  generateToken,
}
