/**
 * TypeScript type definitions for the Gift Card API
 */

import { BRAND_STATUS } from "@/models/Brand";

// User interface (matching our Sequelize User model)
export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  role: number;
  createdAt: Date;
  updatedAt: Date;
  getRoleName(): string;
  isAdmin(): boolean;
  comparePassword(password: string): Promise<boolean>;
}

// Extend Express Request interface to include user data
declare global {
  namespace Express {
    interface Request {
      user?: User;
      userId?: number;
      userRole?: number;
    }
  }
}

// User role types
export enum UserRole {
  ADMIN = 1,
  USER = 2
}

// API Response types
export interface ApiResponse<T = any> {
  status: 'success' | 'error';
  data?: T;
  message?: string;
}

export interface PaginatedResponse<T = any> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface ErrorResponse {
  error: string;
  details?: string[];
}

// Auth types
export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  role?: UserRole;
}

export interface UserResponse {
  id: number;
  username: string;
  email: string;
  role: number;
  roleName: string;
  isAdmin: boolean;
  createdAt: Date;
}

// JWT Payload
export interface JwtPayload {
  userId: number;
  role: number;
  iat?: number;
  exp?: number;
}

// Gift Card types
export interface GiftCardRequest {
  amount: number;
  recipientEmail: string;
  recipientPhone: string;
  deliveryType: 'personal' | 'send_as_gift';
  deliveryTime: 'immediately' | 'custom';
  message?: string;
  senderName?: string;
  recipientName?: string;
  pin?: string;
  deliveryDate?: string;
  period?: 'morning' | 'afternoon' | 'evening';
}

// Brand types
export interface BrandResponse {
  id: number;
  name: string;
  description?: string;
  logo?: string;
  status: typeof BRAND_STATUS[keyof typeof BRAND_STATUS];
  country?: string;
  phoneNumber?: string;
  company?: string;
  createdAt: Date;
  updatedAt: Date;
  products?: number;
}
