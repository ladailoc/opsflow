import { Ticket } from './tickets';
import { MOCK_USERS, User } from './users';
import { formatMinutes } from '@/lib/utils';

export interface WorkloadItem {
  agentId: string;
  agentName: string;
  avatarColor: string;
  activeTicketCount: number;
}

export interface DashboardMetrics {
  openTicketsCount: number;
  unassignedTicketsCount: number;
  resolutionOverdueCount: number;
  averageResolutionTimeFormatted: string; // e.g. "3h 15m" or "No data"
  eligibleTicketsCount: number;
  workloadByAgent: WorkloadItem[];
  unassignedCount: number;
}

/**
 * Calculates Average Resolution Time based strictly on the confirmed business rules:
 * 1. Only tickets currently in RESOLVED or CLOSED.
 * 2. Latest transition to RESOLVED must be within the reporting period (default 30 calendar days).
 * 3. Excludes current status: NEW, IN_PROGRESS, WAITING_FOR_EMPLOYEE, CANCELLED.
 * 4. Sums resolutionElapsedMinutes (accumulated time in NEW and IN_PROGRESS).
 * 5. If no eligible tickets: returns "No data" (NEVER "0h").
 */
export function calculateAverageResolutionTime(
  tickets: Ticket[],
  daysBack: number = 30,
  referenceDate: Date = new Date('2026-09-24T09:00:00+07:00')
): { formatted: string; count: number; avgMinutes: number } {
  const cutoffTime = new Date(referenceDate.getTime() - daysBack * 24 * 60 * 60 * 1000).getTime();

  const eligible = tickets.filter((t) => {
    // Current status MUST be RESOLVED or CLOSED
    if (t.status !== 'RESOLVED' && t.status !== 'CLOSED') {
      return false;
    }
    // Must have a resolved timestamp
    if (!t.latestResolvedAt) {
      return false;
    }
    const resolvedTime = new Date(t.latestResolvedAt).getTime();
    return resolvedTime >= cutoffTime && resolvedTime <= referenceDate.getTime();
  });

  if (eligible.length === 0) {
    return { formatted: 'No data', count: 0, avgMinutes: 0 };
  }

  const totalMinutes = eligible.reduce((acc, t) => acc + (t.sla.resolutionElapsedMinutes || 0), 0);
  const avgMinutes = Math.round(totalMinutes / eligible.length);

  return {
    formatted: formatMinutes(avgMinutes),
    count: eligible.length,
    avgMinutes,
  };
}

/**
 * Computes live dashboard metrics from the ticket collection
 */
export function calculateDashboardMetrics(
  tickets: Ticket[],
  users: User[] = MOCK_USERS,
  daysBack: number = 30
): DashboardMetrics {
  // Open tickets = NEW + IN_PROGRESS + WAITING_FOR_EMPLOYEE
  const openTickets = tickets.filter(
    (t) => t.status === 'NEW' || t.status === 'IN_PROGRESS' || t.status === 'WAITING_FOR_EMPLOYEE'
  );

  // Unassigned tickets among open tickets
  const unassignedTickets = openTickets.filter((t) => t.assigneeId === null);

  // Resolution Overdue
  const overdueTickets = openTickets.filter((t) => t.sla.resolutionState === 'OVERDUE');

  // Average Resolution Time
  const avgRes = calculateAverageResolutionTime(tickets, daysBack);

  // Workload by Agent (active agents only, counts open tickets)
  const agents = users.filter((u) => u.role === 'SUPPORT_AGENT' && u.status === 'ACTIVE');
  const workloadByAgent: WorkloadItem[] = agents.map((agent) => {
    const count = openTickets.filter((t) => t.assigneeId === agent.id).length;
    return {
      agentId: agent.id,
      agentName: agent.name,
      avatarColor: agent.avatarColor,
      activeTicketCount: count,
    };
  });

  return {
    openTicketsCount: openTickets.length,
    unassignedTicketsCount: unassignedTickets.length,
    resolutionOverdueCount: overdueTickets.length,
    averageResolutionTimeFormatted: avgRes.formatted,
    eligibleTicketsCount: avgRes.count,
    workloadByAgent,
    unassignedCount: unassignedTickets.length,
  };
}
