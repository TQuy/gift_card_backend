import { Brand } from "@/models";
import { PaginationOptions, BrandData, TransformedBrand, BrandsResult } from "./types";

/**
 * Transform a single brand by adding isActive field based on status
 */
export function transformBrandData(brandData: BrandData): TransformedBrand {
  const { status, ...rest } = brandData;
  return {
    ...rest,
    isActive: status === 1,
  };
}

/**
 * Transform multiple brands data
 */
export function transformBrandsData(brands: BrandData[]): TransformedBrand[] {
  return brands.map(transformBrandData);
}

/**
 * Calculate pagination metadata
 */
export function calculatePagination(
  total: number,
  page: number,
  limit: number
): { totalPages: number } {
  return {
    totalPages: Math.ceil(total / limit),
  };
}

/**
 * Get all active brands with pagination
 * Pure function that interacts with database
 */
export async function getAllActiveBrands(
  paginationOptions: PaginationOptions
): Promise<BrandsResult> {
  const { page, limit, offset } = paginationOptions;

  const { count, rows } = await Brand.findAndCountAll({
    where: { status: 1 },
    limit: limit,
    offset: offset,
    order: [["createdAt", "ASC"]],
  });

  // Transform raw data to plain objects
  const brandsData: BrandData[] = rows.map((brand: any) => brand.toJSON());

  // Transform brands to include isActive field
  const transformedBrands = transformBrandsData(brandsData);

  // Calculate pagination metadata
  const { totalPages } = calculatePagination(count, page, limit);

  return {
    brands: transformedBrands,
    pagination: {
      page,
      limit,
      total: count,
      totalPages,
    },
  };
}

/**
 * Get a specific brand by ID
 * Pure function that returns transformed brand or null
 */
export async function getBrandById(brandId: number): Promise<TransformedBrand | null> {
  const brand = await Brand.findOne({
    where: {
      id: brandId,
      status: 1,
    },
  });

  if (!brand) {
    return null;
  }

  const brandData: BrandData = (brand as any).toJSON();
  return transformBrandData(brandData);
}

/**
 * Find and validate brand for gift card operations
 * Returns the brand if found and active, null otherwise
 */
export async function findAndValidateBrand(brandId: number): Promise<any> {
  const brand = await Brand.findOne({
    where: {
      id: brandId,
      status: 1,
    },
  });

  return brand;
}

/**
 * Check if a brand exists by ID (for validation purposes)
 */
export async function brandExists(brandId: number): Promise<boolean> {
  const brand = await getBrandById(brandId);
  return brand !== null;
}
