import { AppState, INITIAL_STATE, ConflictSimulation } from './state';
import { AppAction } from './actions';
import { calculatePriority } from '@/lib/priority';
import { createInitialSla } from '@/lib/sla';
import { Ticket } from '@/mocks/tickets';
import { Comment } from '@/mocks/comments';
import { HistoryEntry } from '@/mocks/history';

export function appReducer(state: AppState, action: AppAction): AppState {
  const now = new Date().toISOString();

  switch (action.type) {
    case 'SET_ACTIVE_USER': {
      return {
        ...state,
        activeUserId: action.payload.userId,
      };
    }

    case 'RESET_STATE': {
      return {
        ...INITIAL_STATE,
        activeUserId: state.activeUserId, // preserve current viewing user
      };
    }

    case 'SHOW_TOAST': {
      return {
        ...state,
        toast: {
          id: `toast-${Date.now()}`,
          type: action.payload.type,
          title: action.payload.title,
          message: action.payload.message,
        },
      };
    }

    case 'DISMISS_TOAST': {
      return {
        ...state,
        toast: null,
      };
    }

    case 'SIMULATE_CONFLICT': {
      let title = 'Concurrent Update Conflict';
      let message = 'The ticket was modified by another user.';
      let supportingMessage = 'Reload the latest version before continuing.';

      if (action.payload.scenario === 'TAKE_COLLISION') {
        title = 'Ticket Already Assigned';
        message = 'Ticket has already been assigned to Maya Chen.';
        supportingMessage = 'Reload the ticket to view the latest information.';
      } else if (action.payload.scenario === 'TICKET_CHANGED') {
        title = 'Ticket Changed';
        message = 'This ticket has changed since you opened it.';
        supportingMessage = 'Reload the latest version before continuing.';
      } else if (action.payload.scenario === 'EDIT_START_COLLISION') {
        title = 'This ticket is already being processed.';
        message = 'This ticket is already being processed.';
        supportingMessage = 'Your changes were not saved. Add any new information as a public comment.';
      } else if (action.payload.scenario === 'RESOLVE_REJECTED') {
        title = 'Ticket Already Cancelled';
        message = 'This ticket has already been cancelled.';
        supportingMessage = 'Reload the ticket to view the latest status. Unsent resolution text will not be posted.';
      } else if (
        action.payload.scenario === 'CANCEL_REJECTED' ||
        action.payload.scenario === 'CANCEL_RESOLVE_COLLISION'
      ) {
        title = 'Ticket Already Resolved';
        message = 'This ticket has already been resolved.';
        supportingMessage = 'Reload the ticket to view the latest status.';
      }

      const modal: ConflictSimulation = {
        type: action.payload.scenario,
        title,
        message,
        supportingMessage,
        ticketId: action.payload.ticketId,
        draftData: action.payload.draftData,
      };

      return {
        ...state,
        conflictModal: modal,
      };
    }

    case 'CLOSE_CONFLICT_MODAL': {
      return {
        ...state,
        conflictModal: null,
      };
    }

    case 'CREATE_TICKET': {
      const { title, description, requestTypeId, impact, urgency, creatorId } = action.payload;
      const creator = state.users.find((u) => u.id === creatorId);
      const reqType = state.requestTypes.find((r) => r.id === requestTypeId);
      const priority = calculatePriority(impact, urgency);
      const newTicketCode = `IT-2026-001${state.tickets.length + 24}`;
      const newTicketId = `t-${Date.now()}`;
      const sla = createInitialSla(priority);

      const newTicket: Ticket = {
        id: newTicketId,
        ticketCode: newTicketCode,
        title,
        description,
        requestTypeId,
        requestTypeName: reqType?.name || 'General Support',
        impact,
        urgency,
        priority,
        status: 'NEW',
        creatorId,
        creatorName: creator?.name || 'Employee',
        creatorDepartment: creator?.department || 'Operations',
        assigneeId: null,
        assigneeName: null,
        createdAt: now,
        updatedAt: now,
        latestResolvedAt: null,
        version: 1,
        sla,
      };

      const historyEntry: HistoryEntry = {
        id: `hist-${Date.now()}`,
        ticketId: newTicketId,
        actorId: creatorId,
        actorName: creator?.name || 'Employee',
        actorRole: 'EMPLOYEE',
        action: 'Ticket created',
        details: `Created with Impact: ${impact}, Urgency: ${urgency}. Priority calculated as ${priority}.`,
        timestamp: now,
      };

      return {
        ...state,
        tickets: [newTicket, ...state.tickets],
        history: [historyEntry, ...state.history],
        toast: {
          id: `toast-${Date.now()}`,
          type: 'success',
          title: 'Ticket Created',
          message: `Ticket ${newTicketCode} has been logged with Priority ${priority}.`,
        },
      };
    }

    case 'EDIT_TICKET': {
      const { ticketId, title, description, requestTypeId, impact, urgency } = action.payload;
      const ticket = state.tickets.find((t) => t.id === ticketId);
      if (!ticket) return state;

      // Invariant: Employee may only edit while status is NEW
      if (ticket.status !== 'NEW') {
        return {
          ...state,
          toast: {
            id: `toast-${Date.now()}`,
            type: 'error',
            title: 'Action Not Permitted',
            message: 'Tickets can only be edited while in status NEW.',
          },
        };
      }

      const newPriority = calculatePriority(impact, urgency);
      const reqType = state.requestTypes.find((r) => r.id === requestTypeId);
      const actor = state.users.find((u) => u.id === state.activeUserId);

      const updatedTicket: Ticket = {
        ...ticket,
        title,
        description,
        requestTypeId,
        requestTypeName: reqType?.name || ticket.requestTypeName,
        impact,
        urgency,
        priority: newPriority,
        version: ticket.version + 1,
        updatedAt: now,
      };

      const historyEntry: HistoryEntry = {
        id: `hist-${Date.now()}`,
        ticketId,
        actorId: state.activeUserId,
        actorName: actor?.name || 'Employee',
        actorRole: 'EMPLOYEE',
        action: 'Ticket updated',
        details: `Updated fields while NEW. Priority recalculated to ${newPriority}.`,
        timestamp: now,
      };

      return {
        ...state,
        tickets: state.tickets.map((t) => (t.id === ticketId ? updatedTicket : t)),
        history: [historyEntry, ...state.history],
        toast: {
          id: `toast-${Date.now()}`,
          type: 'success',
          title: 'Ticket Updated',
          message: 'Changes saved successfully.',
        },
      };
    }

    case 'TAKE_TICKET': {
      const { ticketId, agentId } = action.payload;
      const ticket = state.tickets.find((t) => t.id === ticketId);
      const agent = state.users.find((u) => u.id === agentId);
      if (!ticket || !agent) return state;

      // Invariant: Take only when status = NEW and assignee = null
      if (ticket.status !== 'NEW' || ticket.assigneeId !== null) {
        return state;
      }

      const updatedTicket: Ticket = {
        ...ticket,
        assigneeId: agent.id,
        assigneeName: agent.name,
        version: ticket.version + 1,
        updatedAt: now,
      };

      const historyEntry: HistoryEntry = {
        id: `hist-${Date.now()}`,
        ticketId,
        actorId: agent.id,
        actorName: agent.name,
        actorRole: 'SUPPORT_AGENT',
        action: 'Ticket assigned',
        details: `${agent.name} took ownership of ticket. Status remains NEW.`,
        timestamp: now,
      };

      return {
        ...state,
        tickets: state.tickets.map((t) => (t.id === ticketId ? updatedTicket : t)),
        history: [historyEntry, ...state.history],
        toast: {
          id: `toast-${Date.now()}`,
          type: 'success',
          title: 'Ticket Taken',
          message: `You are now the assigned agent for ${ticket.ticketCode}. Status remains NEW.`,
        },
      };
    }

    case 'START_PROCESSING': {
      const { ticketId, actorId } = action.payload;
      const ticket = state.tickets.find((t) => t.id === ticketId);
      const actor = state.users.find((u) => u.id === actorId);
      if (!ticket || !actor) return state;

      // Crucial Invariant: ticket MUST have an active assignee before transition succeeds
      if (ticket.status !== 'NEW' || ticket.assigneeId === null) {
        return {
          ...state,
          toast: {
            id: `toast-${Date.now()}`,
            type: 'error',
            title: 'Cannot Start Processing',
            message: 'Ticket must have an assigned Support Agent before processing can start.',
          },
        };
      }

      const updatedTicket: Ticket = {
        ...ticket,
        status: 'IN_PROGRESS',
        version: ticket.version + 1,
        updatedAt: now,
      };

      const historyEntry: HistoryEntry = {
        id: `hist-${Date.now()}`,
        ticketId,
        actorId: actor.id,
        actorName: actor.name,
        actorRole: actor.role,
        action: 'Processing started',
        details: 'Status transitioned from NEW to IN_PROGRESS. Resolution SLA clock active.',
        timestamp: now,
      };

      return {
        ...state,
        tickets: state.tickets.map((t) => (t.id === ticketId ? updatedTicket : t)),
        history: [historyEntry, ...state.history],
        toast: {
          id: `toast-${Date.now()}`,
          type: 'success',
          title: 'Processing Started',
          message: `Ticket ${ticket.ticketCode} is now IN_PROGRESS.`,
        },
      };
    }

    case 'WAIT_FOR_EMPLOYEE': {
      const { ticketId, actorId, question } = action.payload;
      const ticket = state.tickets.find((t) => t.id === ticketId);
      const actor = state.users.find((u) => u.id === actorId);
      if (!ticket || !actor) return state;

      const comment: Comment = {
        id: `cmt-${Date.now()}`,
        ticketId,
        authorId: actor.id,
        authorName: actor.name,
        authorRole: actor.role,
        type: 'PUBLIC',
        content: question,
        createdAt: now,
      };

      const updatedTicket: Ticket = {
        ...ticket,
        status: 'WAITING_FOR_EMPLOYEE',
        version: ticket.version + 1,
        updatedAt: now,
        sla: {
          ...ticket.sla,
          resolutionPausedAt: now,
          // First response achieved if not already
          firstResponseAchievedAt: ticket.sla.firstResponseAchievedAt || now,
        },
      };

      const historyEntry: HistoryEntry = {
        id: `hist-${Date.now()}`,
        ticketId,
        actorId: actor.id,
        actorName: actor.name,
        actorRole: actor.role,
        action: 'Awaiting employee input',
        details: 'Status transitioned to WAITING_FOR_EMPLOYEE. Resolution SLA paused.',
        reason: question,
        timestamp: now,
      };

      return {
        ...state,
        tickets: state.tickets.map((t) => (t.id === ticketId ? updatedTicket : t)),
        comments: [...state.comments, comment],
        history: [historyEntry, ...state.history],
        toast: {
          id: `toast-${Date.now()}`,
          type: 'success',
          title: 'Waiting for Employee',
          message: 'Question posted and ticket moved to WAITING_FOR_EMPLOYEE.',
        },
      };
    }

    case 'EMPLOYEE_REPLY': {
      const { ticketId, employeeId, comment: commentText } = action.payload;
      const ticket = state.tickets.find((t) => t.id === ticketId);
      const employee = state.users.find((u) => u.id === employeeId);
      if (!ticket || !employee) return state;

      const newComment: Comment = {
        id: `cmt-${Date.now()}`,
        ticketId,
        authorId: employee.id,
        authorName: employee.name,
        authorRole: 'EMPLOYEE',
        type: 'PUBLIC',
        content: commentText,
        createdAt: now,
      };

      // Invariant: Employee replies while WAITING_FOR_EMPLOYEE automatically returns ticket to IN_PROGRESS
      const shouldResume = ticket.status === 'WAITING_FOR_EMPLOYEE';
      const updatedTicket: Ticket = {
        ...ticket,
        status: shouldResume ? 'IN_PROGRESS' : ticket.status,
        version: ticket.version + 1,
        updatedAt: now,
        sla: {
          ...ticket.sla,
          resolutionPausedAt: null,
        },
      };

      const historyEntry: HistoryEntry = {
        id: `hist-${Date.now()}`,
        ticketId,
        actorId: employee.id,
        actorName: employee.name,
        actorRole: 'EMPLOYEE',
        action: shouldResume ? 'Resumed to In Progress' : 'Public comment posted',
        details: shouldResume
          ? 'Employee replied to inquiry. System automatically transitioned status to IN_PROGRESS.'
          : 'Public comment added by ticket owner.',
        timestamp: now,
      };

      return {
        ...state,
        tickets: state.tickets.map((t) => (t.id === ticketId ? updatedTicket : t)),
        comments: [...state.comments, newComment],
        history: [historyEntry, ...state.history],
        toast: {
          id: `toast-${Date.now()}`,
          type: 'success',
          title: shouldResume ? 'Resumed Processing' : 'Comment Posted',
          message: shouldResume
            ? 'Your reply was sent and the ticket returned to IN_PROGRESS.'
            : 'Comment posted successfully.',
        },
      };
    }

    case 'RESUME_PROCESSING': {
      const { ticketId, actorId, reason } = action.payload;
      const ticket = state.tickets.find((t) => t.id === ticketId);
      const actor = state.users.find((u) => u.id === actorId);
      if (!ticket || !actor) return state;

      const updatedTicket: Ticket = {
        ...ticket,
        status: 'IN_PROGRESS',
        version: ticket.version + 1,
        updatedAt: now,
        sla: {
          ...ticket.sla,
          resolutionPausedAt: null,
        },
      };

      const historyEntry: HistoryEntry = {
        id: `hist-${Date.now()}`,
        ticketId,
        actorId: actor.id,
        actorName: actor.name,
        actorRole: actor.role,
        action: 'Processing resumed',
        details: 'Status transitioned from WAITING_FOR_EMPLOYEE to IN_PROGRESS.',
        reason,
        timestamp: now,
      };

      return {
        ...state,
        tickets: state.tickets.map((t) => (t.id === ticketId ? updatedTicket : t)),
        history: [historyEntry, ...state.history],
        toast: {
          id: `toast-${Date.now()}`,
          type: 'success',
          title: 'Processing Resumed',
          message: `Ticket ${ticket.ticketCode} is back in IN_PROGRESS.`,
        },
      };
    }

    case 'RESOLVE_TICKET': {
      const { ticketId, actorId, solution } = action.payload;
      const ticket = state.tickets.find((t) => t.id === ticketId);
      const actor = state.users.find((u) => u.id === actorId);
      if (!ticket || !actor) return state;

      const comment: Comment = {
        id: `cmt-${Date.now()}`,
        ticketId,
        authorId: actor.id,
        authorName: actor.name,
        authorRole: actor.role,
        type: 'PUBLIC',
        content: `Solution: ${solution}`,
        createdAt: now,
      };

      const updatedTicket: Ticket = {
        ...ticket,
        status: 'RESOLVED',
        latestResolvedAt: now,
        version: ticket.version + 1,
        updatedAt: now,
        sla: {
          ...ticket.sla,
          resolutionPausedAt: now,
          resolutionAchievedAt: now,
          firstResponseAchievedAt: ticket.sla.firstResponseAchievedAt || now,
        },
      };

      const historyEntry: HistoryEntry = {
        id: `hist-${Date.now()}`,
        ticketId,
        actorId: actor.id,
        actorName: actor.name,
        actorRole: actor.role,
        action: 'Ticket resolved',
        details: 'Status transitioned from IN_PROGRESS to RESOLVED with public solution.',
        reason: solution,
        timestamp: now,
      };

      return {
        ...state,
        tickets: state.tickets.map((t) => (t.id === ticketId ? updatedTicket : t)),
        comments: [...state.comments, comment],
        history: [historyEntry, ...state.history],
        toast: {
          id: `toast-${Date.now()}`,
          type: 'success',
          title: 'Ticket Resolved',
          message: `Ticket ${ticket.ticketCode} marked as RESOLVED. Awaiting employee closure.`,
        },
      };
    }

    case 'CONFIRM_AND_CLOSE': {
      const { ticketId, employeeId } = action.payload;
      const ticket = state.tickets.find((t) => t.id === ticketId);
      const actor = state.users.find((u) => u.id === employeeId);
      if (!ticket || !actor) return state;

      const updatedTicket: Ticket = {
        ...ticket,
        status: 'CLOSED',
        version: ticket.version + 1,
        updatedAt: now,
      };

      const historyEntry: HistoryEntry = {
        id: `hist-${Date.now()}`,
        ticketId,
        actorId: actor.id,
        actorName: actor.name,
        actorRole: actor.role,
        action: 'Ticket confirmed & closed',
        details: 'Resolution confirmed by employee. Ticket is permanently CLOSED.',
        timestamp: now,
      };

      return {
        ...state,
        tickets: state.tickets.map((t) => (t.id === ticketId ? updatedTicket : t)),
        history: [historyEntry, ...state.history],
        toast: {
          id: `toast-${Date.now()}`,
          type: 'success',
          title: 'Ticket Closed',
          message: `Thank you for confirming resolution. Ticket ${ticket.ticketCode} is CLOSED.`,
        },
      };
    }

    case 'ADMIN_CLOSE': {
      const { ticketId, adminId, reason } = action.payload;
      const ticket = state.tickets.find((t) => t.id === ticketId);
      const admin = state.users.find((u) => u.id === adminId);
      if (!ticket || !admin) return state;

      const updatedTicket: Ticket = {
        ...ticket,
        status: 'CLOSED',
        version: ticket.version + 1,
        updatedAt: now,
      };

      const historyEntry: HistoryEntry = {
        id: `hist-${Date.now()}`,
        ticketId,
        actorId: admin.id,
        actorName: admin.name,
        actorRole: 'ADMINISTRATOR',
        action: 'Ticket closed by admin',
        details: 'Status transitioned to CLOSED by Administrator.',
        reason,
        timestamp: now,
      };

      return {
        ...state,
        tickets: state.tickets.map((t) => (t.id === ticketId ? updatedTicket : t)),
        history: [historyEntry, ...state.history],
        toast: {
          id: `toast-${Date.now()}`,
          type: 'success',
          title: 'Ticket Closed',
          message: `Ticket ${ticket.ticketCode} closed with reason recorded.`,
        },
      };
    }

    case 'REOPEN_TICKET': {
      const { ticketId, actorId, reason } = action.payload;
      const ticket = state.tickets.find((t) => t.id === ticketId);
      const actor = state.users.find((u) => u.id === actorId);
      if (!ticket || !actor) return state;

      const updatedTicket: Ticket = {
        ...ticket,
        status: 'IN_PROGRESS',
        version: ticket.version + 1,
        updatedAt: now,
        sla: {
          ...ticket.sla,
          resolutionPausedAt: null,
          resolutionAchievedAt: null, // Reset resolution achieved flag for new cycle
        },
      };

      const historyEntry: HistoryEntry = {
        id: `hist-${Date.now()}`,
        ticketId,
        actorId: actor.id,
        actorName: actor.name,
        actorRole: actor.role,
        action: 'Ticket reopened',
        details: 'Status transitioned from RESOLVED back to IN_PROGRESS. Resolution SLA resumed.',
        reason,
        timestamp: now,
      };

      return {
        ...state,
        tickets: state.tickets.map((t) => (t.id === ticketId ? updatedTicket : t)),
        history: [historyEntry, ...state.history],
        toast: {
          id: `toast-${Date.now()}`,
          type: 'warning',
          title: 'Ticket Reopened',
          message: `Ticket ${ticket.ticketCode} reopened and returned to IN_PROGRESS.`,
        },
      };
    }

    case 'CANCEL_TICKET': {
      const { ticketId, actorId, reason } = action.payload;
      const ticket = state.tickets.find((t) => t.id === ticketId);
      const actor = state.users.find((u) => u.id === actorId);
      if (!ticket || !actor) return state;

      const updatedTicket: Ticket = {
        ...ticket,
        status: 'CANCELLED',
        version: ticket.version + 1,
        updatedAt: now,
      };

      const historyEntry: HistoryEntry = {
        id: `hist-${Date.now()}`,
        ticketId,
        actorId: actor.id,
        actorName: actor.name,
        actorRole: actor.role,
        action: 'Ticket cancelled',
        details: `Ticket cancelled by ${actor.name}. Status is permanently CANCELLED.`,
        reason,
        timestamp: now,
      };

      return {
        ...state,
        tickets: state.tickets.map((t) => (t.id === ticketId ? updatedTicket : t)),
        history: [historyEntry, ...state.history],
        toast: {
          id: `toast-${Date.now()}`,
          type: 'info',
          title: 'Ticket Cancelled',
          message: `Ticket ${ticket.ticketCode} has been cancelled.`,
        },
      };
    }

    case 'ASSIGN_TICKET': {
      const { ticketId, agentId, adminId } = action.payload;
      const ticket = state.tickets.find((t) => t.id === ticketId);
      const agent = state.users.find((u) => u.id === agentId);
      const admin = state.users.find((u) => u.id === adminId);
      if (!ticket || !agent || !admin) return state;

      const updatedTicket: Ticket = {
        ...ticket,
        assigneeId: agent.id,
        assigneeName: agent.name,
        version: ticket.version + 1,
        updatedAt: now,
      };

      const historyEntry: HistoryEntry = {
        id: `hist-${Date.now()}`,
        ticketId,
        actorId: admin.id,
        actorName: admin.name,
        actorRole: 'ADMINISTRATOR',
        action: 'Ticket assigned',
        details: `Assigned to ${agent.name} by Administrator.`,
        timestamp: now,
      };

      return {
        ...state,
        tickets: state.tickets.map((t) => (t.id === ticketId ? updatedTicket : t)),
        history: [historyEntry, ...state.history],
        toast: {
          id: `toast-${Date.now()}`,
          type: 'success',
          title: 'Ticket Assigned',
          message: `${ticket.ticketCode} assigned to ${agent.name}.`,
        },
      };
    }

    case 'REASSIGN_TICKET': {
      const { ticketId, newAgentId, adminId, reason } = action.payload;
      const ticket = state.tickets.find((t) => t.id === ticketId);
      const newAgent = state.users.find((u) => u.id === newAgentId);
      const admin = state.users.find((u) => u.id === adminId);
      if (!ticket || !newAgent || !admin) return state;

      const oldAssigneeName = ticket.assigneeName || 'Unassigned';

      const updatedTicket: Ticket = {
        ...ticket,
        assigneeId: newAgent.id,
        assigneeName: newAgent.name,
        version: ticket.version + 1,
        updatedAt: now,
      };

      const historyEntry: HistoryEntry = {
        id: `hist-${Date.now()}`,
        ticketId,
        actorId: admin.id,
        actorName: admin.name,
        actorRole: 'ADMINISTRATOR',
        action: 'Ticket reassigned',
        details: `Reassigned from ${oldAssigneeName} to ${newAgent.name}. SLA and status preserved.`,
        reason,
        timestamp: now,
      };

      return {
        ...state,
        tickets: state.tickets.map((t) => (t.id === ticketId ? updatedTicket : t)),
        history: [historyEntry, ...state.history],
        toast: {
          id: `toast-${Date.now()}`,
          type: 'success',
          title: 'Ticket Reassigned',
          message: `${ticket.ticketCode} reassigned to ${newAgent.name}.`,
        },
      };
    }

    case 'ADD_COMMENT': {
      const { ticketId, authorId, type, content } = action.payload;
      const ticket = state.tickets.find((t) => t.id === ticketId);
      const author = state.users.find((u) => u.id === authorId);
      if (!ticket || !author) return state;

      const newComment: Comment = {
        id: `cmt-${Date.now()}`,
        ticketId,
        authorId: author.id,
        authorName: author.name,
        authorRole: author.role,
        type,
        content,
        createdAt: now,
      };

      // Stop First Response clock if public comment from assigned agent or admin
      let updatedSla = ticket.sla;
      if (
        type === 'PUBLIC' &&
        !ticket.sla.firstResponseAchievedAt &&
        (author.id === ticket.assigneeId || author.role === 'ADMINISTRATOR')
      ) {
        updatedSla = {
          ...ticket.sla,
          firstResponseAchievedAt: now,
        };
      }

      const updatedTicket: Ticket = {
        ...ticket,
        version: ticket.version + 1,
        updatedAt: now,
        sla: updatedSla,
      };

      const historyEntry: HistoryEntry = {
        id: `hist-${Date.now()}`,
        ticketId,
        actorId: author.id,
        actorName: author.name,
        actorRole: author.role,
        action: type === 'INTERNAL' ? 'Internal note added' : 'Public comment posted',
        details: type === 'INTERNAL' ? 'Internal note logged for IT support staff.' : 'Public comment added to ticket thread.',
        timestamp: now,
      };

      return {
        ...state,
        tickets: state.tickets.map((t) => (t.id === ticketId ? updatedTicket : t)),
        comments: [...state.comments, newComment],
        history: [historyEntry, ...state.history],
        toast: {
          id: `toast-${Date.now()}`,
          type: 'success',
          title: type === 'INTERNAL' ? 'Internal Note Added' : 'Comment Posted',
          message: type === 'INTERNAL' ? 'Note saved (visible only to Agents & Admin).' : 'Public comment posted.',
        },
      };
    }

    case 'CREATE_USER': {
      const { name, email, role, department } = action.payload;
      const newUser = {
        id: `user-${Date.now()}`,
        name,
        email,
        role,
        status: 'ACTIVE' as const,
        department,
        avatarColor: '#2563EB',
        activeTicketCount: 0,
      };

      return {
        ...state,
        users: [...state.users, newUser],
        toast: {
          id: `toast-${Date.now()}`,
          type: 'success',
          title: 'User Created',
          message: `Account for ${name} (${role}) created with status ACTIVE.`,
        },
      };
    }

    case 'UPDATE_USER': {
      const { userId, name, email, department, role } = action.payload;
      return {
        ...state,
        users: state.users.map((u) => (u.id === userId ? { ...u, name, email, department, role } : u)),
        toast: {
          id: `toast-${Date.now()}`,
          type: 'success',
          title: 'User Updated',
          message: 'User account details updated successfully.',
        },
      };
    }

    case 'TOGGLE_USER_LOCK': {
      const { userId } = action.payload;
      const targetUser = state.users.find((u) => u.id === userId);
      if (!targetUser) return state;

      // Invariant: Cannot lock last active administrator
      if (targetUser.role === 'ADMINISTRATOR' && targetUser.status === 'ACTIVE') {
        const activeAdmins = state.users.filter((u) => u.role === 'ADMINISTRATOR' && u.status === 'ACTIVE');
        if (activeAdmins.length <= 1) {
          return {
            ...state,
            toast: {
              id: `toast-${Date.now()}`,
              type: 'error',
              title: 'Operation Rejected',
              message: 'Cannot lock the final active Administrator in the system.',
            },
          };
        }
      }

      // Invariant: Cannot lock an Agent with active open tickets
      if (targetUser.role === 'SUPPORT_AGENT' && targetUser.status === 'ACTIVE') {
        const openTickets = state.tickets.filter(
          (t) =>
            t.assigneeId === targetUser.id &&
            (t.status === 'NEW' || t.status === 'IN_PROGRESS' || t.status === 'WAITING_FOR_EMPLOYEE')
        );
        if (openTickets.length > 0) {
          return {
            ...state,
            toast: {
              id: `toast-${Date.now()}`,
              type: 'error',
              title: 'Reassignment Required',
              message: `Cannot lock ${targetUser.name} while they have ${openTickets.length} active ticket(s). Reassign tickets first.`,
            },
          };
        }
      }

      const nextStatus = targetUser.status === 'ACTIVE' ? 'LOCKED' : 'ACTIVE';
      return {
        ...state,
        users: state.users.map((u) => (u.id === userId ? { ...u, status: nextStatus } : u)),
        toast: {
          id: `toast-${Date.now()}`,
          type: 'info',
          title: `Account ${nextStatus === 'LOCKED' ? 'Locked' : 'Unlocked'}`,
          message: `User account status changed to ${nextStatus}.`,
        },
      };
    }

    case 'CREATE_REQUEST_TYPE': {
      const { name, code, description } = action.payload;
      const newType = {
        id: `req-${Date.now()}`,
        name,
        code,
        description,
        status: 'ACTIVE' as const,
      };

      return {
        ...state,
        requestTypes: [...state.requestTypes, newType],
        toast: {
          id: `toast-${Date.now()}`,
          type: 'success',
          title: 'Request Type Added',
          message: `Category "${name}" created and marked ACTIVE.`,
        },
      };
    }

    case 'UPDATE_REQUEST_TYPE': {
      const { id, name, code, description } = action.payload;
      return {
        ...state,
        requestTypes: state.requestTypes.map((r) =>
          r.id === id ? { ...r, name, code: code || r.code, description } : r
        ),
        toast: {
          id: `toast-${Date.now()}`,
          type: 'success',
          title: 'Request Type Updated',
          message: `Category "${name}" updated successfully.`,
        },
      };
    }

    case 'TOGGLE_REQUEST_TYPE_STATUS': {
      const { id } = action.payload;
      return {
        ...state,
        requestTypes: state.requestTypes.map((r) =>
          r.id === id ? { ...r, status: r.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' } : r
        ),
        toast: {
          id: `toast-${Date.now()}`,
          type: 'info',
          title: 'Category Status Updated',
          message: 'Request type active status toggled.',
        },
      };
    }

    default:
      return state;
  }
}
