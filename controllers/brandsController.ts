import { Request, Response } from "express";
import { validateBrandId, validatePagination } from "@/utils/validation";
import {
  successResponse,
  paginatedResponse,
  errorResponse,
} from "@/utils/responseHelpers";
import {
  getAllActiveBrands,
  getBrandById as getBrandByIdService,
  findAndValidateBrand,
} from "@/services/brands";

/**
 * Get all active brands with pagination
 */
export async function getAllBrands(req: Request, res: Response): Promise<void> {
  try {
    const paginationOptions = validatePagination(req.query);

    const result = await getAllActiveBrands(paginationOptions);

    const response = paginatedResponse(result.brands, result.pagination);

    res.json(response);
  } catch (error) {
    console.error("Error fetching brands:", error);
    res.status(500).json(errorResponse("Failed to fetch brands"));
  }
}

/**
 * Get a specific brand by ID
 */
export async function getBrandById(req: Request, res: Response): Promise<Response | void> {
  try {
    const validation = validateBrandId(req.params.id);

    if (!validation.isValid || !validation.brandId) {
      return res.status(400).json(errorResponse(validation.error!));
    }

    const brand = await getBrandByIdService(validation.brandId);

    if (!brand) {
      return res.status(404).json(errorResponse("Brand not found"));
    }

    res.json(successResponse(brand));
  } catch (error) {
    console.error("Error fetching brand:", error);
    res.status(500).json(errorResponse("Failed to fetch brand"));
  }
}

/**
 * Helper function to find and validate brand for gift card operations
 */
export { findAndValidateBrand };
