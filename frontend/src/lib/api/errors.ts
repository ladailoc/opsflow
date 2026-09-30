import { ApiErrorPayload } from '@/types/api';

/**
 * Standard HTTP error thrown by ApiClient.
 */
export class ApiClientError extends Error {
  readonly status: number;
  readonly statusText: string;
  readonly errorCode?: string;
  readonly data?: ApiErrorPayload;
  readonly response: Response;

  constructor(response: Response, data?: ApiErrorPayload) {
    const errorCode = data?.errorCode || data?.error;
    const message =
      data?.message ||
      (errorCode ? `API error: ${errorCode}` : `HTTP error ${response.status}: ${response.statusText}`);

    super(message);
    this.name = 'ApiClientError';
    this.status = response.status;
    this.statusText = response.statusText;
    this.errorCode = errorCode;
    this.data = data;
    this.response = response;

    // Maintains proper stack trace for where error was thrown (V8 only)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiClientError);
    }
  }

  get isStaleTicket(): boolean {
    return this.status === 409 || this.errorCode === 'STALE_TICKET';
  }

  get isUnauthorized(): boolean {
    return this.status === 401;
  }

  get isForbidden(): boolean {
    return this.status === 403;
  }

  get isNotFound(): boolean {
    return this.status === 404;
  }

  get isBadRequest(): boolean {
    return this.status === 400;
  }

  get isServerError(): boolean {
    return this.status >= 500;
  }
}

export function isApiClientError(error: unknown): error is ApiClientError {
  return error instanceof ApiClientError;
}

export function getErrorMessage(error: unknown, fallback = 'Đã có lỗi xảy ra. Vui lòng thử lại.'): string {
  if (isApiClientError(error)) {
    if (error.isStaleTicket) {
      return 'Dữ liệu đã bị thay đổi bởi người khác. Vui lòng tải lại trang để xem thông tin mới nhất.';
    }
    if (error.data?.message) {
      return error.data.message;
    }
    if (error.message) {
      return error.message;
    }
  }
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return fallback;
}
