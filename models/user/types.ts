import { USER_ROLES } from "../role/Role";

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

/**
 * Role interface for association
 */
export interface RoleAttributes {
  id: number;
  name: string;
  description?: string;
  status: number;
}

/**
 * User model type definitions
 */
export interface UserAttributes {
  id: number;
  username: string;
  email: string;
  password: string;
  role_id: number;
  readonly createdAt?: Date;
  readonly updatedAt?: Date;
  // Optional association - only present when included
  userRole?: RoleAttributes;
}

export interface UserCreationAttributes {
  username: string;
  email: string;
  password: string;
  role_id: number;
}
