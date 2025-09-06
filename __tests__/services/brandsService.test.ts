import {
  calculatePagination,
  getAllActiveBrands,
  getBrandById,
  brandExists,
} from "../../services/brands";
import { initializeTestDatabase } from "../../models";
import { BRAND_STATUS } from "../../models/brand/Brand";

// Set test environment
process.env.NODE_ENV = "test";

describe("Brands Service", () => {
  // Set up test database
  beforeAll(async () => {
    await initializeTestDatabase();
  });

  describe("Pure Functions", () => {

    describe("calculatePagination", () => {
      it("should calculate pagination correctly", () => {
        const result = calculatePagination(25, 1, 10);
        expect(result.totalPages).toBe(3);
      });

      it("should handle exact division", () => {
        const result = calculatePagination(30, 2, 10);
        expect(result.totalPages).toBe(3);
      });

      it("should handle single page", () => {
        const result = calculatePagination(5, 1, 10);
        expect(result.totalPages).toBe(1);
      });

      it("should handle zero results", () => {
        const result = calculatePagination(0, 1, 10);
        expect(result.totalPages).toBe(0);
      });
    });
  });

  describe("Database Operations", () => {
    describe("getAllActiveBrands", () => {
      it("should return paginated active brands", async () => {
        const paginationOptions = {
          page: 1,
          limit: 2,
          offset: 0,
        };

        const result = await getAllActiveBrands(paginationOptions);

        expect(result).toHaveProperty("brands");
        expect(result).toHaveProperty("pagination");
        expect(Array.isArray(result.brands)).toBe(true);
        expect(result.brands.length).toBeLessThanOrEqual(2);
        expect(result.pagination.page).toBe(1);
        expect(result.pagination.limit).toBe(2);
        expect(result.pagination).toHaveProperty("total");
        expect(result.pagination).toHaveProperty("totalPages");

        // Check that all returned brands are active
        result.brands.forEach((brand) => {
          expect(brand.status).toBe(BRAND_STATUS.ACTIVE);
          expect(brand).not.toHaveProperty("isActive");
        });
      });

      it("should handle second page correctly", async () => {
        const paginationOptions = {
          page: 2,
          limit: 2,
          offset: 2,
        };

        const result = await getAllActiveBrands(paginationOptions);

        expect(result.pagination.page).toBe(2);
        expect(result.pagination.limit).toBe(2);
      });
    });

    describe("getBrandById", () => {
      it("should return a brand by ID", async () => {
        const brand = await getBrandById(1);

        expect(brand).toBeTruthy();
        expect(brand?.id).toBe(1);
        expect(brand?.status).toBe(BRAND_STATUS.ACTIVE);
      });

      it("should return null for non-existent brand", async () => {
        const brand = await getBrandById(999);

        expect(brand).toBeNull();
      });
    });

    describe("brandExists", () => {
      it("should return true for existing brand", async () => {
        const exists = await brandExists(1);
        expect(exists).toBe(true);
      });

      it("should return false for non-existent brand", async () => {
        const exists = await brandExists(999);
        expect(exists).toBe(false);
      });
    });
  });
});
