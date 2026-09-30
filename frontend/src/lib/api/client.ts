import { RequestOptions, ApiErrorPayload } from '@/types/api';
import { API_CONFIG } from './config';
import { ApiClientError } from './errors';

export class ApiClient {
  private baseUrl: string;
  private defaultPrefix: string;

  constructor(baseUrl?: string, defaultPrefix = API_CONFIG.apiPrefix) {
    this.baseUrl = baseUrl !== undefined ? baseUrl : API_CONFIG.getBaseUrl();
    this.defaultPrefix = defaultPrefix;
  }

  /**
   * Resolves the full URL for an endpoint, appending query parameters if provided.
   */
  private buildUrl(endpoint: string, params?: RequestOptions['params']): string {
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    // If endpoint already starts with /api/, do not prepend defaultPrefix
    const path = cleanEndpoint.startsWith('/api/') ? cleanEndpoint : `${this.defaultPrefix}${cleanEndpoint}`;
    const fullPath = `${this.baseUrl}${path}`;

    if (!params) {
      return fullPath;
    }

    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, String(value));
      }
    });

    const queryString = searchParams.toString();
    return queryString ? `${fullPath}?${queryString}` : fullPath;
  }

  /**
   * Core request dispatcher.
   */
  async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { params, csrfToken, skipCsrf, headers, method = 'GET', ...restOptions } = options;

    const url = this.buildUrl(endpoint, params);
    const requestHeaders = new Headers(headers);

    // Default JSON accept header
    if (!requestHeaders.has('Accept')) {
      requestHeaders.set('Accept', 'application/json');
    }

    // CSRF integration for mutating requests
    if (!skipCsrf && API_CONFIG.isMutationMethod(method)) {
      const token = csrfToken || API_CONFIG.getCsrfToken();
      if (token && !requestHeaders.has(API_CONFIG.csrfHeaderName)) {
        requestHeaders.set(API_CONFIG.csrfHeaderName, token);
      }
    }

    const fetchConfig: RequestInit = {
      ...restOptions,
      method,
      headers: requestHeaders,
      // Always include credentials to send HttpOnly auth cookies
      credentials: 'include',
    };

    let response: Response;
    try {
      response = await fetch(url, fetchConfig);
    } catch (networkError) {
      throw new Error(
        networkError instanceof Error
          ? `Network error: ${networkError.message}`
          : 'Network error occurred while contacting the server.'
      );
    }

    if (!response.ok) {
      let errorPayload: ApiErrorPayload | undefined;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        try {
          errorPayload = (await response.json()) as ApiErrorPayload;
        } catch {
          // If JSON parsing fails, errorPayload remains undefined
        }
      } else {
        try {
          const text = await response.text();
          if (text) {
            errorPayload = { message: text };
          }
        } catch {
          // Text parsing fails
        }
      }

      throw new ApiClientError(response, errorPayload);
    }

    // Handle 204 No Content or empty responses
    if (response.status === 204) {
      return undefined as unknown as T;
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return (await response.json()) as T;
    }

    return (await response.text()) as unknown as T;
  }

  get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  post<T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<T> {
    const headers = new Headers(options?.headers);
    let payload: BodyInit | undefined;

    if (body !== undefined) {
      if (body instanceof FormData) {
        payload = body;
      } else {
        if (!headers.has('Content-Type')) {
          headers.set('Content-Type', 'application/json');
        }
        payload = JSON.stringify(body);
      }
    }

    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      headers,
      body: payload,
    } as RequestOptions & { body?: BodyInit });
  }

  put<T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<T> {
    const headers = new Headers(options?.headers);
    let payload: BodyInit | undefined;

    if (body !== undefined) {
      if (body instanceof FormData) {
        payload = body;
      } else {
        if (!headers.has('Content-Type')) {
          headers.set('Content-Type', 'application/json');
        }
        payload = JSON.stringify(body);
      }
    }

    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      headers,
      body: payload,
    } as RequestOptions & { body?: BodyInit });
  }

  patch<T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<T> {
    const headers = new Headers(options?.headers);
    let payload: BodyInit | undefined;

    if (body !== undefined) {
      if (body instanceof FormData) {
        payload = body;
      } else {
        if (!headers.has('Content-Type')) {
          headers.set('Content-Type', 'application/json');
        }
        payload = JSON.stringify(body);
      }
    }

    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      headers,
      body: payload,
    } as RequestOptions & { body?: BodyInit });
  }

  delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();
