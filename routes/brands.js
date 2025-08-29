const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const { Brand, GiftCard } = require("../models");
const { Op } = require("sequelize");

// GET /api/brands - List all brands with pagination
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows } = await Brand.findAndCountAll({
      where: { isActive: true },
      limit: limit,
      offset: offset,
      order: [['createdAt', 'ASC']],
    });

    res.json({
      status: "success",
      data: rows,
      pagination: {
        page: page,
        limit: limit,
        total: count,
        totalPages: Math.ceil(count / limit),
        hasNext: page < Math.ceil(count / limit),
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error('Error fetching brands:', error);
    res.status(500).json({ error: "Failed to fetch brands" });
  }
});

// GET /api/brands/:id - Show specific brand
router.get("/:id", async (req, res) => {
  try {
    const brandId = parseInt(req.params.id);

    // Validate that id is a number
    if (isNaN(brandId)) {
      return res.status(400).json({ error: "Invalid brand ID format" });
    }

    const brand = await Brand.findOne({
      where: { 
        id: brandId, 
        isActive: true 
      }
    });

    if (!brand) {
      return res.status(404).json({ error: "Brand not found" });
    }

    res.json({
      status: "success",
      data: brand,
    });
  } catch (error) {
    console.error('Error fetching brand:', error);
    res.status(500).json({ error: "Failed to fetch brand" });
  }
});

// POST /api/brands/:id/issues - Issue a gift card for a brand
router.post("/:id/issues", async (req, res) => {
  try {
    const brandId = parseInt(req.params.id);

    // Validate that id is a number
    if (isNaN(brandId)) {
      return res.status(400).json({ error: "Invalid brand ID format" });
    }

    const brand = await Brand.findOne({
      where: { 
        id: brandId, 
        isActive: true 
      }
    });

    if (!brand) {
      return res.status(404).json({ error: "Brand not found" });
    }

    const { 
      amount, 
      recipientEmail, 
      message, 
      pin,
      senderName,
      recipientName,
      recipientPhone,
      deliveryType,
      deliveryTime,
      deliveryDate,
      period
    } = req.body;

    // Validation
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: "Valid amount is required" });
    }

    if (!recipientEmail) {
      return res.status(400).json({ error: "Recipient email is required" });
    }

    if (!recipientPhone) {
      return res.status(400).json({ error: "Recipient phone is required" });
    }

    if (!deliveryType || !['personal', 'send_as_gift'].includes(deliveryType)) {
      return res.status(400).json({ error: "Valid delivery type is required (personal or send_as_gift)" });
    }

    if (!deliveryTime || !['immediately', 'custom'].includes(deliveryTime)) {
      return res.status(400).json({ error: "Valid delivery time is required (immediately or custom)" });
    }

    // senderName and recipientName are only required when deliveryType is 'send_as_gift'
    if (deliveryType === 'send_as_gift') {
      if (!senderName) {
        return res.status(400).json({ error: "Sender name is required when delivery type is send_as_gift" });
      }
      if (!recipientName) {
        return res.status(400).json({ error: "Recipient name is required when delivery type is send_as_gift" });
      }
    }

    // deliveryDate and period are only required when deliveryTime is 'custom'
    if (deliveryTime === 'custom') {
      if (!deliveryDate) {
        return res.status(400).json({ error: "Delivery date is required when delivery time is custom" });
      }
      if (!period || !['morning', 'afternoon', 'evening'].includes(period)) {
        return res.status(400).json({ error: "Valid period is required when delivery time is custom (morning, afternoon, or evening)" });
      }
    }

    // Generate cryptographically secure activation code
    const activationCode = crypto.randomBytes(16).toString('hex').toUpperCase();

    // Build gift card data object
    const giftCardData = {
      brandId: brandId,
      brandName: brand.name,
      amount: parseFloat(amount),
      activationCode: activationCode,
      recipientEmail: recipientEmail,
      recipientPhone: recipientPhone,
      message: message || "",
      deliveryType: deliveryType,
      deliveryTime: deliveryTime,
      status: "active",
      isUsed: false,
    };

    // Only include optional fields if they have values
    if (senderName) {
      giftCardData.senderName = senderName;
    }
    
    if (recipientName) {
      giftCardData.recipientName = recipientName;
    }
    
    if (pin) {
      giftCardData.pin = pin;
    }
    
    if (deliveryTime === 'custom' && deliveryDate) {
      giftCardData.deliveryDate = deliveryDate;
    }
    
    if (deliveryTime === 'custom' && period) {
      giftCardData.period = period;
    }

    const giftCard = await GiftCard.create(giftCardData);

    // Build response data, only including fields that have values
    const responseData = {
      id: giftCard.id,
      brandName: giftCard.brandName,
      amount: giftCard.amount,
      activationCode: giftCard.activationCode,
      recipientEmail: giftCard.recipientEmail,
      recipientPhone: giftCard.recipientPhone,
      message: giftCard.message,
      deliveryType: giftCard.deliveryType,
      deliveryTime: giftCard.deliveryTime,
      issuedAt: giftCard.issuedAt,
    };

    // Only include optional fields if they exist in the giftCard object
    if (giftCard.senderName) {
      responseData.senderName = giftCard.senderName;
    }
    
    if (giftCard.recipientName) {
      responseData.recipientName = giftCard.recipientName;
    }
    
    if (giftCard.deliveryDate) {
      responseData.deliveryDate = giftCard.deliveryDate;
    }
    
    if (giftCard.period) {
      responseData.period = giftCard.period;
    }

    res.status(201).json({
      status: "success",
      message: "Gift card issued successfully",
      data: responseData,
    });
  } catch (error) {
    console.error('Error issuing gift card:', error);
    res.status(500).json({ error: "Failed to issue gift card" });
  }
});

// GET /api/brands/:id/issues - List issued cards for a brand with pagination
router.get("/:id/issues", async (req, res) => {
  try {
    const brandId = parseInt(req.params.id);

    // Validate that id is a number
    if (isNaN(brandId)) {
      return res.status(400).json({ error: "Invalid brand ID format" });
    }

    const brand = await Brand.findByPk(brandId);

    if (!brand) {
      return res.status(404).json({ error: "Brand not found" });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows } = await GiftCard.findAndCountAll({
      where: { brandId: brandId },
      limit: limit,
      offset: offset,
      order: [['issuedAt', 'DESC']],
    });

    res.json({
      status: "success",
      data: rows,
      pagination: {
        page: page,
        limit: limit,
        total: count,
        totalPages: Math.ceil(count / limit),
        hasNext: page < Math.ceil(count / limit),
        hasPrev: page > 1,
      },
      brand: {
        id: brand.id,
        name: brand.name,
      },
    });
  } catch (error) {
    console.error('Error fetching issued cards:', error);
    res.status(500).json({ error: "Failed to fetch issued cards" });
  }
});

module.exports = router;
