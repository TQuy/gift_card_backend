const request = require("supertest");
const { app } = require("../server");
const { Brand, GiftCard, initializeTestDatabase } = require("../models");

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

      expect(res.body).toEqual({
        status: "OK",
        message: "Gift Card API is running",
      });
    });
  });

  describe("GET /api/brands", () => {
    it("should return all brands with pagination", async () => {
      const res = await request(app).get("/api/brands").expect(200);

      // Query actual database count instead of hardcoded number
      const totalBrands = await Brand.count();

      expect(res.body.status).toBe("success");
      expect(res.body.data).toHaveLength(totalBrands);
      expect(res.body.pagination).toMatchObject({
        page: 1,
        limit: 10,
        total: totalBrands,
        totalPages: Math.ceil(totalBrands / 10),
        hasNext: false,
        hasPrev: false,
      });

      // Compare each brand in response with database
      const dbBrands = await Brand.findAll({ order: [["id", "ASC"]] });
      res.body.data.forEach((brand, idx) => {
        const dbBrand = dbBrands[idx];
        expect(brand).toMatchObject({
          id: dbBrand.id,
          name: dbBrand.name,
          description: dbBrand.description,
          logo: dbBrand.logo,
          isActive: dbBrand.isActive,
          country: dbBrand.country,
          phoneNumber: dbBrand.phoneNumber,
          company: dbBrand.company,
          products: dbBrand.products,
        });
        expect(brand.createdAt).toBeDefined();
        expect(brand.updatedAt).toBeDefined();
      });
    });

    it("should support pagination parameters", async () => {
      const res = await request(app)
        .get("/api/brands?page=1&limit=2")
        .expect(200);

      // Query actual database count
      const totalBrands = await Brand.count();

      expect(res.body.data).toHaveLength(2);
      expect(res.body.pagination).toMatchObject({
        page: 1,
        limit: 2,
        total: totalBrands,
        totalPages: Math.ceil(totalBrands / 2),
        hasNext: totalBrands > 2,
        hasPrev: false,
      });
    });

    it("should handle page 2 correctly", async () => {
      const res = await request(app)
        .get("/api/brands?page=2&limit=2")
        .expect(200);

      // Query actual database count
      const totalBrands = await Brand.count();
      const expectedLength = Math.min(2, Math.max(0, totalBrands - 2)); // Min of 2 or remaining items

      expect(res.body.data).toHaveLength(expectedLength);
      expect(res.body.pagination).toMatchObject({
        page: 2,
        limit: 2,
        total: totalBrands,
        totalPages: Math.ceil(totalBrands / 2),
        hasNext: totalBrands > 4, // More than 2 pages worth
        hasPrev: true,
      });
    });
  });

  describe("GET /api/brands/:id", () => {
    it("should return specific brand", async () => {
      // Get the first brand from the database
      const brand = await Brand.findOne({ order: [["id", "ASC"]] });
      const res = await request(app).get(`/api/brands/${brand.id}`).expect(200);

      expect(res.body.status).toBe("success");
      // Compare all fields with database
      Object.keys(brand.dataValues).forEach((key) => {
        if (["createdAt", "updatedAt"].includes(key)) return;
        expect(res.body.data[key]).toEqual(brand[key]);
      });
      expect(res.body.data.createdAt).toBeDefined();
      expect(res.body.data.updatedAt).toBeDefined();
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
        period: "afternoon",
      };

      const res = await request(app)
        .post("/api/brands/1/issues")
        .send(giftCardData)
        .expect(201);

      expect(res.body.status).toBe("success");
      expect(res.body.message).toBe("Gift card issued successfully");
      // Query the issued gift card from the database
      const issuedCard = await GiftCard.findOne({
        where: { id: res.body.data.id },
      });
      expect(issuedCard).not.toBeNull();
      // Compare all relevant fields
      [
        "brandName",
        "amount",
        "senderName",
        "recipientName",
        "recipientEmail",
        "recipientPhone",
        "message",
        "deliveryType",
        "deliveryTime",
        "deliveryDate",
        "period",
      ].forEach((key) => {
        expect(res.body.data[key]).toEqual(issuedCard[key]);
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
        deliveryTime: "immediately",
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
        deliveryTime: "immediately",
      });
      // Optional fields should not be present in response
      expect(res.body.data).not.toHaveProperty("senderName");
      expect(res.body.data).not.toHaveProperty("recipientName");
      expect(res.body.data).not.toHaveProperty("deliveryDate");
      expect(res.body.data).not.toHaveProperty("period");
    });

    it("should not require delivery date and period for immediate delivery", async () => {
      const validData = {
        amount: 100,
        recipientEmail: "test@example.com",
        recipientPhone: "+6591234567",
        deliveryType: "personal",
        deliveryTime: "immediately",
      };

      const res = await request(app)
        .post("/api/brands/1/issues")
        .send(validData)
        .expect(201);

      expect(res.body.status).toBe("success");
      expect(res.body.data).not.toHaveProperty("deliveryDate");
      expect(res.body.data).not.toHaveProperty("period");
    });

    it("should require valid amount", async () => {
      const invalidData = {
        amount: -10,
        senderName: "John Doe",
        recipientName: "Jane Smith",
        recipientEmail: "jane@example.com",
        recipientPhone: "+6591234567",
        deliveryType: "personal",
        deliveryTime: "immediately",
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
        deliveryTime: "immediately",
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
        deliveryTime: "immediately",
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
        deliveryTime: "immediately",
      };

      const res = await request(app)
        .post("/api/brands/1/issues")
        .send(invalidData)
        .expect(400);

      expect(res.body.error).toBe(
        "Sender name is required when delivery type is send_as_gift"
      );
    });

    it("should require recipient name when delivery type is send_as_gift", async () => {
      const invalidData = {
        amount: 100,
        senderName: "John Doe",
        recipientEmail: "jane@example.com",
        recipientPhone: "+6591234567",
        deliveryType: "send_as_gift",
        deliveryTime: "immediately",
      };

      const res = await request(app)
        .post("/api/brands/1/issues")
        .send(invalidData)
        .expect(400);

      expect(res.body.error).toBe(
        "Recipient name is required when delivery type is send_as_gift"
      );
    });

    it("should require recipient email", async () => {
      const invalidData = {
        amount: 100,
        senderName: "John Doe",
        recipientName: "Jane Smith",
        recipientPhone: "+6591234567",
        deliveryType: "personal",
        deliveryTime: "immediately",
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
        deliveryTime: "immediately",
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
        deliveryTime: "immediately",
      };

      const res = await request(app)
        .post("/api/brands/1/issues")
        .send(invalidData)
        .expect(400);

      expect(res.body.error).toBe(
        "Valid delivery type is required (personal or send_as_gift)"
      );
    });

    it("should require valid delivery time", async () => {
      const invalidData = {
        amount: 100,
        senderName: "John Doe",
        recipientName: "Jane Smith",
        recipientEmail: "jane@example.com",
        recipientPhone: "+6591234567",
        deliveryType: "personal",
        deliveryTime: "invalid_time",
      };

      const res = await request(app)
        .post("/api/brands/1/issues")
        .send(invalidData)
        .expect(400);

      expect(res.body.error).toBe(
        "Valid delivery time is required (immediately or custom)"
      );
    });

    it("should require delivery date for custom delivery time", async () => {
      const invalidData = {
        amount: 100,
        senderName: "John Doe",
        recipientName: "Jane Smith",
        recipientEmail: "jane@example.com",
        recipientPhone: "+6591234567",
        deliveryType: "personal",
        deliveryTime: "custom",
      };

      const res = await request(app)
        .post("/api/brands/1/issues")
        .send(invalidData)
        .expect(400);

      expect(res.body.error).toBe(
        "Delivery date is required when delivery time is custom"
      );
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
        period: "invalid_period",
      };

      const res = await request(app)
        .post("/api/brands/1/issues")
        .send(invalidData)
        .expect(400);

      expect(res.body.error).toBe(
        "Valid period is required when delivery time is custom (morning, afternoon, or evening)"
      );
    });

    it("should return 404 for non-existent brand", async () => {
      const giftCardData = {
        amount: 100,
        senderName: "John Doe",
        recipientName: "Jane Smith",
        recipientEmail: "jane@example.com",
        recipientPhone: "+6591234567",
        deliveryType: "personal",
        deliveryTime: "immediately",
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
        deliveryTime: "immediately",
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
        deliveryTime: "immediately",
      });
    });

    it("should return issued cards for a brand with pagination", async () => {
      const res = await request(app).get("/api/brands/1/issues").expect(200);

      expect(res.body.status).toBe("success");
      expect(res.body.data).toBeInstanceOf(Array);
      expect(res.body.data.length).toBeGreaterThan(0);
      expect(res.body.pagination).toBeDefined();
      // Compare brand info with database
      const brand = await Brand.findByPk(res.body.brand.id);
      expect(res.body.brand).toMatchObject({
        id: brand.id,
        name: brand.name,
      });
      // Compare issued card fields with database
      const dbGiftCards = await GiftCard.findAll({
        where: { brandId: brand.id },
      });
      res.body.data.forEach((card, idx) => {
        const dbCard = dbGiftCards[idx];
        expect(card.brandId).toEqual(dbCard.brandId);
        expect(card.brandName).toEqual(dbCard.brandName);
        expect(card.amount).toEqual(Number(dbCard.amount));
        expect(card.activationCode).toEqual(dbCard.activationCode);
        expect(card.recipientEmail).toEqual(dbCard.recipientEmail);
        expect(card.recipientPhone).toEqual(dbCard.recipientPhone);
        expect(card.deliveryType).toEqual(dbCard.deliveryType);
        expect(card.deliveryTime).toEqual(dbCard.deliveryTime);
        expect(card.status).toEqual(dbCard.status);
        expect(card.isUsed).toEqual(dbCard.isUsed);
      });
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
