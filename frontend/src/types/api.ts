/**
 * API types and error contracts for OpsFlow REST API (/api/v1).
 */

export interface ApiErrorDetail {
  field?: string;
  message: string;
  code?: string;
}

export interface ApiErrorPayload {
  status?: number;
  error?: string;
  errorCode?: string;
  message?: string;
  path?: string;
  timestamp?: string;
  details?: ApiErrorDetail[];
}

export interface RequestOptions extends Omit<RequestInit, 'body'> {
  params?: Record<string, string | number | boolean | undefined | null>;
  csrfToken?: string;
  skipCsrf?: boolean;
}
