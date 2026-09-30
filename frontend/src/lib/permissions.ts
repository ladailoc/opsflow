export type Role = 'EMPLOYEE' | 'SUPPORT_AGENT' | 'ADMINISTRATOR';

export interface UserSummary {
  id: string;
  role: Role;
}

export interface TicketSummary {
  id: string;
  status: 'NEW' | 'IN_PROGRESS' | 'WAITING_FOR_EMPLOYEE' | 'RESOLVED' | 'CLOSED' | 'CANCELLED';
  creatorId: string;
  assigneeId: string | null;
}

export const permissions = {
  canCreateTicket(user: UserSummary): boolean {
    return user.role === 'EMPLOYEE';
  },

  canEditTicket(ticket: TicketSummary, user: UserSummary): boolean {
    return user.role === 'EMPLOYEE' && user.id === ticket.creatorId && ticket.status === 'NEW';
  },

  canTakeTicket(ticket: TicketSummary, user: UserSummary): boolean {
    return user.role === 'SUPPORT_AGENT' && ticket.status === 'NEW' && ticket.assigneeId === null;
  },

  canStartProcessing(ticket: TicketSummary, user: UserSummary): boolean {
    const isActorAllowed = (user.role === 'SUPPORT_AGENT' && user.id === ticket.assigneeId) || user.role === 'ADMINISTRATOR';
    // Strict Invariant: ticket MUST have an active assignee before starting processing
    return isActorAllowed && ticket.status === 'NEW' && ticket.assigneeId !== null;
  },

  canAskQuestion(ticket: TicketSummary, user: UserSummary): boolean {
    const isActorAllowed = (user.role === 'SUPPORT_AGENT' && user.id === ticket.assigneeId) || user.role === 'ADMINISTRATOR';
    return isActorAllowed && ticket.status === 'IN_PROGRESS';
  },

  canResumeProcessing(ticket: TicketSummary, user: UserSummary): boolean {
    const isActorAllowed = (user.role === 'SUPPORT_AGENT' && user.id === ticket.assigneeId) || user.role === 'ADMINISTRATOR';
    return isActorAllowed && ticket.status === 'WAITING_FOR_EMPLOYEE';
  },

  canResolveTicket(ticket: TicketSummary, user: UserSummary): boolean {
    const isActorAllowed = (user.role === 'SUPPORT_AGENT' && user.id === ticket.assigneeId) || user.role === 'ADMINISTRATOR';
    return isActorAllowed && ticket.status === 'IN_PROGRESS';
  },

  canCloseTicket(ticket: TicketSummary, user: UserSummary): boolean {
    if (ticket.status !== 'RESOLVED') return false;
    return user.id === ticket.creatorId || user.role === 'ADMINISTRATOR';
  },

  canReopenTicket(ticket: TicketSummary, user: UserSummary): boolean {
    if (ticket.status !== 'RESOLVED') return false;
    return user.id === ticket.creatorId || user.role === 'ADMINISTRATOR';
  },

  canCancelTicket(ticket: TicketSummary, user: UserSummary): boolean {
    const isCancellableState =
      ticket.status === 'NEW' || ticket.status === 'IN_PROGRESS' || ticket.status === 'WAITING_FOR_EMPLOYEE';
    if (!isCancellableState) return false;
    return user.id === ticket.creatorId || user.role === 'ADMINISTRATOR';
  },

  canAssignTicket(ticket: TicketSummary, user: UserSummary): boolean {
    return user.role === 'ADMINISTRATOR' && ticket.assigneeId === null && ticket.status !== 'CLOSED' && ticket.status !== 'CANCELLED';
  },

  canReassignTicket(ticket: TicketSummary, user: UserSummary): boolean {
    return user.role === 'ADMINISTRATOR' && ticket.assigneeId !== null && ticket.status !== 'CLOSED' && ticket.status !== 'CANCELLED';
  },

  canPostPublicComment(ticket: TicketSummary, user: UserSummary): boolean {
    if (ticket.status === 'CLOSED' || ticket.status === 'CANCELLED') return false;
    return user.id === ticket.creatorId || user.id === ticket.assigneeId || user.role === 'ADMINISTRATOR';
  },

  canPostInternalNote(ticket: TicketSummary, user: UserSummary): boolean {
    if (ticket.status === 'CLOSED' || ticket.status === 'CANCELLED') return false;
    return (user.role === 'SUPPORT_AGENT' && user.id === ticket.assigneeId) || user.role === 'ADMINISTRATOR';
  },

  canViewInternalNotes(user: UserSummary): boolean {
    return user.role === 'SUPPORT_AGENT' || user.role === 'ADMINISTRATOR';
  },
};
