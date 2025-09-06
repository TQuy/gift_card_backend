import crypto from "crypto";
import { Request, Response } from "express";
import { Brand, GiftCard } from "@/models";
import {
  validateBrandId,
  validateGiftCardIssueData,
  validatePagination,
} from "@/utils/validation";
import {
  successResponse,
  paginatedResponse,
  errorResponse,
  validationErrorResponse,
  buildGiftCardResponse,
} from "@/utils/responseHelpers";
import { findAndValidateBrand } from "@/controllers/brandsController";

/**
 * Issue a gift card for a specific brand
 */
export async function issueGiftCard(req: Request, res: Response): Promise<Response | void> {
  try {
    const brandValidation = validateBrandId(req.params.id);

    if (!brandValidation.isValid) {
      return res.status(400).json(errorResponse(brandValidation.error!));
    }

    const brand = await findAndValidateBrand(brandValidation.brandId!);

    if (!brand) {
      return res.status(404).json(errorResponse("Brand not found"));
    }

    const dataValidation = validateGiftCardIssueData(req.body);

    if (!dataValidation.isValid) {
      return res
        .status(400)
        .json(validationErrorResponse(dataValidation.errors!));
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
      period,
    } = req.body;

    // Generate cryptographically secure activation code
    const activationCode = crypto.randomBytes(16).toString("hex").toUpperCase();

    // Build gift card data object
    const giftCardData: any = {
      brandId: brandValidation.brandId,
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

    if (deliveryTime === "custom" && deliveryDate) {
      giftCardData.deliveryDate = deliveryDate;
    }

    if (deliveryTime === "custom" && period) {
      giftCardData.period = period;
    }

    const giftCard = await GiftCard.create(giftCardData);
    const responseData = buildGiftCardResponse(giftCard);

    res
      .status(201)
      .json(successResponse(responseData, "Gift card issued successfully"));
  } catch (error) {
    console.error("Error issuing gift card:", error);
    res.status(500).json(errorResponse("Failed to issue gift card"));
  }
}

/**
 * List issued gift cards for a specific brand with pagination
 */
export async function getIssuedGiftCards(req: Request, res: Response): Promise<Response | void> {
  try {
    const brandValidation = validateBrandId(req.params.id);

    if (!brandValidation.isValid) {
      return res.status(400).json(errorResponse(brandValidation.error!));
    }

    const brand = await Brand.findByPk(brandValidation.brandId);

    if (!brand) {
      return res.status(404).json(errorResponse("Brand not found"));
    }

    const { page, limit, offset } = validatePagination(req.query);

    const { count, rows } = await GiftCard.findAndCountAll({
      where: { brandId: brandValidation.brandId },
      limit: limit,
      offset: offset,
      order: [["issuedAt", "DESC"]],
    });

    const totalPages = Math.ceil(count / limit);
    const response = paginatedResponse(
      rows,
      { page, limit, total: count, totalPages },
      {
        brand: {
          id: brand.id,
          name: brand.name,
        },
      }
    );

    res.json(response);
  } catch (error) {
    console.error("Error fetching issued cards:", error);
    res.status(500).json(errorResponse("Failed to fetch issued cards"));
  }
}
