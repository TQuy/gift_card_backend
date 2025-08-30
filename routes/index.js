const express = require("express");
const router = express.Router();

// Import individual route modules
const brandsRoutes = require("./brands");
const giftCardsRoutes = require("./giftCards");

// Mount brand routes
router.use("/", brandsRoutes);

// Mount gift card routes (they share the same base path as brands for the nested routes)
router.use("/", giftCardsRoutes);

module.exports = router;
