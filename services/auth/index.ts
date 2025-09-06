/**
 * Auth service main exports
 */

export * from "./types";
export * from "./authService";

// Re-export commonly used functions for convenience
export {
  generateToken,
  findUserByUsernameOrEmail,
  checkUserExists,
  createUser,
  validateUserPassword,
  transformUserResponse,
  registerUser,
  createAdminUser,
  loginUser,
  getUserById,
} from "./authService";
