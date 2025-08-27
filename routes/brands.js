const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");

// In-memory data storage (replace with database in production)
let brands = [
  {
    id: 1,
    name: "Lazada",
    description: "Online shopping platform",
    logo: "lazada-logo.png",
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    name: "Grab",
    description: "Southeast Asian super app",
    logo: "grab-logo.png",
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 3,
    name: "Amazon",
    description: "Global e-commerce and cloud computing",
    logo: "amazon-logo.png",
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 4,
    name: "Subway",
    description: "Fast food restaurant chain",
    logo: "subway-logo.png",
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 5,
    name: "Esprit",
    description: "Fashion and lifestyle brand",
    logo: "esprit-logo.png",
    isActive: true,
    createdAt: new Date().toISOString(),
  },
];

let issuedCards = [];

// GET /api/brands - List all brands with pagination
router.get("/", (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const activeBrands = brands.filter((brand) => brand.isActive);
    const paginatedBrands = activeBrands.slice(offset, offset + limit);

    res.json({
      status: "success",
      data: paginatedBrands,
      pagination: {
        page: page,
        limit: limit,
        total: activeBrands.length,
        totalPages: Math.ceil(activeBrands.length / limit),
        hasNext: page < Math.ceil(activeBrands.length / limit),
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch brands" });
  }
});

// GET /api/brands/:id - Show specific brand
router.get("/:id", (req, res) => {
  try {
    const brandId = parseInt(req.params.id);

    // Validate that id is a number
    if (isNaN(brandId)) {
      return res.status(400).json({ error: "Invalid brand ID format" });
    }

    const brand = brands.find((b) => b.id === brandId && b.isActive);

    if (!brand) {
      return res.status(404).json({ error: "Brand not found" });
    }

    res.json({
      status: "success",
      data: brand,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch brand" });
  }
});

// POST /api/brands/:id/issues - Issue a gift card for a brand
router.post("/:id/issues", (req, res) => {
  try {
    const brandId = parseInt(req.params.id);

    // Validate that id is a number
    if (isNaN(brandId)) {
      return res.status(400).json({ error: "Invalid brand ID format" });
    }

    const brand = brands.find((b) => b.id === brandId && b.isActive);

    if (!brand) {
      return res.status(404).json({ error: "Brand not found" });
    }

    const { amount, recipientEmail, message, pin } = req.body;

    // Validation
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: "Valid amount is required" });
    }

    if (!recipientEmail) {
      return res.status(400).json({ error: "Recipient email is required" });
    }

    // Generate unique activation code
    const activationCode =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);

    const giftCard = {
      id: uuidv4(),
      brandId: brandId,
      brandName: brand.name,
      amount: parseFloat(amount),
      activationCode: activationCode,
      recipientEmail: recipientEmail,
      message: message || "",
      pin: pin || null,
      status: "active",
      issuedAt: new Date().toISOString(),
      isUsed: false,
      usedAt: null,
    };

    issuedCards.push(giftCard);

    res.status(201).json({
      status: "success",
      message: "Gift card issued successfully",
      data: {
        id: giftCard.id,
        brandName: giftCard.brandName,
        amount: giftCard.amount,
        activationCode: giftCard.activationCode,
        recipientEmail: giftCard.recipientEmail,
        issuedAt: giftCard.issuedAt,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to issue gift card" });
  }
});

// GET /api/brands/:id/issues - List issued cards for a brand with pagination
router.get("/:id/issues", (req, res) => {
  try {
    const brandId = parseInt(req.params.id);

    // Validate that id is a number
    if (isNaN(brandId)) {
      return res.status(400).json({ error: "Invalid brand ID format" });
    }

    const brand = brands.find((b) => b.id === brandId);

    if (!brand) {
      return res.status(404).json({ error: "Brand not found" });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const brandCards = issuedCards.filter((card) => card.brandId === brandId);
    const paginatedCards = brandCards.slice(offset, offset + limit);

    res.json({
      status: "success",
      data: paginatedCards,
      pagination: {
        page: page,
        limit: limit,
        total: brandCards.length,
        totalPages: Math.ceil(brandCards.length / limit),
        hasNext: page < Math.ceil(brandCards.length / limit),
        hasPrev: page > 1,
      },
      brand: {
        id: brand.id,
        name: brand.name,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch issued cards" });
  }
});

module.exports = router;
