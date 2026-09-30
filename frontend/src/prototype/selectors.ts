import { AppState } from './state';
import { User } from '@/mocks/users';
import { Ticket } from '@/mocks/tickets';
import { Comment } from '@/mocks/comments';
import { HistoryEntry } from '@/mocks/history';
import { calculateDashboardMetrics, DashboardMetrics } from '@/mocks/dashboard';

export const selectors = {
  getActiveUser(state: AppState): User {
    return state.users.find((u) => u.id === state.activeUserId) || state.users[0];
  },

  getAllUsers(state: AppState): User[] {
    return state.users;
  },

  getActiveAgents(state: AppState): User[] {
    return state.users.filter((u) => u.role === 'SUPPORT_AGENT' && u.status === 'ACTIVE');
  },

  getActiveRequestTypes(state: AppState) {
    return state.requestTypes.filter((r) => r.status === 'ACTIVE');
  },

  getAllRequestTypes(state: AppState) {
    return state.requestTypes;
  },

  getTicketById(state: AppState, ticketId: string): Ticket | undefined {
    return state.tickets.find((t) => t.id === ticketId);
  },

  /**
   * Returns tickets scoped by role:
   * - EMPLOYEE: only tickets created by this user
   * - SUPPORT_AGENT: all IT tickets in the team
   * - ADMINISTRATOR: all IT tickets
   */
  getTicketsByRole(state: AppState, user: User): Ticket[] {
    if (user.role === 'EMPLOYEE') {
      return state.tickets.filter((t) => t.creatorId === user.id);
    }
    return state.tickets;
  },

  /**
   * Support Queue tabs for Support Agent:
   * - 'all': all tickets in IT queue
   * - 'unassigned': tickets without an assigned agent
   * - 'assigned_to_me': tickets assigned to the active agent
   * - 'overdue': predefined filter shortcut using Resolution SLA overdue state (NOT a status)
   */
  getQueueTickets(
    state: AppState,
    tab: 'all' | 'unassigned' | 'assigned_to_me' | 'overdue',
    agentId: string
  ): Ticket[] {
    switch (tab) {
      case 'unassigned':
        return state.tickets.filter(
          (t) => t.assigneeId === null && t.status !== 'CLOSED' && t.status !== 'CANCELLED'
        );
      case 'assigned_to_me':
        return state.tickets.filter((t) => t.assigneeId === agentId);
      case 'overdue':
        return state.tickets.filter(
          (t) =>
            t.sla.resolutionState === 'OVERDUE' &&
            (t.status === 'NEW' || t.status === 'IN_PROGRESS')
        );
      case 'all':
      default:
        return state.tickets;
    }
  },

  /**
   * Returns comments filtered by role:
   * STRICT ENFORCEMENT: Employee must NEVER receive or see Internal Notes!
   */
  getTicketComments(state: AppState, ticketId: string, user: User): Comment[] {
    const ticketComments = state.comments.filter((c) => c.ticketId === ticketId);
    if (user.role === 'EMPLOYEE') {
      return ticketComments.filter((c) => c.type === 'PUBLIC');
    }
    return ticketComments;
  },

  getTicketHistory(state: AppState, ticketId: string): HistoryEntry[] {
    return state.history
      .filter((h) => h.ticketId === ticketId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  },

  getDashboardMetrics(state: AppState, daysBack: number = 30): DashboardMetrics {
    return calculateDashboardMetrics(state.tickets, state.users, daysBack);
  },
};
