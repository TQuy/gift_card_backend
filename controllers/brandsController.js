const { Brand } = require("../models");
const { validateBrandId, validatePagination } = require("../utils/validation");
const {
  successResponse,
  paginatedResponse,
  errorResponse,
} = require("../utils/responseHelpers");

/**
 * Get all active brands with pagination
 */
async function getAllBrands(req, res) {
  try {
    const { page, limit, offset } = validatePagination(req.query);

    const { count, rows } = await Brand.findAndCountAll({
      where: { isActive: true },
      limit: limit,
      offset: offset,
      order: [["createdAt", "ASC"]],
    });

    const totalPages = Math.ceil(count / limit);
    const response = paginatedResponse(rows, {
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
async function getBrandById(req, res) {
  try {
    const validation = validateBrandId(req.params.id);

    if (!validation.isValid) {
      return res.status(400).json(errorResponse(validation.error));
    }

    const brand = await Brand.findOne({
      where: {
        id: validation.brandId,
        isActive: true,
      },
    });

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
async function findAndValidateBrand(brandId) {
  const brand = await Brand.findOne({
    where: {
      id: brandId,
      isActive: true,
    },
  });

  return brand;
}

module.exports = {
  getAllBrands,
  getBrandById,
  findAndValidateBrand,
};
