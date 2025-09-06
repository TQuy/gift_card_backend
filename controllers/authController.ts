import jwt, { SignOptions } from "jsonwebtoken";
import { Op } from "sequelize";
import { Request, Response } from "express";
import { User } from "@/models";
import { successResponse, errorResponse } from "@/utils/responseHelpers";
import {
  JWT_DEFAULTS,
  COOKIE_CONFIG,
  NODE_ENVIRONMENTS,
  HTTP_STATUS
} from "@/config/constants";
import { USER_ROLES } from "@/models/role/Role";

// JWT secret - in production, use environment variable
const JWT_SECRET: string = process.env.JWT_SECRET || JWT_DEFAULTS.SECRET;
const JWT_EXPIRES_IN: string = process.env.JWT_EXPIRES_IN || JWT_DEFAULTS.EXPIRES_IN;

/**
 * Generate JWT token with user information
 */
function generateToken(user: any): string {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
  };

  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN } as SignOptions);
}

/**
 * Set JWT cookie
 */
function setTokenCookie(res: Response, token: string): void {
  res.cookie(COOKIE_CONFIG.NAME, token, {
    httpOnly: COOKIE_CONFIG.HTTP_ONLY,
    secure: process.env.NODE_ENV === NODE_ENVIRONMENTS.PRODUCTION,
    sameSite: COOKIE_CONFIG.SAME_SITE as "strict",
    maxAge: COOKIE_CONFIG.MAX_AGE,
  });
}

/**
 * Register a new user
 */
export async function register(req: Request, res: Response): Promise<Response> {
  try {
    const { username, email, password, role } = req.body

    // Basic validation
    if (!username || !email || !password) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json(errorResponse("Username, email, and password are required"))
    }

    if (password.length < 6) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json(errorResponse("Password must be at least 6 characters long"))
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      where: {
        $or: [{ username }, { email }],
      },
    })

    if (existingUser) {
      return res.status(HTTP_STATUS.CONFLICT).json(errorResponse("Username or email already exists"))
    }

    // Create new user (password will be hashed by model hook)
    const newUser = await User.create({
      username,
      email,
      password,
      role: role || USER_ROLES.USER,
    })

    // Generate token
    const token = generateToken(newUser);
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

    return res.status(HTTP_STATUS.CREATED).json(successResponse(userResponse, "User registered successfully"))
  } catch (regError: any) {
    console.error("Registration error:", regError)
    if (regError.name === "SequelizeValidationError") {
      const messages = regError.errors.map((e: any) => e.message).join(", ")
      return res.status(HTTP_STATUS.BAD_REQUEST).json(errorResponse(`Validation error: ${messages}`))
    }
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(errorResponse("Registration failed"))
  }
};

/**
 * Login user
 */
export async function login(req: Request, res: Response): Promise<Response> {
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
      return res.status(HTTP_STATUS.UNAUTHORIZED).json(errorResponse("Invalid credentials"))
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password)
    if (!isPasswordValid) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json(errorResponse("Invalid credentials"))
    }

    // Generate token
    const token = generateToken(user);
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

    return res.json(successResponse(userResponse, "Login successful"))
  } catch (loginError) {
    console.error("Login error:", loginError)
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(errorResponse("Login failed"))
  }
};

/**
 * Logout user
 */
export async function logout(req: Request, res: Response): Promise<Response> {
  try {
    // Clear the token cookie
    res.clearCookie(COOKIE_CONFIG.NAME, {
      httpOnly: COOKIE_CONFIG.HTTP_ONLY,
      secure: process.env.NODE_ENV === NODE_ENVIRONMENTS.PRODUCTION,
      sameSite: COOKIE_CONFIG.SAME_SITE,
    })

    return res.json(successResponse(null, "Logout successful"))
  } catch (logoutError) {
    console.error("Logout error:", logoutError)
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(errorResponse("Logout failed"))
  }
};

/**
 * Get user profile (protected route)
 */
export async function me(req: Request, res: Response): Promise<Response> {
  try {
    const user = req.user // Set by auth middleware

    if (!user) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json(errorResponse("User not authenticated"));
    }

    const userResponse = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      roleName: user.getRoleName(),
      isAdmin: user.isAdmin(),
      createdAt: user.createdAt,
    }

    return res.json(successResponse(userResponse, "User data retrieved successfully"))
  } catch (getUserError) {
    console.error("Get user error:", getUserError)
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(errorResponse("Failed to get user data"))
  }
};

module.exports = {
  register,
  login,
  logout,
  me,
  generateToken,
}
