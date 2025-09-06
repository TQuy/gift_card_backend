import jwt, { SignOptions } from "jsonwebtoken";
import { Op } from "sequelize";
import { User, Role } from "../../models";
import { USER_ROLES } from "../../models/role/Role";
import {
  JWT_DEFAULTS,
} from "../../config/constants";
import { RegisterInput, LoginInput, UserWithRole, TokenPayload } from "./types";

// JWT secret - in production, use environment variable
const JWT_SECRET: string = process.env.JWT_SECRET || JWT_DEFAULTS.SECRET;
const JWT_EXPIRES_IN: string = process.env.JWT_EXPIRES_IN || JWT_DEFAULTS.EXPIRES_IN;

/**
 * Generate JWT token with user information
 */
export function generateToken(user: any): string {
  const payload: TokenPayload = {
    id: user.id,
    email: user.email,
    role: user.role_id, // Use correct field name
  };

  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN } as SignOptions);
}

/**
 * Find user by username or email
 */
export async function findUserByUsernameOrEmail(identifier: string): Promise<any> {
  return await User.findOne({
    where: {
      [Op.or]: [
        { username: identifier },
        { email: identifier }
      ],
    },
    include: [{
      model: Role,
      as: 'userRole'
    }]
  });
}

/**
 * Check if user exists by username or email
 */
export async function checkUserExists(username: string, email: string): Promise<boolean> {
  const existingUser = await User.findOne({
    where: {
      [Op.or]: [
        { username: username },
        { email: email }
      ],
    },
  });

  return !!existingUser;
}

/**
 * Create a new user with role
 */
export async function createUser(userData: RegisterInput): Promise<any> {
  // Get default USER role if no role specified
  let roleId = userData.role;

  if (!roleId) {
    const userRole = await Role.findOne({ where: { name: USER_ROLES.USER } });
    roleId = userRole?.id || 2; // Fallback to ID 2 if not found
  }

  const newUser = await User.create({
    username: userData.username,
    email: userData.email,
    password: userData.password,
    role_id: roleId, // Use correct field name
  });

  // Fetch user with role information
  return await User.findByPk(newUser.id, {
    include: [{
      model: Role,
      as: 'userRole'
    }]
  });
}

/**
 * Validate password for user
 */
export async function validateUserPassword(user: any, password: string): Promise<boolean> {
  return await user.comparePassword(password);
}

/**
 * Transform user data for response
 */
export function transformUserResponse(user: any): UserWithRole {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    role_id: user.role_id,
    roleName: user.userRole?.name || 'UNKNOWN',
    isAdmin: user.userRole?.name === USER_ROLES.ADMIN,
    createdAt: user.createdAt,
  };
}

/**
 * Register a new user (business logic)
 */
export async function registerUser(userData: RegisterInput): Promise<UserWithRole> {
  // Validate input
  if (!userData.username || !userData.email || !userData.password) {
    throw new Error('Username, email, and password are required');
  }

  if (userData.password.length < 6) {
    throw new Error('Password must be at least 6 characters long');
  }

  // Check if user exists
  const userExists = await checkUserExists(userData.username, userData.email);
  if (userExists) {
    throw new Error('Username or email already exists');
  }

  // Create user
  const newUser = await createUser(userData);

  // Transform and return
  return transformUserResponse(newUser);
}

/**
 * Login user (business logic)
 */
export async function loginUser(credentials: LoginInput): Promise<UserWithRole> {
  // Validate input
  if (!credentials.username || !credentials.password) {
    throw new Error('Username and password are required');
  }

  // Find user
  const user = await findUserByUsernameOrEmail(credentials.username);
  if (!user) {
    throw new Error('Invalid credentials');
  }

  // Validate password
  const isPasswordValid = await validateUserPassword(user, credentials.password);
  if (!isPasswordValid) {
    throw new Error('Invalid credentials');
  }

  // Transform and return
  return transformUserResponse(user);
}

/**
 * Get user by ID with role information
 */
export async function getUserById(userId: number): Promise<UserWithRole | null> {
  const user = await User.findByPk(userId, {
    include: [{
      model: Role,
      as: 'userRole'
    }]
  });

  if (!user) {
    return null;
  }

  return transformUserResponse(user);
}
