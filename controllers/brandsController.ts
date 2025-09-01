import { Request, Response } from "express";
import { Brand } from "@/models";
import { validateBrandId, validatePagination } from "@/utils/validation";
import {
  successResponse,
  paginatedResponse,
  errorResponse,
} from "@/utils/responseHelpers";

/**
 * Get all active brands with pagination
 */
export async function getAllBrands(req: Request, res: Response): Promise<void> {
  try {
    const { page, limit, offset } = validatePagination(req.query);

    const { count, rows } = await Brand.findAndCountAll({
      where: { status: 1 }, // Use status instead of isActive
      limit: limit,
      offset: offset,
      order: [["createdAt", "ASC"]],
    });

    // Transform brands to include isActive field
    const transformedRows = rows.map((brand: any) => {
      const brandData = brand.toJSON();
      return {
        ...brandData,
        isActive: brandData.status === 1,
      };
    });

    const totalPages = Math.ceil(count / limit);
    const response = paginatedResponse(transformedRows, {
      page,
      limit,
      total: count,
      totalPages,
    });

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

    if (!validation.isValid) {
      return res.status(400).json(errorResponse(validation.error!));
    }

    const brand = await Brand.findOne({
      where: {
        id: validation.brandId,
        status: 1, // Use status instead of isActive
      },
    });

    if (!brand) {
      return res.status(404).json(errorResponse("Brand not found"));
    }

    // Transform brand to include isActive field
    const brandData = (brand as any).toJSON();
    const transformedBrand = {
      ...brandData,
      isActive: brandData.status === 1,
    };

    res.json(successResponse(transformedBrand));
  } catch (error) {
    console.error("Error fetching brand:", error);
    res.status(500).json(errorResponse("Failed to fetch brand"));
  }
}

/**
 * Helper function to find and validate brand for gift card operations
 */
export async function findAndValidateBrand(brandId: number): Promise<any> {
  const brand = await Brand.findOne({
    where: {
      id: brandId,
      status: 1, // Use status instead of isActive
    },
  });

  return brand;
}
