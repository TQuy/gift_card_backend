/**
 * Brands service main exports
 */

export * from "./types";
export * from "./brandsService";

// Re-export commonly used functions for convenience
export {
  getAllActiveBrands,
  getBrandById,
  findAndValidateBrand,
  brandExists,
} from "./brandsService";
