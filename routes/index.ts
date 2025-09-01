import express from "express";
import brandsRoutes from "./brands";
import giftCardsRoutes from "./giftCards";
import authRoutes from "./auth";

const router = express.Router();

// Mount auth routes
router.use("/auth", authRoutes);

// Mount brand routes
router.use("/brands", brandsRoutes);

// Mount gift card routes (they share the same base path as brands for the nested routes)
router.use("/brands", giftCardsRoutes);

export default router;
