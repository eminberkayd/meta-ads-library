import type { ApiError } from './types.js';

/**
 * Base error class for Ads Library API errors
 */
export class AdsLibraryError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AdsLibraryError';
    Object.setPrototypeOf(this, AdsLibraryError.prototype);
  }
}

/**
 * Error thrown when the API returns an error response
 */
export class ApiRequestError extends AdsLibraryError {
  public readonly code: number;
  public readonly type: string;
  public readonly errorSubcode?: number;
  public readonly fbtraceId?: string;

  constructor(error: ApiError) {
    super(error.message);
    this.name = 'ApiRequestError';
    this.code = error.code;
    this.type = error.type;
    this.errorSubcode = error.error_subcode;
    this.fbtraceId = error.fbtrace_id;
    Object.setPrototypeOf(this, ApiRequestError.prototype);
  }
}

/**
 * Error thrown when required parameters are missing
 */
export class ValidationError extends AdsLibraryError {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

/**
 * Error thrown when a network request fails
 */
export class NetworkError extends AdsLibraryError {
  public readonly statusCode?: number;

  constructor(message: string, statusCode?: number) {
    super(message);
    this.name = 'NetworkError';
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, NetworkError.prototype);
  }
}
