/**
 * Response helper utilities for consistent API responses
 */

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface PaginationResponse {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

interface SuccessResponse<T = any> {
  status: "success";
  data: T;
  message?: string;
}

interface PaginatedSuccessResponse<T = any> {
  status: "success";
  data: T[];
  pagination: PaginationResponse;
  [key: string]: any;
}

interface ErrorResponse {
  status: "error";
  error: string;
  details?: string[];
}

/**
 * Create a success response with data
 */
export function successResponse<T = any>(data: T, message?: string): SuccessResponse<T> {
  const response: SuccessResponse<T> = {
    status: "success",
    data: data,
  };

  if (message) {
    response.message = message;
  }

  return response;
}

/**
 * Create a paginated success response
 */
export function paginatedResponse<T = any>(
  data: T[],
  paginationInfo: PaginationInfo,
  additionalData: Record<string, any> = {}
): PaginatedSuccessResponse<T> {
  const { page, limit, total, totalPages } = paginationInfo;

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
  };
}

/**
 * Create an error response
 */
export function errorResponse(message: string, statusCode?: number): ErrorResponse {
  return {
    status: "error",
    error: message,
  };
}

/**
 * Create a validation error response from multiple errors
 */
export function validationErrorResponse(errors: string[]): ErrorResponse {
  if (Array.isArray(errors) && errors.length === 1) {
    return errorResponse(errors[0]);
  }

  // For consistency with existing tests, if there are multiple validation errors,
  // return the first one as the main error message (maintains backward compatibility)
  if (Array.isArray(errors) && errors.length > 0) {
    return errorResponse(errors[0]);
  }

  return {
    status: "error",
    error: "Validation failed",
    details: errors,
  };
}

/**
 * Build gift card response data with only non-null fields
 */
export function buildGiftCardResponse(giftCard: any): any {
  const responseData: any = {
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
  };

  // Only include optional fields if they exist in the giftCard object
  if (giftCard.senderName) {
    responseData.senderName = giftCard.senderName;
  }

  if (giftCard.recipientName) {
    responseData.recipientName = giftCard.recipientName;
  }

  if (giftCard.deliveryDate) {
    responseData.deliveryDate = giftCard.deliveryDate;
  }

  if (giftCard.period) {
    responseData.period = giftCard.period;
  }

  return responseData;
}
