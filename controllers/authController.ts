import { Request, Response } from "express";
import { successResponse, errorResponse } from "../utils/responseHelpers";
import {
  COOKIE_CONFIG,
  NODE_ENVIRONMENTS,
  HTTP_STATUS
} from "../config/constants";
import {
  generateToken,
  registerUser,
  loginUser,
  getUserById,
} from "../services/auth";

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
async function register(req: Request, res: Response): Promise<Response> {
  try {
    const { username, email, password } = req.body;

    // Use service layer for registration (role defaults to 'user' in service)
    // Public registration endpoint always creates users with default 'user' role
    const user = await registerUser({
      username,
      email,
      password,
      // No role specified - will default to 'user' role in service
    });

    // Generate token
    const token = generateToken(user);
    setTokenCookie(res, token);

    return res.status(HTTP_STATUS.CREATED).json(
      successResponse(user, "User registered successfully")
    );
  } catch (regError: any) {
    console.error("Registration error:", regError);

    if (regError.message === "Username, email, and password are required") {
      return res.status(HTTP_STATUS.BAD_REQUEST).json(errorResponse(regError.message));
    }

    if (regError.message === "Password must be at least 6 characters long") {
      return res.status(HTTP_STATUS.BAD_REQUEST).json(errorResponse(regError.message));
    }

    if (regError.message === "Username or email already exists") {
      return res.status(HTTP_STATUS.BAD_REQUEST).json(errorResponse(regError.message));
    }

    if (regError.name === "SequelizeValidationError") {
      const messages = regError.errors.map(function (e: any) {
        return e.message;
      }).join(", ");
      return res.status(HTTP_STATUS.BAD_REQUEST).json(errorResponse(`Validation error: ${messages}`));
    }

    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(errorResponse("Registration failed"));
  }
}

/**
 * Login user
 */
async function login(req: Request, res: Response): Promise<Response> {
  try {
    const { username, email, password } = req.body;

    // Use service layer for login (accepts either username or email)
    const user = await loginUser({
      username: username || email, // Use username if provided, otherwise use email
      password,
    });

    // Generate token
    const token = generateToken(user);
    setTokenCookie(res, token);

    return res.json(successResponse(user, "Login successful"));
  } catch (loginError: any) {
    console.error("Login error:", loginError);

    if (loginError.message === "Username and password are required") {
      return res.status(HTTP_STATUS.BAD_REQUEST).json(errorResponse("Email and password are required"));
    }

    if (loginError.message === "Invalid credentials") {
      return res.status(HTTP_STATUS.BAD_REQUEST).json(errorResponse(loginError.message));
    }

    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(errorResponse("Login failed"));
  }
}

/**
 * Logout user
 */
async function logout(req: Request, res: Response): Promise<Response> {
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
async function me(req: Request, res: Response): Promise<Response> {
  try {
    const userId = (req as any).userId; // Set by auth middleware

    if (!userId) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json(errorResponse("User not authenticated"));
    }

    // Use service layer to get user
    const user = await getUserById(userId);

    if (!user) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json(errorResponse("User not found"));
    }

    return res.json(successResponse(user, "User data retrieved successfully"));
  } catch (getUserError) {
    console.error("Get user error:", getUserError);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(errorResponse("Failed to get user data"));
  }
}

export {
  register,
  login,
  logout,
  me,
};
