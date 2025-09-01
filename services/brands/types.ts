/**
 * Type definitions for brands service
 */

export interface PaginationOptions {
  page: number;
  limit: number;
  offset: number;
}

export interface PaginationResult {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface BrandData {
  id: number;
  name: string;
  description: string;
  logo: string;
  status: number;
  country: string;
  phoneNumber: string;
  company: string;
  products: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface TransformedBrand extends Omit<BrandData, 'status'> {
  isActive: boolean;
}

export interface BrandsResult {
  brands: TransformedBrand[];
  pagination: PaginationResult;
}
