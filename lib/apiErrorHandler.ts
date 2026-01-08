/**
 * API Error Handler Utility
 * Provides consistent error handling and logging across the application
 */

export interface ApiError {
  error: string;
  message?: string;
  details?: string;
  code?: string;
  status: number;
}

export class APIErrorHandler {
  /**
   * Handle authentication errors (401)
   */
  static unauthorized(message = 'Unauthorized'): ApiError {
    console.warn('[API] Unauthorized request:', message);
    return {
      error: 'Unauthorized',
      message: message,
      code: 'UNAUTHORIZED',
      status: 401,
    };
  }

  /**
   * Handle permission errors (403)
   */
  static forbidden(message = 'Access forbidden'): ApiError {
    console.warn('[API] Forbidden request:', message);
    return {
      error: 'Forbidden',
      message: message,
      code: 'FORBIDDEN',
      status: 403,
    };
  }

  /**
   * Handle not found errors (404)
   */
  static notFound(message = 'Resource not found'): ApiError {
    console.warn('[API] Not found:', message);
    return {
      error: 'Not Found',
      message: message,
      code: 'NOT_FOUND',
      status: 404,
    };
  }

  /**
   * Handle validation errors (400)
   */
  static badRequest(message: string, details?: string): ApiError {
    console.warn('[API] Bad request:', message);
    return {
      error: 'Bad Request',
      message: message,
      details: details,
      code: 'BAD_REQUEST',
      status: 400,
    };
  }

  /**
   * Handle insufficient resources (402/429)
   */
  static insufficientResources(
    message: string,
    type: 'credits' | 'rate_limit' = 'credits'
  ): ApiError {
    const status = type === 'rate_limit' ? 429 : 402;
    const code = type === 'rate_limit' ? 'RATE_LIMITED' : 'PAYMENT_REQUIRED';
    console.warn('[API] Insufficient resources:', message);
    return {
      error: type === 'rate_limit' ? 'Too Many Requests' : 'Payment Required',
      message: message,
      code: code,
      status: status,
    };
  }

  /**
   * Handle configuration errors (500)
   */
  static configurationError(serviceName: string): ApiError {
    console.error(`[API] Configuration error: ${serviceName} not configured`);
    return {
      error: 'Service Unavailable',
      message: `${serviceName} is not configured. Please contact support.`,
      code: 'CONFIG_ERROR',
      status: 503,
    };
  }

  /**
   * Handle internal server errors (500)
   */
  static internalError(
    operation: string,
    error: Error | unknown,
    isDevelopment = false
  ): ApiError {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`[API] Internal error in ${operation}:`, errorMessage);

    return {
      error: 'Internal Server Error',
      message: `Failed to ${operation}. Please try again.`,
      details: isDevelopment ? errorMessage : undefined,
      code: 'INTERNAL_ERROR',
      status: 500,
    };
  }

  /**
   * Handle service unavailable errors (503)
   */
  static serviceUnavailable(serviceName: string): ApiError {
    console.error(`[API] Service unavailable: ${serviceName}`);
    return {
      error: 'Service Unavailable',
      message: `${serviceName} is currently unavailable. Please try again later.`,
      code: 'SERVICE_UNAVAILABLE',
      status: 503,
    };
  }

  /**
   * Parse and categorize errors
   */
  static parseError(error: Error | unknown, context = ''): ApiError {
    const errorMessage = error instanceof Error ? error.message : String(error);

    // Email service errors
    if (errorMessage.includes('EAUTH') || errorMessage.includes('auth')) {
      return this.serviceUnavailable('Email service');
    }

    // Database errors
    if (errorMessage.includes('database') || errorMessage.includes('prisma')) {
      return this.internalError('access database', error);
    }

    // Rate limit/quota errors
    if (errorMessage.includes('rate') || errorMessage.includes('quota')) {
      return this.insufficientResources('Too many requests. Please try again later.', 'rate_limit');
    }

    // Timeout errors
    if (errorMessage.includes('timeout') || errorMessage.includes('ETIMEDOUT')) {
      return this.serviceUnavailable('Remote service');
    }

    // Default to internal error
    return this.internalError(context || 'process request', error);
  }
}

/**
 * Response helper to send consistent API responses
 */
export const ApiResponse = {
  success: <T>(data: T, message = 'Success') => ({
    success: true,
    message,
    data,
  }),

  error: (error: ApiError) => error,

  paginated: <T>(
    data: T[],
    total: number,
    page: number,
    pageSize: number,
    message = 'Success'
  ) => ({
    success: true,
    message,
    data,
    pagination: {
      total,
      page,
      pageSize,
      pages: Math.ceil(total / pageSize),
    },
  }),
};
