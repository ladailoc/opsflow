/**
 * Core domain types and enums for OpsFlow.
 * Aligned with docs/architecture/data-model-v1.md and Product Backlog v1.0.
 */

export type Role = 'EMPLOYEE' | 'SUPPORT_AGENT' | 'ADMINISTRATOR';

export type UserStatus = 'ACTIVE' | 'LOCKED';

export type TicketStatus =
  | 'NEW'
  | 'IN_PROGRESS'
  | 'WAITING_FOR_EMPLOYEE'
  | 'RESOLVED'
  | 'CLOSED'
  | 'CANCELLED';

export type ImpactLevel = 'HIGH' | 'MEDIUM' | 'LOW';

export type UrgencyLevel = 'HIGH' | 'MEDIUM' | 'LOW';

export type PriorityLevel = 'P1' | 'P2' | 'P3' | 'P4';

export type CommentVisibility = 'PUBLIC' | 'INTERNAL';

export type RequestTypeStatus = 'ACTIVE' | 'INACTIVE';

export type AuditEntityType = 'TICKET' | 'USER' | 'REQUEST_TYPE';

export type AuditVisibility = 'PUBLIC' | 'INTERNAL';

export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt?: string;
}

export interface UserSummary {
  id: string;
  username: string;
  displayName: string;
  email?: string | null;
  role: Role;
  accountStatus: UserStatus;
}
