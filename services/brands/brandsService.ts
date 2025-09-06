import { Brand } from "@/models";
import { PaginationOptions, BrandData, BrandsResult } from "./types";
import { BRAND_STATUS } from "@/models/brand/Brand";

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

  try {
    const { count, rows } = await Brand.findAndCountAll({
      where: { status: BRAND_STATUS.ACTIVE },
      limit: limit,
      offset: offset,
      order: [["created_at", "ASC"]],
    });

    // Transform raw data to plain objects
    const brandsData: BrandData[] = rows.map((brand: any) => brand.toJSON());

    // Calculate pagination metadata
    const { totalPages } = calculatePagination(count, page, limit);

    return {
      brands: brandsData,
      pagination: {
        page,
        limit,
        total: count,
        totalPages,
      },
    };
  } catch (error) {
    console.error("Error in getAllActiveBrands:", error);
    throw error;
  }
}

/**
 * Get a specific brand by ID
 * Pure function that returns transformed brand or null
 */
export async function getBrandById(brandId: number): Promise<BrandData | null> {
  const brand = await Brand.findOne({
    where: {
      id: brandId,
      status: BRAND_STATUS.ACTIVE,
    },
  });

  if (!brand) {
    return null;
  }

  const brandData: BrandData = (brand as any).toJSON();
  return brandData;
}

/**
 * Find and validate brand for gift card operations
 * Returns the brand if found and active, null otherwise
 */
export async function findAndValidateBrand(brandId: number): Promise<any> {
  const brand = await Brand.findOne({
    where: {
      id: brandId,
      status: BRAND_STATUS.ACTIVE,
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
