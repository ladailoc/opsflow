# OpsFlow Frontend Features

This directory is reserved for domain-specific feature modules as vertical slices are integrated:

- `auth/`: Authentication, login flow, protected route guards, session state.
- `tickets/`: Create, detail, edit, cancel tickets.
- `queue/`: Support queue, take ticket, assign, reassign.
- `comments/`: Public comments and internal notes timeline.
- `history/`: Audit event timeline and history view.
- `users/`: User management (Admin).
- `request-types/`: Request type management (Admin).
- `dashboard/`: Admin metrics, workload, SLA resolution dashboard.

During the prototype phase, screens in `src/app/` utilize components from `src/components/` and state from `src/prototype/`.
As tasks progress from prototype to API integration, feature-specific business logic, hooks, and services should be encapsulated in their respective feature folders here.
