/**
 * TypeScript type definitions for the Gift Card API
 */

import { BRAND_STATUS } from "@/models/brand/Brand";

// User interface (matching our Sequelize User model)
export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  role: number; // Foreign key to Role table
  createdAt: Date;
  updatedAt: Date;
  comparePassword(password: string): Promise<boolean>;
  isAdmin(): Promise<boolean>;
}

// Role interface (matching our Sequelize Role model)
export interface Role {
  id: number;
  name: string;
  description?: string;
  status: number; // Using number status, not boolean
  createdAt: Date;
  updatedAt: Date;
}

// User with populated role relationship
export interface UserWithRole extends User {
  userRole?: Role;
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
}

export interface UserResponse {
  id: number;
  username: string;
  email: string;
  role: number;
  roleName?: string;
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
