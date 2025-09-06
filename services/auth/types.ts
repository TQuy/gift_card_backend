/**
 * Auth service type definitions
 */

export interface RegisterInput {
  username: string;
  email: string;
  password: string;
  role?: number;
}

export interface LoginInput {
  username: string;
  password: string;
}

export interface UserWithRole {
  id: number;
  username: string;
  email: string;
  role_id: number;
  roleName: string;
  isAdmin: boolean;
  createdAt: Date;
}

export interface AuthToken {
  token: string;
  user: UserWithRole;
}

export interface TokenPayload {
  id: number;
  email: string;
  role: number;
  iat?: number;
  exp?: number;
}
