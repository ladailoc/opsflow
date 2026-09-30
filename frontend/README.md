# OpsFlow Frontend (T0.2 Foundation)

Next.js frontend application for OpsFlow. This task establishes the frontend project baseline, directory organization, REST API client foundation, and local development proxy configuration to prepare for Spring Boot backend integration.

## Technology Baseline

Verified local toolchain and dependencies:
- **Node.js**: 22.23.1 / **npm**: 10.9.8
- **Next.js**: 14.2.15
- **React / React DOM**: 18.3.1
- **TypeScript**: 5.9.3
- **Tailwind CSS**: 3.4.19
- **Utility libraries**: `clsx`, `tailwind-merge`, `class-variance-authority`, `lucide-react`

## Directory Structure

```text
frontend/
  src/
    app/              # Next.js App Router (pages & layouts for employee, agent, admin, login)
    features/         # Domain-oriented vertical slice modules (auth, tickets, queue, etc.)
    components/       # Shared UI, layout, feedback, and ticket components
    lib/
      api/            # REST API client foundation (/api/v1), errors, and configuration
      permissions.ts  # Role and permission checks
      priority.ts     # Priority matrix calculation logic
      sla.ts          # SLA tracking helpers
      utils.ts        # Common string and styling utilities
    types/            # Shared TypeScript types (API envelopes, errors, core domain entities)
    mocks/            # Mock datasets for prototype demonstration
    prototype/        # Local prototype reducer/state (to be incrementally replaced by API client)
```

## REST API Client (`src/lib/api`)

The foundation `ApiClient` prepares OpsFlow for communication with the Spring Boot backend (`/api/v1`):
- **Cookie Authentication**: Requests use `credentials: 'include'` so HttpOnly session cookies are transmitted automatically.
- **JSON Handling**: Standard JSON request serialization and response parsing.
- **Unified Error Handling**: Throws `ApiClientError` with HTTP status, error code, and error details. Includes helpers for `isStaleTicket` (HTTP 409 / `STALE_TICKET`), `isUnauthorized` (HTTP 401), and `isForbidden` (HTTP 403).
- **Environment Resolution**: Defaults to relative paths (e.g. `/api/v1/tickets`) for seamless compatibility with Next.js rewrites in local development and Nginx reverse proxy in demo/production. Override via `NEXT_PUBLIC_API_BASE_URL` when needed.
- **CSRF Readiness**: Built-in support for injecting CSRF token headers (`X-CSRF-TOKEN`) on mutation requests (`POST`, `PUT`, `PATCH`, `DELETE`).

*Note:* Full JWT refresh token rotation loop is deferred until T0.4/T1.2 finalize the auth API contract.

## Local Dev Proxy (Rewrites)

In `next.config.mjs`, requests to `/api/v1/:path*` are rewritten to the local Spring Boot backend (default `http://localhost:8080/api/v1/:path*`, configurable via `BACKEND_URL`).

Example `.env.local`:
```env
BACKEND_URL=http://localhost:8080
```

## Prototype vs. Production Integration

- **Working Prototype**: Prototype routes (`/employee/*`, `/agent/*`, `/admin/*`) continue to operate with mock data and local state in `src/prototype/` without disruption.
- **Integration Path**: In subsequent tasks (e.g. T1.3 for Login, T3.4 for Create Ticket), UI components will switch from prototype reducer actions to `apiClient` calls.

## Commands

```bash
# Install dependencies according to package-lock.json
npm ci

# Run development server (http://localhost:3000)
npm run dev

# TypeScript type check
npm run typecheck

# Production build
npm run build
```
