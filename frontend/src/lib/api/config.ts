/**
 * API configuration and CSRF token management.
 */

let inMemoryCsrfToken: string | null = null;

export const API_CONFIG = {
  /**
   * Base URL for API requests.
   * Default is empty string so browser requests use relative paths like `/api/v1/*`.
   * This allows Next.js dev rewrite to forward to localhost:8080 during local development,
   * and Nginx to forward to Spring Boot in AWS demo environment without code changes.
   */
  getBaseUrl(): string {
    const envUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (envUrl) {
      return envUrl.replace(/\/+$/, '');
    }
    return '';
  },

  apiPrefix: '/api/v1',

  csrfHeaderName: 'X-CSRF-TOKEN',

  setCsrfToken(token: string | null): void {
    inMemoryCsrfToken = token;
  },

  getCsrfToken(): string | null {
    if (inMemoryCsrfToken) {
      return inMemoryCsrfToken;
    }
    // Attempt to extract XSRF-TOKEN from document.cookie if running in browser
    if (typeof document !== 'undefined') {
      const match = document.cookie.match(/(?:^|;\s*)XSRF-TOKEN=([^;]+)/);
      if (match) {
        return decodeURIComponent(match[1]);
      }
    }
    return null;
  },

  isMutationMethod(method?: string): boolean {
    if (!method) return false;
    const m = method.toUpperCase();
    return m === 'POST' || m === 'PUT' || m === 'PATCH' || m === 'DELETE';
  },
};
