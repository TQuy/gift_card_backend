import express from "express";
import {
  getAllBrands,
  getBrandById,
} from "@/controllers/brandsController";
import { authenticateToken, optionalAuth } from "@/middleware/auth";

const router = express.Router();

/**
 * @swagger
 * /api/brands:
 *   get:
 *     summary: Get all active brands with pagination
 *     tags: [Brands]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: List of brands with pagination info
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Brand'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/", authenticateToken, getAllBrands);

/**
 * @swagger
 * /api/brands/{id}:
 *   get:
 *     summary: Get a specific brand by ID with gift card count
 *     tags: [Brands]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Brand ID
 *     responses:
 *       200:
 *         description: Brand details with gift card count
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     name:
 *                       type: string
 *                       example: "Lazada"
 *                     description:
 *                       type: string
 *                       example: "Online shopping platform"
 *                     logo:
 *                       type: string
 *                       example: "lazada-logo.png"
 *                     status:
 *                       type: number
 *                       enum: [0, 1]
 *                       example: 1 
 *                     country:
 *                       type: string
 *                       example: "Singapore"
 *                     phoneNumber:
 *                       type: string
 *                       example: "+65 6123 4567"
 *                     company:
 *                       type: string
 *                       example: "Lazada Singapore Pte Ltd"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                     products:
 *                       type: integer
 *                       example: 5
 *       400:
 *         description: Invalid brand ID format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Brand not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/:id", authenticateToken, getBrandById);

export default router;
