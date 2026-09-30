import { Role } from './users';

export interface HistoryEntry {
  id: string;
  ticketId: string;
  actorId: string;
  actorName: string;
  actorRole: Role;
  action: string;      // Human-readable summary
  details: string;     // Detailed diff or description
  reason?: string;     // Required for Reassign, Cancel, Resume, Reopen, Admin Close
  timestamp: string;
}

export const MOCK_HISTORY: HistoryEntry[] = [
  // History for IT-2026-00124
  {
    id: 'hist-101',
    ticketId: 't-00124',
    actorId: 'user-emp-01',
    actorName: 'Alex Nguyen',
    actorRole: 'EMPLOYEE',
    action: 'Ticket created',
    details: 'Ticket submitted with Impact: High, Urgency: High. System calculated Priority P1.',
    timestamp: '2026-09-24T08:15:00+07:00',
  },
  {
    id: 'hist-102',
    ticketId: 't-00124',
    actorId: 'user-agt-01',
    actorName: 'Maya Chen',
    actorRole: 'SUPPORT_AGENT',
    action: 'Ticket assigned',
    details: 'Maya Chen took ownership of the ticket. Status remains NEW.',
    timestamp: '2026-09-24T08:20:00+07:00',
  },
  {
    id: 'hist-103',
    ticketId: 't-00124',
    actorId: 'user-agt-01',
    actorName: 'Maya Chen',
    actorRole: 'SUPPORT_AGENT',
    action: 'Processing started',
    details: 'Status transitioned from NEW to IN_PROGRESS. Resolution SLA clock active.',
    timestamp: '2026-09-24T08:25:00+07:00',
  },
  {
    id: 'hist-104',
    ticketId: 't-00124',
    actorId: 'user-agt-01',
    actorName: 'Maya Chen',
    actorRole: 'SUPPORT_AGENT',
    action: 'First response achieved',
    details: 'First public response delivered in 25m (SLA target: 15m). First Response SLA marked OVERDUE.',
    timestamp: '2026-09-24T08:40:00+07:00',
  },

  // History for IT-2026-00125
  {
    id: 'hist-201',
    ticketId: 't-00125',
    actorId: 'user-emp-02',
    actorName: 'Lan Hoang',
    actorRole: 'EMPLOYEE',
    action: 'Ticket created',
    details: 'Ticket submitted with Impact: Medium, Urgency: Medium. Priority calculated as P3.',
    timestamp: '2026-09-23T11:00:00+07:00',
  },
  {
    id: 'hist-202',
    ticketId: 't-00125',
    actorId: 'user-adm-01',
    actorName: 'Sarah Lee',
    actorRole: 'ADMINISTRATOR',
    action: 'Ticket assigned',
    details: 'Assigned to Daniel Tran by Administrator.',
    timestamp: '2026-09-23T13:30:00+07:00',
  },
  {
    id: 'hist-203',
    ticketId: 't-00125',
    actorId: 'user-agt-02',
    actorName: 'Daniel Tran',
    actorRole: 'SUPPORT_AGENT',
    action: 'Processing started',
    details: 'Status transitioned from NEW to IN_PROGRESS.',
    timestamp: '2026-09-23T13:45:00+07:00',
  },
  {
    id: 'hist-204',
    ticketId: 't-00125',
    actorId: 'user-agt-02',
    actorName: 'Daniel Tran',
    actorRole: 'SUPPORT_AGENT',
    action: 'Awaiting employee input',
    details: 'Status transitioned from IN_PROGRESS to WAITING_FOR_EMPLOYEE. Resolution SLA clock paused.',
    reason: 'Department manager approval thread or project budget code required.',
    timestamp: '2026-09-23T14:20:00+07:00',
  },

  // History for IT-2026-00126
  {
    id: 'hist-301',
    ticketId: 't-00126',
    actorId: 'user-emp-03',
    actorName: 'David Vu',
    actorRole: 'EMPLOYEE',
    action: 'Ticket created',
    details: 'Created with Impact: High, Urgency: Medium. Priority calculated as P2.',
    timestamp: '2026-09-22T09:00:00+07:00',
  },
  {
    id: 'hist-302',
    ticketId: 't-00126',
    actorId: 'user-agt-01',
    actorName: 'Maya Chen',
    actorRole: 'SUPPORT_AGENT',
    action: 'Ticket assigned',
    details: 'Maya Chen took ownership of the ticket.',
    timestamp: '2026-09-22T09:15:00+07:00',
  },
  {
    id: 'hist-303',
    ticketId: 't-00126',
    actorId: 'user-agt-01',
    actorName: 'Maya Chen',
    actorRole: 'SUPPORT_AGENT',
    action: 'Processing started',
    details: 'Status transitioned from NEW to IN_PROGRESS.',
    timestamp: '2026-09-22T09:30:00+07:00',
  },
  {
    id: 'hist-304',
    ticketId: 't-00126',
    actorId: 'user-agt-01',
    actorName: 'Maya Chen',
    actorRole: 'SUPPORT_AGENT',
    action: 'Resolved',
    details: 'Status changed from IN_PROGRESS to RESOLVED with public solution. Accumulated resolution time: 6h 0m.',
    reason: 'Hardware battery replacement and load stress test completed successfully.',
    timestamp: '2026-09-22T15:30:00+07:00',
  },
];
