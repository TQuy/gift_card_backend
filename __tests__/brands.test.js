const request = require("supertest");
const { app } = require("../server");

describe("Gift Card API", () => {
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
        recipientEmail: "test@example.com",
        message: "Happy Birthday!",
        pin: "1234",
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
        recipientEmail: "test@example.com",
      });
      expect(res.body.data.id).toBeDefined();
      expect(res.body.data.activationCode).toBeDefined();
      expect(res.body.data.issuedAt).toBeDefined();
    });

    it("should require valid amount", async () => {
      const invalidData = {
        amount: -10,
        recipientEmail: "test@example.com",
      };

      const res = await request(app)
        .post("/api/brands/1/issues")
        .send(invalidData)
        .expect(400);

      expect(res.body.error).toBe("Valid amount is required");
    });

    it("should require recipient email", async () => {
      const invalidData = {
        amount: 100,
      };

      const res = await request(app)
        .post("/api/brands/1/issues")
        .send(invalidData)
        .expect(400);

      expect(res.body.error).toBe("Recipient email is required");
    });

    it("should return 404 for non-existent brand", async () => {
      const giftCardData = {
        amount: 100,
        recipientEmail: "test@example.com",
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
        recipientEmail: "test@example.com",
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
        message: "Test card",
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

      // Check structure of issued card
      expect(res.body.data[0]).toMatchObject({
        brandId: 1,
        brandName: "Lazada",
        amount: expect.any(Number),
        activationCode: expect.any(String),
        recipientEmail: expect.any(String),
        status: "active",
        isUsed: false,
        usedAt: null,
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
