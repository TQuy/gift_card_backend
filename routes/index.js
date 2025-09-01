const express = require("express");
const router = express.Router();

// Import individual route modules
const brandsRoutes = require("./brands");
const giftCardsRoutes = require("./giftCards");
const authRoutes = require("./auth");

// Mount auth routes
router.use("/auth", authRoutes);

// Mount brand routes
router.use("/brands", brandsRoutes);

// Mount gift card routes (they share the same base path as brands for the nested routes)
router.use("/brands", giftCardsRoutes);

module.exports = router;
