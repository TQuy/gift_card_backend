/**
 * Response helper utilities for consistent API responses
 */

/**
 * Create a success response with data
 * @param {*} data - The data to include in the response
 * @param {string} message - Optional success message
 * @returns {object} - Success response object
 */
function successResponse(data, message = null) {
  const response = {
    status: "success",
    data: data,
  }

  if (message) {
    response.message = message
  }

  return response
}

/**
 * Create a paginated success response
 * @param {Array} data - The data array
 * @param {object} paginationInfo - Pagination details {page, limit, total, totalPages}
 * @param {object} additionalData - Additional data to include in response
 * @returns {object} - Paginated success response object
 */
function paginatedResponse(data, paginationInfo, additionalData = {}) {
  const { page, limit, total, totalPages } = paginationInfo

  return {
    status: "success",
    data: data,
    pagination: {
      page: page,
      limit: limit,
      total: total,
      totalPages: totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
    ...additionalData,
  }
}

/**
 * Create an error response
 * @param {string} message - Error message
 * @param {number} statusCode - HTTP status code (optional, for reference)
 * @returns {object} - Error response object
 */
function errorResponse(message, statusCode = null) {
  return {
    error: message,
  }
}

/**
 * Create a validation error response from multiple errors
 * @param {Array<string>} errors - Array of validation error messages
 * @returns {object} - Validation error response object
 */
function validationErrorResponse(errors) {
  if (Array.isArray(errors) && errors.length === 1) {
    return errorResponse(errors[0])
  }

  // For consistency with existing tests, if there are multiple validation errors,
  // return the first one as the main error message (maintains backward compatibility)
  if (Array.isArray(errors) && errors.length > 0) {
    return errorResponse(errors[0])
  }

  return {
    error: "Validation failed",
    details: errors,
  }
}

/**
 * Build gift card response data with only non-null fields
 * @param {object} giftCard - The gift card model instance
 * @returns {object} - Cleaned response data
 */
function buildGiftCardResponse(giftCard) {
  const responseData = {
    id: giftCard.id,
    brandName: giftCard.brandName,
    amount: giftCard.amount,
    activationCode: giftCard.activationCode,
    recipientEmail: giftCard.recipientEmail,
    recipientPhone: giftCard.recipientPhone,
    message: giftCard.message,
    deliveryType: giftCard.deliveryType,
    deliveryTime: giftCard.deliveryTime,
    issuedAt: giftCard.issuedAt,
  }

  // Only include optional fields if they exist in the giftCard object
  if (giftCard.senderName) {
    responseData.senderName = giftCard.senderName
  }

  if (giftCard.recipientName) {
    responseData.recipientName = giftCard.recipientName
  }

  if (giftCard.deliveryDate) {
    responseData.deliveryDate = giftCard.deliveryDate
  }

  if (giftCard.period) {
    responseData.period = giftCard.period
  }

  return responseData
}

module.exports = {
  successResponse,
  paginatedResponse,
  errorResponse,
  validationErrorResponse,
  buildGiftCardResponse,
}
