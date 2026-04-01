import { AxiosError } from "axios";

export interface ErrorContext {
  component?: string;
  action?: string;
  userId?: string;
  requestId?: string;
  timestamp?: string;
}

export interface AppError {
  message: string;
  code?: string;
  statusCode?: number;
  context?: ErrorContext;
  originalError?: Error | unknown;
}

export class BloodDonationError extends Error {
  public readonly code: string;
  public readonly statusCode: number;
  public readonly context?: ErrorContext;
  public readonly originalError?: Error | unknown;

  constructor(
    message: string,
    code: string = "UNKNOWN_ERROR",
    statusCode: number = 500,
    context?: ErrorContext,
    originalError?: Error | unknown
  ) {
    super(message);
    this.name = "BloodDonationError";
    this.code = code;
    this.statusCode = statusCode;
    this.context = context;
    this.originalError = originalError;
  }
}

export const ErrorCodes = {
  NETWORK_ERROR: "NETWORK_ERROR",
  AUTHENTICATION_ERROR: "AUTHENTICATION_ERROR",
  AUTHORIZATION_ERROR: "AUTHORIZATION_ERROR",
  VALIDATION_ERROR: "VALIDATION_ERROR",
  NOT_FOUND: "NOT_FOUND",
  SERVER_ERROR: "SERVER_ERROR",
  TIMEOUT_ERROR: "TIMEOUT_ERROR",
  RATE_LIMIT_ERROR: "RATE_LIMIT_ERROR",
  CONFLICT_ERROR: "CONFLICT_ERROR",
  UNKNOWN_ERROR: "UNKNOWN_ERROR",
  DONOR_NOT_FOUND: "DONOR_NOT_FOUND",
  REQUEST_NOT_FOUND: "REQUEST_NOT_FOUND",
  BLOOD_TYPE_MISMATCH: "BLOOD_TYPE_MISMATCH",
  INVALID_LOCATION: "INVALID_LOCATION",
  DUPLICATE_REQUEST: "DUPLICATE_REQUEST",
} as const;

export type ErrorCode = (typeof ErrorCodes)[keyof typeof ErrorCodes];

/** Extract the best human-readable message from any error shape. */
export const getErrorMessage = (error: AppError | Error | unknown): string => {
  if (error instanceof BloodDonationError) {
    return error.message;
  }

  // AxiosError: prefer server-side message from response body
  if (error instanceof AxiosError) {
    const serverMsg =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.response?.data?.errors?.[0]?.message;
    if (serverMsg && typeof serverMsg === "string") return serverMsg;
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "string") {
    return error;
  }

  if (error && typeof error === "object" && "message" in error) {
    return (error as { message: string }).message;
  }

  return "An unexpected error occurred. Please try again.";
};

/** HTTP status → ErrorCode mapping */
function httpStatusToCode(status: number): ErrorCode {
  if (status === 400) return ErrorCodes.VALIDATION_ERROR;
  if (status === 401) return ErrorCodes.AUTHENTICATION_ERROR;
  if (status === 403) return ErrorCodes.AUTHORIZATION_ERROR;
  if (status === 404) return ErrorCodes.NOT_FOUND;
  if (status === 409) return ErrorCodes.CONFLICT_ERROR;
  if (status === 422) return ErrorCodes.VALIDATION_ERROR;
  if (status === 429) return ErrorCodes.RATE_LIMIT_ERROR;
  if (status >= 500) return ErrorCodes.SERVER_ERROR;
  return ErrorCodes.UNKNOWN_ERROR;
}

/** Return a user-friendly message based on the error code / type. */
export const getUserFriendlyMessage = (
  error: AppError | Error | unknown
): string => {
  if (error instanceof BloodDonationError) {
    switch (error.code) {
      case ErrorCodes.NETWORK_ERROR:
        return "Unable to connect to our servers. Please check your internet connection and try again.";
      case ErrorCodes.AUTHENTICATION_ERROR:
        return "Your session has expired. Please log in to continue.";
      case ErrorCodes.AUTHORIZATION_ERROR:
        return "You don't have permission to perform this action.";
      case ErrorCodes.VALIDATION_ERROR:
        return error.message || "Please check your input and try again.";
      case ErrorCodes.NOT_FOUND:
        return "The requested information could not be found.";
      case ErrorCodes.SERVER_ERROR:
        return "Our servers are experiencing issues. Please try again later.";
      case ErrorCodes.TIMEOUT_ERROR:
        return "The request took too long to complete. Please try again.";
      case ErrorCodes.RATE_LIMIT_ERROR:
        return "Too many requests. Please wait a moment before trying again.";
      case ErrorCodes.CONFLICT_ERROR:
        return error.message || "This action conflicts with existing data.";
      case ErrorCodes.DONOR_NOT_FOUND:
        return "No donor found matching your criteria.";
      case ErrorCodes.REQUEST_NOT_FOUND:
        return "The blood donation request could not be found.";
      case ErrorCodes.BLOOD_TYPE_MISMATCH:
        return "The blood type is not compatible with the request.";
      case ErrorCodes.INVALID_LOCATION:
        return "The location provided is invalid or out of service area.";
      case ErrorCodes.DUPLICATE_REQUEST:
        return "You have already submitted a similar request.";
      default:
        return error.message || "An unexpected error occurred. Please try again.";
    }
  }

  // Smart Axios error handling
  if (error instanceof AxiosError) {
    if (!error.response) {
      // No response = network / CORS / timeout
      if (error.code === "ECONNABORTED" || error.message.includes("timeout")) {
        return "The request took too long to complete. Please try again.";
      }
      return "Unable to connect to our servers. Please check your internet connection.";
    }

    const status = error.response.status;
    // Always try to surface the server's own message first
    const serverMsg =
      error.response.data?.message ||
      error.response.data?.error ||
      error.response.data?.errors?.[0]?.message;

    if (serverMsg && typeof serverMsg === "string") return serverMsg;

    // Fall back to generic status-based messages
    const code = httpStatusToCode(status);
    const tempError = new BloodDonationError("", code, status);
    return getUserFriendlyMessage(tempError);
  }

  if (error instanceof Error) {
    if (error.message.toLowerCase().includes("network error")) {
      return "Unable to connect to our servers. Please check your internet connection.";
    }
    if (error.message.toLowerCase().includes("timeout")) {
      return "The request took too long to complete. Please try again.";
    }
  }

  return getErrorMessage(error);
};

export const logError = (
  error: AppError | Error | unknown,
  context?: ErrorContext
): void => {
  const errorInfo = {
    timestamp: new Date().toISOString(),
    message: getErrorMessage(error),
    context: context || {},
    stack: error instanceof Error ? error.stack : undefined,
    originalError: error,
  };

  if (process.env.NODE_ENV === "development") {
    console.error("Blood Donation App Error:", errorInfo);
  }

  // Production: send to error tracking service
  // Example: Sentry.captureException(error, { extra: context });
};

/**
 * Convert any thrown value into a typed BloodDonationError.
 * Handles AxiosError intelligently using HTTP status codes.
 */
export const createAppError = (
  error: Error | unknown,
  defaultMessage: string = "An unexpected error occurred",
  context?: ErrorContext
): BloodDonationError => {
  if (error instanceof BloodDonationError) {
    return error;
  }

  // Handle AxiosError with HTTP status awareness
  if (error instanceof AxiosError) {
    if (!error.response) {
      // Network / timeout
      const isTimeout =
        error.code === "ECONNABORTED" || error.message.includes("timeout");
      return new BloodDonationError(
        getUserFriendlyMessage(error),
        isTimeout ? ErrorCodes.TIMEOUT_ERROR : ErrorCodes.NETWORK_ERROR,
        isTimeout ? 408 : 0,
        context,
        error
      );
    }

    const status = error.response.status;
    const code = httpStatusToCode(status);
    const message = getUserFriendlyMessage(error);
    return new BloodDonationError(message, code, status, context, error);
  }

  if (error instanceof Error) {
    if (
      error.message.toLowerCase().includes("network error") ||
      error.message.toLowerCase().includes("fetch")
    ) {
      return new BloodDonationError(
        getUserFriendlyMessage(error),
        ErrorCodes.NETWORK_ERROR,
        0,
        context,
        error
      );
    }

    if (error.message.toLowerCase().includes("timeout")) {
      return new BloodDonationError(
        getUserFriendlyMessage(error),
        ErrorCodes.TIMEOUT_ERROR,
        408,
        context,
        error
      );
    }

    return new BloodDonationError(
      error.message || defaultMessage,
      ErrorCodes.UNKNOWN_ERROR,
      500,
      context,
      error
    );
  }

  return new BloodDonationError(
    defaultMessage,
    ErrorCodes.UNKNOWN_ERROR,
    500,
    context,
    error
  );
};
