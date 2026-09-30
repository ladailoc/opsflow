import { ImpactLevel, UrgencyLevel, PriorityLevel } from '@/lib/priority';
import { TicketSla } from '@/lib/sla';

export type TicketStatus =
  | 'NEW'
  | 'IN_PROGRESS'
  | 'WAITING_FOR_EMPLOYEE'
  | 'RESOLVED'
  | 'CLOSED'
  | 'CANCELLED';

export interface Ticket {
  id: string;
  ticketCode: string;
  title: string;
  description: string;
  requestTypeId: string;
  requestTypeName: string;
  impact: ImpactLevel;
  urgency: UrgencyLevel;
  priority: PriorityLevel;
  status: TicketStatus;
  creatorId: string;
  creatorName: string;
  creatorDepartment: string;
  assigneeId: string | null;
  assigneeName: string | null;
  createdAt: string;
  updatedAt: string;
  latestResolvedAt: string | null;
  version: number; // for optimistic concurrency simulation
  sla: TicketSla;
}

export const MOCK_TICKETS: Ticket[] = [
  // 1. P1 - IN_PROGRESS - Maya Chen
  {
    id: 't-00124',
    ticketCode: 'IT-2026-00124',
    title: 'Network switch port failure in Building B East Wing',
    description: 'All 25 engineering workstations in east wing lost network connectivity abruptly at 08:15 AM. Cable connections appear intact but switch LEDs show amber fault code.',
    requestTypeId: 'req-03',
    requestTypeName: 'Network & VPN Access',
    impact: 'HIGH',
    urgency: 'HIGH',
    priority: 'P1',
    status: 'IN_PROGRESS',
    creatorId: 'user-emp-01',
    creatorName: 'Alex Nguyen',
    creatorDepartment: 'Engineering',
    assigneeId: 'user-agt-01',
    assigneeName: 'Maya Chen',
    createdAt: '2026-09-24T08:15:00+07:00',
    updatedAt: '2026-09-24T08:45:00+07:00',
    latestResolvedAt: null,
    version: 3,
    sla: {
      firstResponseTargetMinutes: 15,
      firstResponseDueAt: '2026-09-24T08:30:00+07:00',
      firstResponseAchievedAt: '2026-09-24T08:40:00+07:00',
      firstResponseState: 'OVERDUE',
      resolutionTargetMinutes: 240, // 4h
      resolutionDueAt: '2026-09-24T12:15:00+07:00',
      resolutionElapsedMinutes: 30,
      resolutionPausedAt: null,
      resolutionAchievedAt: null,
      resolutionState: 'NORMAL',
    },
  },

  // 2. P3 - WAITING_FOR_EMPLOYEE - Daniel Tran
  {
    id: 't-00125',
    ticketCode: 'IT-2026-00125',
    title: 'Request JetBrains IntelliJ IDEA Ultimate license renewal',
    description: 'My current annual license expired yesterday. Need renewal for backend microservices development on Q3 projects.',
    requestTypeId: 'req-02',
    requestTypeName: 'Software & Applications',
    impact: 'LOW',
    urgency: 'MEDIUM',
    priority: 'P3',
    status: 'WAITING_FOR_EMPLOYEE',
    creatorId: 'user-emp-02',
    creatorName: 'Lan Hoang',
    creatorDepartment: 'Finance',
    assigneeId: 'user-agt-02',
    assigneeName: 'Daniel Tran',
    createdAt: '2026-09-23T11:00:00+07:00',
    updatedAt: '2026-09-23T14:20:00+07:00',
    latestResolvedAt: null,
    version: 4,
    sla: {
      firstResponseTargetMinutes: 240, // 4h
      firstResponseDueAt: '2026-09-23T15:00:00+07:00',
      firstResponseAchievedAt: '2026-09-23T14:20:00+07:00',
      firstResponseState: 'NORMAL',
      resolutionTargetMinutes: 1440, // 24h
      resolutionDueAt: '2026-09-24T11:00:00+07:00',
      resolutionElapsedMinutes: 200, // spent in NEW + IN_PROGRESS before pause
      resolutionPausedAt: '2026-09-23T14:20:00+07:00',
      resolutionAchievedAt: null,
      resolutionState: 'NORMAL',
    },
  },

  // 3. P2 - RESOLVED - Maya Chen (Eligible for Average Resolution Time)
  {
    id: 't-00126',
    ticketCode: 'IT-2026-00126',
    title: 'Dell Latitude 5420 battery bulging and keyboard swelling',
    description: 'Trackpad has popped up 2mm and laptop case does not close properly. System temperature is elevated.',
    requestTypeId: 'req-01',
    requestTypeName: 'Hardware & Workstation',
    impact: 'HIGH',
    urgency: 'MEDIUM',
    priority: 'P2',
    status: 'RESOLVED',
    creatorId: 'user-emp-03',
    creatorName: 'David Vu',
    creatorDepartment: 'Marketing',
    assigneeId: 'user-agt-01',
    assigneeName: 'Maya Chen',
    createdAt: '2026-09-22T09:00:00+07:00',
    updatedAt: '2026-09-22T15:30:00+07:00',
    latestResolvedAt: '2026-09-22T15:30:00+07:00',
    version: 5,
    sla: {
      firstResponseTargetMinutes: 60,
      firstResponseDueAt: '2026-09-22T10:00:00+07:00',
      firstResponseAchievedAt: '2026-09-22T09:20:00+07:00',
      firstResponseState: 'NORMAL',
      resolutionTargetMinutes: 480, // 8h
      resolutionDueAt: '2026-09-22T17:00:00+07:00',
      resolutionElapsedMinutes: 360, // 6 hours total
      resolutionPausedAt: '2026-09-22T15:30:00+07:00',
      resolutionAchievedAt: '2026-09-22T15:30:00+07:00',
      resolutionState: 'NORMAL',
    },
  },

  // 4. P2 - CLOSED - Minh Le (Eligible for Average Resolution Time)
  {
    id: 't-00127',
    ticketCode: 'IT-2026-00127',
    title: 'MFA re-registration required after mobile device loss',
    description: 'Replaced stolen work phone with new company iPhone. Need authenticator push reset for Azure AD.',
    requestTypeId: 'req-04',
    requestTypeName: 'Account & Permission',
    impact: 'MEDIUM',
    urgency: 'HIGH',
    priority: 'P2',
    status: 'CLOSED',
    creatorId: 'user-emp-01',
    creatorName: 'Alex Nguyen',
    creatorDepartment: 'Engineering',
    assigneeId: 'user-agt-03',
    assigneeName: 'Minh Le',
    createdAt: '2026-09-20T08:30:00+07:00',
    updatedAt: '2026-09-20T10:45:00+07:00',
    latestResolvedAt: '2026-09-20T10:15:00+07:00',
    version: 4,
    sla: {
      firstResponseTargetMinutes: 60,
      firstResponseDueAt: '2026-09-20T09:30:00+07:00',
      firstResponseAchievedAt: '2026-09-20T09:00:00+07:00',
      firstResponseState: 'NORMAL',
      resolutionTargetMinutes: 480, // 8h
      resolutionDueAt: '2026-09-20T16:30:00+07:00',
      resolutionElapsedMinutes: 105, // 1h 45m
      resolutionPausedAt: '2026-09-20T10:15:00+07:00',
      resolutionAchievedAt: '2026-09-20T10:15:00+07:00',
      resolutionState: 'NORMAL',
    },
  },

  // 5. P1 - NEW - Unassigned (OVERDUE for First Response SLA)
  {
    id: 't-00128',
    ticketCode: 'IT-2026-00128',
    title: 'Global VPN Gateway cluster returning TLS handshake timeout',
    description: 'Remote staff in Da Nang and Singapore branches cannot authenticate to internal git servers or intranet via FortiClient VPN.',
    requestTypeId: 'req-03',
    requestTypeName: 'Network & VPN Access',
    impact: 'HIGH',
    urgency: 'HIGH',
    priority: 'P1',
    status: 'NEW',
    creatorId: 'user-emp-02',
    creatorName: 'Lan Hoang',
    creatorDepartment: 'Finance',
    assigneeId: null, // UNASSIGNED!
    assigneeName: null,
    createdAt: '2026-09-24T07:45:00+07:00',
    updatedAt: '2026-09-24T07:45:00+07:00',
    latestResolvedAt: null,
    version: 1,
    sla: {
      firstResponseTargetMinutes: 15,
      firstResponseDueAt: '2026-09-24T08:00:00+07:00', // Already past 08:00 => OVERDUE
      firstResponseAchievedAt: null,
      firstResponseState: 'OVERDUE',
      resolutionTargetMinutes: 240, // 4h
      resolutionDueAt: '2026-09-24T11:45:00+07:00',
      resolutionElapsedMinutes: 70,
      resolutionPausedAt: null,
      resolutionAchievedAt: null,
      resolutionState: 'NORMAL',
    },
  },

  // 6. P2 - NEW - Assigned to Maya Chen (Not started yet; demonstrates Employee CAN still edit)
  {
    id: 't-00129',
    ticketCode: 'IT-2026-00129',
    title: 'GitLab repository push rejected with 403 Forbidden for OpsFlow team',
    description: 'Developers received pre-receive hook permission errors after branch policy update. Need push rights restored to release candidate branches.',
    requestTypeId: 'req-04',
    requestTypeName: 'Account & Permission',
    impact: 'MEDIUM',
    urgency: 'HIGH',
    priority: 'P2',
    status: 'NEW',
    creatorId: 'user-emp-01',
    creatorName: 'Alex Nguyen',
    creatorDepartment: 'Engineering',
    assigneeId: 'user-agt-01',
    assigneeName: 'Maya Chen',
    createdAt: '2026-09-24T08:30:00+07:00',
    updatedAt: '2026-09-24T08:35:00+07:00',
    latestResolvedAt: null,
    version: 2,
    sla: {
      firstResponseTargetMinutes: 60,
      firstResponseDueAt: '2026-09-24T09:30:00+07:00',
      firstResponseAchievedAt: null,
      firstResponseState: 'NORMAL',
      resolutionTargetMinutes: 480, // 8h
      resolutionDueAt: '2026-09-24T16:30:00+07:00',
      resolutionElapsedMinutes: 15,
      resolutionPausedAt: null,
      resolutionAchievedAt: null,
      resolutionState: 'NORMAL',
    },
  },

  // 7. P3 - CANCELLED - Alex Nguyen (Excluded from Dashboard Avg Resolution Time)
  {
    id: 't-00130',
    ticketCode: 'IT-2026-00130',
    title: 'Monitor flickering on workstation desk 412',
    description: 'HDMI cable was loose; resolved by reseating cable firmly into GPU port. No IT visit needed.',
    requestTypeId: 'req-01',
    requestTypeName: 'Hardware & Workstation',
    impact: 'LOW',
    urgency: 'MEDIUM',
    priority: 'P3',
    status: 'CANCELLED',
    creatorId: 'user-emp-01',
    creatorName: 'Alex Nguyen',
    creatorDepartment: 'Engineering',
    assigneeId: null,
    assigneeName: null,
    createdAt: '2026-09-21T14:00:00+07:00',
    updatedAt: '2026-09-21T14:25:00+07:00',
    latestResolvedAt: null,
    version: 2,
    sla: {
      firstResponseTargetMinutes: 240,
      firstResponseDueAt: '2026-09-21T18:00:00+07:00',
      firstResponseAchievedAt: null,
      firstResponseState: 'NORMAL',
      resolutionTargetMinutes: 1440,
      resolutionDueAt: '2026-09-22T14:00:00+07:00',
      resolutionElapsedMinutes: 25,
      resolutionPausedAt: null,
      resolutionAchievedAt: null,
      resolutionState: 'NORMAL',
    },
  },

  // 8. P2 - IN_PROGRESS - Reopened ticket (Daniel Tran)
  // Demonstrates: previously resolved, reopened with reason, currently IN_PROGRESS,
  // accumulated 200m before reopen + 30m after reopen = 230m.
  // Must be TEMPORARILY EXCLUDED from Average Resolution Time because current status is IN_PROGRESS!
  {
    id: 't-00131',
    ticketCode: 'IT-2026-00131',
    title: 'ERP accounting software crashing during PDF statement export',
    description: 'Accounting team reports persistent memory access violation on module FIN-704 when running month-end close statements.',
    requestTypeId: 'req-02',
    requestTypeName: 'Software & Applications',
    impact: 'HIGH',
    urgency: 'MEDIUM',
    priority: 'P2',
    status: 'IN_PROGRESS',
    creatorId: 'user-emp-02',
    creatorName: 'Lan Hoang',
    creatorDepartment: 'Finance',
    assigneeId: 'user-agt-02',
    assigneeName: 'Daniel Tran',
    createdAt: '2026-09-19T09:00:00+07:00',
    updatedAt: '2026-09-24T08:00:00+07:00',
    latestResolvedAt: '2026-09-21T17:00:00+07:00', // Previous resolved date
    version: 6,
    sla: {
      firstResponseTargetMinutes: 60,
      firstResponseDueAt: '2026-09-19T10:00:00+07:00',
      firstResponseAchievedAt: '2026-09-19T09:30:00+07:00',
      firstResponseState: 'NORMAL',
      resolutionTargetMinutes: 480, // 8h
      resolutionDueAt: '2026-09-24T12:00:00+07:00',
      resolutionElapsedMinutes: 230,
      resolutionPausedAt: null,
      resolutionAchievedAt: null,
      resolutionState: 'NORMAL',
    },
  },

  // 9. P4 - NEW - Unassigned (DUE_SOON)
  {
    id: 't-00132',
    ticketCode: 'IT-2026-00132',
    title: 'Adjust dual-monitor arm tension on desk 204',
    description: 'The right monitor gently sags down when adjusted to portrait mode. Needs allen key adjustment.',
    requestTypeId: 'req-01',
    requestTypeName: 'Hardware & Workstation',
    impact: 'LOW',
    urgency: 'LOW',
    priority: 'P4',
    status: 'NEW',
    creatorId: 'user-emp-03',
    creatorName: 'David Vu',
    creatorDepartment: 'Marketing',
    assigneeId: null,
    assigneeName: null,
    createdAt: '2026-09-23T18:00:00+07:00',
    updatedAt: '2026-09-23T18:00:00+07:00',
    latestResolvedAt: null,
    version: 1,
    sla: {
      firstResponseTargetMinutes: 480, // 8h
      firstResponseDueAt: '2026-09-24T09:00:00+07:00', // ~10m remaining => DUE_SOON
      firstResponseAchievedAt: null,
      firstResponseState: 'DUE_SOON',
      resolutionTargetMinutes: 4320, // 72h
      resolutionDueAt: '2026-09-26T18:00:00+07:00',
      resolutionElapsedMinutes: 420,
      resolutionPausedAt: null,
      resolutionAchievedAt: null,
      resolutionState: 'NORMAL',
    },
  },

  // 10. P1 - RESOLVED - Maya Chen (Eligible for Average Resolution Time)
  {
    id: 't-00133',
    ticketCode: 'IT-2026-00133',
    title: 'Production database read replica latency spike',
    description: 'High replication lag causing reporting dashboard timeouts. Replica restarted and buffer pools tuned.',
    requestTypeId: 'req-05',
    requestTypeName: 'Security Incident',
    impact: 'HIGH',
    urgency: 'HIGH',
    priority: 'P1',
    status: 'RESOLVED',
    creatorId: 'user-emp-01',
    creatorName: 'Alex Nguyen',
    creatorDepartment: 'Engineering',
    assigneeId: 'user-agt-01',
    assigneeName: 'Maya Chen',
    createdAt: '2026-09-23T08:00:00+07:00',
    updatedAt: '2026-09-23T10:00:00+07:00',
    latestResolvedAt: '2026-09-23T10:00:00+07:00',
    version: 4,
    sla: {
      firstResponseTargetMinutes: 15,
      firstResponseDueAt: '2026-09-23T08:15:00+07:00',
      firstResponseAchievedAt: '2026-09-23T08:10:00+07:00',
      firstResponseState: 'NORMAL',
      resolutionTargetMinutes: 240, // 4h
      resolutionDueAt: '2026-09-23T12:00:00+07:00',
      resolutionElapsedMinutes: 120, // 2h total
      resolutionPausedAt: '2026-09-23T10:00:00+07:00',
      resolutionAchievedAt: '2026-09-23T10:00:00+07:00',
      resolutionState: 'NORMAL',
    },
  },
];
