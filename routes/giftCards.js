const express = require("express")
const router = express.Router()
const {
  issueGiftCard,
  getIssuedGiftCards,
} = require("../controllers/giftCardsController")
const { authenticateToken, requireRole } = require("../middleware/auth")

/**
 * @swagger
 * /api/brands/{id}/issues:
 *   post:
 *     summary: Issue a gift card for a specific brand
 *     tags: [Gift Cards]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Brand ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *               - recipientEmail
 *               - recipientPhone
 *               - deliveryType
 *               - deliveryTime
 *             properties:
 *               amount:
 *                 type: number
 *                 minimum: 0.01
 *                 example: 50.00
 *               recipientEmail:
 *                 type: string
 *                 format: email
 *                 example: "recipient@example.com"
 *               recipientPhone:
 *                 type: string
 *                 example: "+1234567890"
 *               deliveryType:
 *                 type: string
 *                 enum: [personal, send_as_gift]
 *                 example: "send_as_gift"
 *               deliveryTime:
 *                 type: string
 *                 enum: [immediately, custom]
 *                 example: "immediately"
 *               message:
 *                 type: string
 *                 example: "Happy Birthday!"
 *               senderName:
 *                 type: string
 *                 example: "John Doe"
 *                 description: "Required when deliveryType is 'send_as_gift'"
 *               recipientName:
 *                 type: string
 *                 example: "Jane Smith"
 *                 description: "Required when deliveryType is 'send_as_gift'"
 *               pin:
 *                 type: string
 *                 example: "1234"
 *               deliveryDate:
 *                 type: string
 *                 format: date
 *                 example: "2023-12-25"
 *                 description: "Required when deliveryTime is 'custom'"
 *               period:
 *                 type: string
 *                 enum: [morning, afternoon, evening]
 *                 example: "morning"
 *                 description: "Required when deliveryTime is 'custom'"
 *     responses:
 *       201:
 *         description: Gift card issued successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: "Gift card issued successfully"
 *                 data:
 *                   $ref: '#/components/schemas/GiftCard'
 *       400:
 *         description: Bad request - validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized - Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - Admin role required
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
router.post(
  "/:id/issues",
  authenticateToken,
  requireRole("admin"),
  issueGiftCard
)

/**
 * @swagger
 * /api/brands/{id}/issues:
 *   get:
 *     summary: List issued gift cards for a specific brand
 *     tags: [Gift Cards]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Brand ID
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
 *         description: List of issued gift cards with pagination info
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
 *                     $ref: '#/components/schemas/GiftCard'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 *                 brand:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     name:
 *                       type: string
 *       400:
 *         description: Invalid brand ID format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized - Authentication required
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
router.get("/:id/issues", authenticateToken, getIssuedGiftCards)

module.exports = router
