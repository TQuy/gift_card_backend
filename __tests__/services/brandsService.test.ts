import {
  transformBrandData,
  transformBrandsData,
  calculatePagination,
  getAllActiveBrands,
  getBrandById,
  brandExists,
} from "../../services/brands";
import { BrandData } from "../../services/brands/types";
import { Brand, initializeTestDatabase } from "../../models";

// Set test environment
process.env.NODE_ENV = "test";

describe("Brands Service", () => {
  // Set up test database
  beforeAll(async () => {
    await initializeTestDatabase();
  });

  describe("Pure Functions", () => {
    describe("transformBrandData", () => {
      it("should transform brand data with active status", () => {
        const brandData: BrandData = {
          id: 1,
          name: "Test Brand",
          description: "Test Description",
          logo: "test-logo.png",
          status: 1,
          country: "Singapore",
          phoneNumber: "+65 1234 5678",
          company: "Test Company",
          products: 5,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        const result = transformBrandData(brandData);

        expect(result).toEqual({
          id: 1,
          name: "Test Brand",
          description: "Test Description",
          logo: "test-logo.png",
          country: "Singapore",
          phoneNumber: "+65 1234 5678",
          company: "Test Company",
          products: 5,
          isActive: true,
          createdAt: brandData.createdAt,
          updatedAt: brandData.updatedAt,
        });
        expect(result).not.toHaveProperty("status");
      });

      it("should transform brand data with inactive status", () => {
        const brandData: BrandData = {
          id: 2,
          name: "Inactive Brand",
          description: "Inactive Description",
          logo: "inactive-logo.png",
          status: 0,
          country: "Malaysia",
          phoneNumber: "+60 1234 5678",
          company: "Inactive Company",
          products: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        const result = transformBrandData(brandData);

        expect(result.isActive).toBe(false);
        expect(result.name).toBe("Inactive Brand");
        expect(result).not.toHaveProperty("status");
      });
    });

    describe("transformBrandsData", () => {
      it("should transform multiple brands data", () => {
        const brandsData: BrandData[] = [
          {
            id: 1,
            name: "Brand 1",
            description: "Description 1",
            logo: "logo1.png",
            status: 1,
            country: "Singapore",
            phoneNumber: "+65 1234 5678",
            company: "Company 1",
            products: 3,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: 2,
            name: "Brand 2",
            description: "Description 2",
            logo: "logo2.png",
            status: 0,
            country: "Malaysia",
            phoneNumber: "+60 1234 5678",
            company: "Company 2",
            products: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ];

        const result = transformBrandsData(brandsData);

        expect(result).toHaveLength(2);
        expect(result[0].isActive).toBe(true);
        expect(result[1].isActive).toBe(false);
        expect(result[0]).not.toHaveProperty("status");
        expect(result[1]).not.toHaveProperty("status");
      });
    });

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
          expect(brand.isActive).toBe(true);
          expect(brand).not.toHaveProperty("status");
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
        expect(brand?.isActive).toBe(true);
        expect(brand).not.toHaveProperty("status");
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
