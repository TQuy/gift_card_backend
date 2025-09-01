import request from "supertest";
import { app } from "../server";
import { Brand, GiftCard, initializeTestDatabase } from "../models";
import {
  getAllActiveBrands,
  getBrandById as getBrandByIdService,
  brandExists
} from "../services/brands";

// Set test environment
process.env.NODE_ENV = "test";

describe("Gift Card API", () => {
  // Set up test database
  beforeAll(async () => {
    await initializeTestDatabase();
  });

  // Clean up after each test
  afterEach(async () => {
    await GiftCard.destroy({ where: {} });
  });

  describe("GET /api/health", () => {
    it("should return health status", async () => {
      const res = await request(app).get("/api/health").expect(200);
      expect(res.body.status).toBe("OK");
      expect(res.body.message).toBe("Gift Card API is running");
    });
  });

  describe("GET /api/brands", () => {
    it("should return all brands with pagination", async () => {
      const res = await request(app).get("/api/brands").expect(200);

      // Get expected data from service
      const expectedData = await getAllActiveBrands({
        page: 1,
        limit: 10,
        offset: 0,
      });

      expect(res.body.status).toBe("success");
      expect(res.body.data).toBeInstanceOf(Array);
      expect(res.body.pagination).toBeDefined();
      expect(res.body.data.length).toBeGreaterThan(0);

      // Validate structure matches service response
      expect(res.body.data.length).toBe(expectedData.brands.length);
      expect(res.body.pagination.total).toBe(expectedData.pagination.total);

      // Check that each brand has the required fields including isActive
      res.body.data.forEach((brand: any, index: number) => {
        const expectedBrand = expectedData.brands[index];
        expect(brand).toHaveProperty("id", expectedBrand.id);
        expect(brand).toHaveProperty("name", expectedBrand.name);
        expect(brand).toHaveProperty("description");
        expect(brand).toHaveProperty("logo");
        expect(brand).toHaveProperty("isActive", true); // Since we only return active brands
        expect(brand).toHaveProperty("country");
        expect(brand).toHaveProperty("phoneNumber");
        expect(brand).toHaveProperty("company");
        expect(brand).toHaveProperty("products");
      });
    });

    it("should support pagination parameters", async () => {
      // Get expected data from service
      const expectedData = await getAllActiveBrands({
        page: 1,
        limit: 2,
        offset: 0,
      });

      const res = await request(app)
        .get("/api/brands?page=1&limit=2")
        .expect(200);

      expect(res.body.status).toBe("success");
      expect(res.body.data).toBeInstanceOf(Array);
      expect(res.body.data.length).toBeLessThanOrEqual(2);
      expect(res.body.data.length).toBe(expectedData.brands.length);
      expect(res.body.pagination.page).toBe(1);
      expect(res.body.pagination.limit).toBe(2);
    });

    it("should handle page 2 correctly", async () => {
      // Get expected data from service
      const expectedData = await getAllActiveBrands({
        page: 2,
        limit: 2,
        offset: 2,
      });

      const res = await request(app)
        .get("/api/brands?page=2&limit=2")
        .expect(200);

      expect(res.body.status).toBe("success");
      expect(res.body.pagination.page).toBe(2);
      expect(res.body.pagination.limit).toBe(2);
      // Validate data matches service response
      expect(res.body.data.length).toBe(expectedData.brands.length);
    });
  });

  describe("GET /api/brands/:id", () => {
    it("should return specific brand", async () => {
      // Get expected data from service
      const expectedBrand = await getBrandByIdService(1);

      const res = await request(app).get("/api/brands/1").expect(200);

      expect(res.body.status).toBe("success");
      expect(res.body.data).toHaveProperty("id", 1);
      expect(res.body.data).toHaveProperty("name", expectedBrand?.name);
      expect(res.body.data).toHaveProperty("isActive", true);

      // Validate all properties match service response
      if (expectedBrand) {
        expect(res.body.data.name).toBe(expectedBrand.name);
        expect(res.body.data.description).toBe(expectedBrand.description);
        expect(res.body.data.company).toBe(expectedBrand.company);
      }
    });

    it("should return 404 for non-existent brand", async () => {
      // Verify brand doesn't exist using service
      const exists = await brandExists(999);
      expect(exists).toBe(false);

      const res = await request(app).get("/api/brands/999").expect(404);
      expect(res.body.error).toBe("Brand not found");
    });

    it("should return 400 for invalid brand ID", async () => {
      const res = await request(app).get("/api/brands/invalid").expect(400);

      expect(res.body.error).toBe("Invalid brand ID format");
    });
  });

  describe("POST /api/brands/:id/issues", () => {
    it("should successfully issue a gift card", async () => {
      const giftCardData = {
        amount: 100,
        recipientEmail: "recipient@example.com",
        recipientPhone: "+6512345678",
        senderName: "John Doe",
        recipientName: "Jane Smith",
        message: "Happy Birthday!",
        pin: "1234",
        deliveryType: "send_as_gift",
        deliveryTime: "custom",
        deliveryDate: "2025-12-25",
        period: "afternoon",
      };

      const res = await request(app)
        .post("/api/brands/1/issues")
        .send(giftCardData)
        .expect(201);

      expect(res.body.status).toBe("success");
      expect(res.body.message).toBe("Gift card issued successfully");
      expect(res.body.data).toHaveProperty("id");
      expect(res.body.data.amount).toBe(giftCardData.amount);
      expect(res.body.data.recipientEmail).toBe(giftCardData.recipientEmail);
    });

    it("should require valid amount", async () => {
      const invalidData = {
        amount: -10, // Invalid amount
        recipientEmail: "recipient@example.com",
        recipientPhone: "+6512345678",
        deliveryType: "personal",
        deliveryTime: "immediately",
      };

      const res = await request(app)
        .post("/api/brands/1/issues")
        .send(invalidData)
        .expect(400);

      expect(res.body.error).toBe("Valid amount is required");
    });
  });

  describe("GET /api/brands/:id/issues", () => {
    beforeEach(async () => {
      // Issue a test gift card
      await request(app).post("/api/brands/1/issues").send({
        amount: 50,
        recipientEmail: "test@example.com",
        recipientPhone: "+6512345678",
        message: "Test card",
        deliveryType: "personal",
        deliveryTime: "immediately",
      });
    });

    it("should return issued cards for a brand with pagination", async () => {
      const res = await request(app).get("/api/brands/1/issues").expect(200);

      expect(res.body.status).toBe("success");
      expect(res.body.data).toBeInstanceOf(Array);
      expect(res.body.data.length).toBeGreaterThan(0);
      expect(res.body.pagination).toBeDefined();
    });
  });

  describe("404 handler", () => {
    it("should return 404 for unknown routes", async () => {
      const res = await request(app).get("/api/unknown").expect(404);
      expect(res.body.error).toBe("Route not found");
    });
  });
});
