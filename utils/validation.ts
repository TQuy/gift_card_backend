/**
 * Validation utilities for request parameters and data
 */

interface BrandIdValidationResult {
  isValid: boolean;
  brandId?: number;
  error?: string;
}

interface GiftCardValidationResult {
  isValid: boolean;
  errors?: string[];
}

/**
 * Validate and parse brand ID from request parameters
 */
export function validateBrandId(id: string): BrandIdValidationResult {
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
 */
export function validateGiftCardIssueData(data: any): GiftCardValidationResult {
  const errors: string[] = [];
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
    message,
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
    if (!deliveryTime || !["immediately", "custom"].includes(deliveryTime)) {
      errors.push("Valid delivery time is required (immediately or custom)");
    }
    else if (deliveryTime === "custom") {
      if (!deliveryDate) {
        errors.push("Delivery date is required when delivery time is custom");
      }
      if (!period || !["morning", "afternoon", "evening"].includes(period)) {
        errors.push(
          "Valid period is required when delivery time is custom (morning, afternoon, or evening)"
        );
      }
    }

    if (!message) {
      errors.push("Message is required when delivery type is send_as_gift");
    }
  }

  return {
    isValid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined,
  };
}

/**
 * Validate pagination parameters
 */
export function validatePagination(query: any): {
  page: number;
  limit: number;
  offset: number;
} {
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 10;
  const offset = (page - 1) * limit;

  return { page, limit, offset };
}
