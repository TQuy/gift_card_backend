/**
 * Validation utilities for request parameters and data
 */

/**
 * Validate and parse brand ID from request parameters
 * @param {string} id - The brand ID from request params
 * @returns {object} - {isValid: boolean, brandId?: number, error?: string}
 */
function validateBrandId(id) {
  const brandId = parseInt(id);

  if (isNaN(brandId)) {
    return {
      isValid: false,
      error: "Invalid brand ID format",
    };
  }

  return {
    isValid: true,
    brandId: brandId,
  };
}

/**
 * Validate gift card issue request data
 * @param {object} data - The request body data
 * @returns {object} - {isValid: boolean, errors?: string[]}
 */
function validateGiftCardIssueData(data) {
  const errors = [];
  const {
    amount,
    recipientEmail,
    recipientPhone,
    deliveryType,
    deliveryTime,
    senderName,
    recipientName,
    deliveryDate,
    period,
  } = data;

  // Required field validations
  if (!amount || amount <= 0) {
    errors.push("Valid amount is required");
  }

  if (!recipientEmail) {
    errors.push("Recipient email is required");
  }

  if (!recipientPhone) {
    errors.push("Recipient phone is required");
  }

  if (!deliveryType || !["personal", "send_as_gift"].includes(deliveryType)) {
    errors.push("Valid delivery type is required (personal or send_as_gift)");
  }

  if (!deliveryTime || !["immediately", "custom"].includes(deliveryTime)) {
    errors.push("Valid delivery time is required (immediately or custom)");
  }

  // Conditional validations
  if (deliveryType === "send_as_gift") {
    if (!senderName) {
      errors.push("Sender name is required when delivery type is send_as_gift");
    }
    if (!recipientName) {
      errors.push(
        "Recipient name is required when delivery type is send_as_gift"
      );
    }
  }

  if (deliveryTime === "custom") {
    if (!deliveryDate) {
      errors.push("Delivery date is required when delivery time is custom");
    }
    if (!period || !["morning", "afternoon", "evening"].includes(period)) {
      errors.push(
        "Valid period is required when delivery time is custom (morning, afternoon, or evening)"
      );
    }
  }

  return {
    isValid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined,
  };
}

/**
 * Validate pagination parameters
 * @param {object} query - The query parameters
 * @returns {object} - {page: number, limit: number, offset: number}
 */
function validatePagination(query) {
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 10;
  const offset = (page - 1) * limit;

  return { page, limit, offset };
}

module.exports = {
  validateBrandId,
  validateGiftCardIssueData,
  validatePagination,
};
