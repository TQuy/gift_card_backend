import { ROLE_STATUS, USER_ROLES } from "./Role"

export type RoleStatus = typeof ROLE_STATUS[keyof typeof ROLE_STATUS]
export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES]

// Role interface for database attributes
export interface RoleAttributes {
  id: number;
  name: string;
  description?: string;
  status: number;
  createdAt?: Date;
  updatedAt?: Date;
}

// Role creation interface (excludes auto-generated fields)
export interface RoleCreationAttributes {
  name: string;
  description?: string;
  status?: number;
}
