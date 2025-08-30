const request = require("supertest");
const { app } = require("../server");
const { Brand, GiftCard, initializeDatabase } = require("../models");

// Set test environment
process.env.NODE_ENV = 'test';

describe("Gift Card API", () => {
  // Set up test database
  beforeAll(async () => {
    await initializeDatabase();
    
    // Seed test brands
    await Brand.bulkCreate([
      {
        name: "Lazada",
        description: "Online shopping platform",
        logo: "lazada-logo.png",
        isActive: true,
      },
      {
        name: "Grab",
        description: "Southeast Asian super app",
        logo: "grab-logo.png",
        isActive: true,
      },
      {
        name: "Amazon",
        description: "Global e-commerce and cloud computing",
        logo: "amazon-logo.png",
        isActive: true,
      },
      {
        name: "Subway",
        description: "Fast food restaurant chain",
        logo: "subway-logo.png",
        isActive: true,
      },
      {
        name: "Esprit",
        description: "Fashion and lifestyle brand",
        logo: "esprit-logo.png",
        isActive: true,
      },
    ]);
  });

  // Clean up after each test
  afterEach(async () => {
    await GiftCard.destroy({ where: {} });
  });
  describe("GET /api/health", () => {
    it("should return health status", async () => {
      const res = await request(app).get("/api/health").expect(200);

      expect(res.body).toEqual({
        status: "OK",
        message: "Gift Card API is running",
      });
    });
  });

  describe("GET /api/brands", () => {
    it("should return all brands with pagination", async () => {
      const res = await request(app).get("/api/brands").expect(200);

      expect(res.body.status).toBe("success");
      expect(res.body.data).toHaveLength(5);
      expect(res.body.pagination).toMatchObject({
        page: 1,
        limit: 10,
        total: 5,
        totalPages: 1,
        hasNext: false,
        hasPrev: false,
      });

      // Check if all required brands are present
      const brandNames = res.body.data.map((brand) => brand.name);
      expect(brandNames).toEqual(
        expect.arrayContaining(["Lazada", "Grab", "Amazon", "Subway", "Esprit"])
      );
    });

    it("should support pagination parameters", async () => {
      const res = await request(app)
        .get("/api/brands?page=1&limit=2")
        .expect(200);

      expect(res.body.data).toHaveLength(2);
      expect(res.body.pagination).toMatchObject({
        page: 1,
        limit: 2,
        total: 5,
        totalPages: 3,
        hasNext: true,
        hasPrev: false,
      });
    });

    it("should handle page 2 correctly", async () => {
      const res = await request(app)
        .get("/api/brands?page=2&limit=2")
        .expect(200);

      expect(res.body.data).toHaveLength(2);
      expect(res.body.pagination).toMatchObject({
        page: 2,
        limit: 2,
        total: 5,
        totalPages: 3,
        hasNext: true,
        hasPrev: true,
      });
    });
  });

  describe("GET /api/brands/:id", () => {
    it("should return specific brand", async () => {
      const res = await request(app).get("/api/brands/1").expect(200);

      expect(res.body.status).toBe("success");
      expect(res.body.data).toMatchObject({
        id: 1,
        name: "Lazada",
        description: "Online shopping platform",
        logo: "lazada-logo.png",
        isActive: true,
      });
      expect(res.body.data.createdAt).toBeDefined();
    });

    it("should return 404 for non-existent brand", async () => {
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
        senderName: "John Doe",
        recipientName: "Jane Smith",
        recipientEmail: "jane@example.com",
        recipientPhone: "+6591234567",
        message: "Happy Birthday!",
        pin: "1234",
        deliveryType: "send_as_gift",
        deliveryTime: "custom",
        deliveryDate: "2025-12-25",
        period: "afternoon"
      };

      const res = await request(app)
        .post("/api/brands/1/issues")
        .send(giftCardData)
        .expect(201);

      expect(res.body.status).toBe("success");
      expect(res.body.message).toBe("Gift card issued successfully");
      expect(res.body.data).toMatchObject({
        brandName: "Lazada",
        amount: 100,
        senderName: "John Doe",
        recipientName: "Jane Smith",
        recipientEmail: "jane@example.com",
        recipientPhone: "+6591234567",
        message: "Happy Birthday!",
        deliveryType: "send_as_gift",
        deliveryTime: "custom",
        deliveryDate: "2025-12-25",
        period: "afternoon"
      });
      expect(res.body.data.id).toBeDefined();
      expect(res.body.data.activationCode).toBeDefined();
      expect(res.body.data.issuedAt).toBeDefined();
    });

    it("should successfully issue a gift card with personal delivery (no names required)", async () => {
      const giftCardData = {
        amount: 75,
        recipientEmail: "alice@example.com",
        recipientPhone: "+6591111111",
        message: "Enjoy!",
        deliveryType: "personal",
        deliveryTime: "immediately"
      };

      const res = await request(app)
        .post("/api/brands/1/issues")
        .send(giftCardData)
        .expect(201);

      expect(res.body.status).toBe("success");
      expect(res.body.data).toMatchObject({
        amount: 75,
        recipientEmail: "alice@example.com",
        recipientPhone: "+6591111111",
        message: "Enjoy!",
        deliveryType: "personal",
        deliveryTime: "immediately"
      });
      // Optional fields should not be present in response
      expect(res.body.data).not.toHaveProperty('senderName');
      expect(res.body.data).not.toHaveProperty('recipientName');
      expect(res.body.data).not.toHaveProperty('deliveryDate');
      expect(res.body.data).not.toHaveProperty('period');
    });

    it("should not require delivery date and period for immediate delivery", async () => {
      const validData = {
        amount: 100,
        recipientEmail: "test@example.com",
        recipientPhone: "+6591234567",
        deliveryType: "personal",
        deliveryTime: "immediately"
      };

      const res = await request(app)
        .post("/api/brands/1/issues")
        .send(validData)
        .expect(201);

      expect(res.body.status).toBe("success");
      expect(res.body.data).not.toHaveProperty('deliveryDate');
      expect(res.body.data).not.toHaveProperty('period');
    });

    it("should require valid amount", async () => {
      const invalidData = {
        amount: -10,
        senderName: "John Doe",
        recipientName: "Jane Smith",
        recipientEmail: "jane@example.com",
        recipientPhone: "+6591234567",
        deliveryType: "personal",
        deliveryTime: "immediately"
      };

      const res = await request(app)
        .post("/api/brands/1/issues")
        .send(invalidData)
        .expect(400);

      expect(res.body.error).toBe("Valid amount is required");
    });

    it("should not require sender name for personal delivery", async () => {
      const validData = {
        amount: 100,
        recipientEmail: "jane@example.com",
        recipientPhone: "+6591234567",
        deliveryType: "personal",
        deliveryTime: "immediately"
      };

      const res = await request(app)
        .post("/api/brands/1/issues")
        .send(validData)
        .expect(201);

      expect(res.body.status).toBe("success");
    });

    it("should not require recipient name for personal delivery", async () => {
      const validData = {
        amount: 100,
        recipientEmail: "jane@example.com",
        recipientPhone: "+6591234567",
        deliveryType: "personal",
        deliveryTime: "immediately"
      };

      const res = await request(app)
        .post("/api/brands/1/issues")
        .send(validData)
        .expect(201);

      expect(res.body.status).toBe("success");
    });

    it("should require sender name when delivery type is send_as_gift", async () => {
      const invalidData = {
        amount: 100,
        recipientName: "Jane Smith",
        recipientEmail: "jane@example.com",
        recipientPhone: "+6591234567",
        deliveryType: "send_as_gift",
        deliveryTime: "immediately"
      };

      const res = await request(app)
        .post("/api/brands/1/issues")
        .send(invalidData)
        .expect(400);

      expect(res.body.error).toBe("Sender name is required when delivery type is send_as_gift");
    });

    it("should require recipient name when delivery type is send_as_gift", async () => {
      const invalidData = {
        amount: 100,
        senderName: "John Doe",
        recipientEmail: "jane@example.com",
        recipientPhone: "+6591234567",
        deliveryType: "send_as_gift",
        deliveryTime: "immediately"
      };

      const res = await request(app)
        .post("/api/brands/1/issues")
        .send(invalidData)
        .expect(400);

      expect(res.body.error).toBe("Recipient name is required when delivery type is send_as_gift");
    });

    it("should require recipient email", async () => {
      const invalidData = {
        amount: 100,
        senderName: "John Doe",
        recipientName: "Jane Smith",
        recipientPhone: "+6591234567",
        deliveryType: "personal",
        deliveryTime: "immediately"
      };

      const res = await request(app)
        .post("/api/brands/1/issues")
        .send(invalidData)
        .expect(400);

      expect(res.body.error).toBe("Recipient email is required");
    });

    it("should require recipient phone", async () => {
      const invalidData = {
        amount: 100,
        senderName: "John Doe",
        recipientName: "Jane Smith",
        recipientEmail: "jane@example.com",
        deliveryType: "personal",
        deliveryTime: "immediately"
      };

      const res = await request(app)
        .post("/api/brands/1/issues")
        .send(invalidData)
        .expect(400);

      expect(res.body.error).toBe("Recipient phone is required");
    });

    it("should require valid delivery type", async () => {
      const invalidData = {
        amount: 100,
        senderName: "John Doe",
        recipientName: "Jane Smith",
        recipientEmail: "jane@example.com",
        recipientPhone: "+6591234567",
        deliveryType: "invalid_type",
        deliveryTime: "immediately"
      };

      const res = await request(app)
        .post("/api/brands/1/issues")
        .send(invalidData)
        .expect(400);

      expect(res.body.error).toBe("Valid delivery type is required (personal or send_as_gift)");
    });

    it("should require valid delivery time", async () => {
      const invalidData = {
        amount: 100,
        senderName: "John Doe",
        recipientName: "Jane Smith",
        recipientEmail: "jane@example.com",
        recipientPhone: "+6591234567",
        deliveryType: "personal",
        deliveryTime: "invalid_time"
      };

      const res = await request(app)
        .post("/api/brands/1/issues")
        .send(invalidData)
        .expect(400);

      expect(res.body.error).toBe("Valid delivery time is required (immediately or custom)");
    });

    it("should require delivery date for custom delivery time", async () => {
      const invalidData = {
        amount: 100,
        senderName: "John Doe",
        recipientName: "Jane Smith",
        recipientEmail: "jane@example.com",
        recipientPhone: "+6591234567",
        deliveryType: "personal",
        deliveryTime: "custom"
      };

      const res = await request(app)
        .post("/api/brands/1/issues")
        .send(invalidData)
        .expect(400);

      expect(res.body.error).toBe("Delivery date is required when delivery time is custom");
    });

    it("should require valid period for custom delivery time", async () => {
      const invalidData = {
        amount: 100,
        senderName: "John Doe",
        recipientName: "Jane Smith",
        recipientEmail: "jane@example.com",
        recipientPhone: "+6591234567",
        deliveryType: "personal",
        deliveryTime: "custom",
        deliveryDate: "2025-12-25",
        period: "invalid_period"
      };

      const res = await request(app)
        .post("/api/brands/1/issues")
        .send(invalidData)
        .expect(400);

      expect(res.body.error).toBe("Valid period is required when delivery time is custom (morning, afternoon, or evening)");
    });

    it("should return 404 for non-existent brand", async () => {
      const giftCardData = {
        amount: 100,
        senderName: "John Doe",
        recipientName: "Jane Smith",
        recipientEmail: "jane@example.com",
        recipientPhone: "+6591234567",
        deliveryType: "personal",
        deliveryTime: "immediately"
      };

      const res = await request(app)
        .post("/api/brands/999/issues")
        .send(giftCardData)
        .expect(404);

      expect(res.body.error).toBe("Brand not found");
    });

    it("should return 400 for invalid brand ID", async () => {
      const giftCardData = {
        amount: 100,
        senderName: "John Doe",
        recipientName: "Jane Smith",
        recipientEmail: "jane@example.com",
        recipientPhone: "+6591234567",
        deliveryType: "personal",
        deliveryTime: "immediately"
      };

      const res = await request(app)
        .post("/api/brands/invalid/issues")
        .send(giftCardData)
        .expect(400);

      expect(res.body.error).toBe("Invalid brand ID format");
    });
  });

  describe("GET /api/brands/:id/issues", () => {
    beforeEach(async () => {
      // Issue a gift card for testing
      await request(app).post("/api/brands/1/issues").send({
        amount: 50,
        recipientEmail: "test@example.com",
        recipientPhone: "+6512345678",
        message: "Test card",
        deliveryType: "personal",
        deliveryTime: "immediately"
      });
    });

    it("should return issued cards for a brand with pagination", async () => {
      const res = await request(app).get("/api/brands/1/issues").expect(200);

      expect(res.body.status).toBe("success");
      expect(res.body.data).toBeInstanceOf(Array);
      expect(res.body.data.length).toBeGreaterThan(0);
      expect(res.body.pagination).toBeDefined();
      expect(res.body.brand).toMatchObject({
        id: 1,
        name: "Lazada",
      });

      // Check structure of issued card with all new fields
      expect(res.body.data[0]).toMatchObject({
        brandId: 1,
        brandName: "Lazada",
        amount: expect.any(Number),
        activationCode: expect.any(String),
        recipientEmail: expect.any(String),
        recipientPhone: expect.any(String),
        deliveryType: expect.any(String),
        deliveryTime: expect.any(String),
        status: "active",
        isUsed: false,
      });
      // Optional fields like senderName, recipientName, deliveryDate, period, usedAt, pin
      // may or may not be present depending on the data
    });

    it("should support pagination for issued cards", async () => {
      const res = await request(app)
        .get("/api/brands/1/issues?page=1&limit=5")
        .expect(200);

      expect(res.body.pagination).toMatchObject({
        page: 1,
        limit: 5,
      });
    });

    it("should return empty array for brand with no issued cards", async () => {
      const res = await request(app).get("/api/brands/2/issues").expect(200);

      expect(res.body.status).toBe("success");
      expect(res.body.data).toEqual([]);
      expect(res.body.pagination.total).toBe(0);
    });

    it("should return 404 for non-existent brand", async () => {
      const res = await request(app).get("/api/brands/999/issues").expect(404);

      expect(res.body.error).toBe("Brand not found");
    });

    it("should return 400 for invalid brand ID", async () => {
      const res = await request(app)
        .get("/api/brands/invalid/issues")
        .expect(400);

      expect(res.body.error).toBe("Invalid brand ID format");
    });
  });

  describe("404 handler", () => {
    it("should return 404 for unknown routes", async () => {
      const res = await request(app).get("/api/unknown").expect(404);

      expect(res.body.error).toBe("Route not found");
    });
  });
});
