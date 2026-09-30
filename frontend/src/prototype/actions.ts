import { ImpactLevel, UrgencyLevel, PriorityLevel } from '@/lib/priority';
import { CommentType } from '@/mocks/comments';
import { Role, UserStatus } from '@/mocks/users';
import { ConflictScenarioType } from './state';

export type AppAction =
  | { type: 'SET_ACTIVE_USER'; payload: { userId: string } }
  | { type: 'RESET_STATE' }
  | {
      type: 'CREATE_TICKET';
      payload: {
        title: string;
        description: string;
        requestTypeId: string;
        impact: ImpactLevel;
        urgency: UrgencyLevel;
        creatorId: string;
      };
    }
  | {
      type: 'EDIT_TICKET';
      payload: {
        ticketId: string;
        title: string;
        description: string;
        requestTypeId: string;
        impact: ImpactLevel;
        urgency: UrgencyLevel;
      };
    }
  | { type: 'TAKE_TICKET'; payload: { ticketId: string; agentId: string } }
  | { type: 'START_PROCESSING'; payload: { ticketId: string; actorId: string } }
  | { type: 'WAIT_FOR_EMPLOYEE'; payload: { ticketId: string; actorId: string; question: string } }
  | { type: 'EMPLOYEE_REPLY'; payload: { ticketId: string; employeeId: string; comment: string } }
  | { type: 'RESUME_PROCESSING'; payload: { ticketId: string; actorId: string; reason: string } }
  | { type: 'RESOLVE_TICKET'; payload: { ticketId: string; actorId: string; solution: string } }
  | { type: 'CONFIRM_AND_CLOSE'; payload: { ticketId: string; employeeId: string } }
  | { type: 'ADMIN_CLOSE'; payload: { ticketId: string; adminId: string; reason: string } }
  | { type: 'REOPEN_TICKET'; payload: { ticketId: string; actorId: string; reason: string } }
  | { type: 'CANCEL_TICKET'; payload: { ticketId: string; actorId: string; reason: string } }
  | { type: 'ASSIGN_TICKET'; payload: { ticketId: string; agentId: string; adminId: string } }
  | { type: 'REASSIGN_TICKET'; payload: { ticketId: string; newAgentId: string; adminId: string; reason: string } }
  | {
      type: 'ADD_COMMENT';
      payload: {
        ticketId: string;
        authorId: string;
        type: CommentType;
        content: string;
      };
    }
  | {
      type: 'CREATE_USER';
      payload: {
        name: string;
        email: string;
        role: Role;
        department: string;
      };
    }
  | {
      type: 'UPDATE_USER';
      payload: {
        userId: string;
        name: string;
        email: string;
        department: string;
        role: Role;
      };
    }
  | { type: 'TOGGLE_USER_LOCK'; payload: { userId: string } }
  | {
      type: 'CREATE_REQUEST_TYPE';
      payload: {
        name: string;
        code: string;
        description: string;
      };
    }
  | {
      type: 'UPDATE_REQUEST_TYPE';
      payload: {
        id: string;
        name: string;
        code?: string;
        description: string;
      };
    }
  | { type: 'TOGGLE_REQUEST_TYPE_STATUS'; payload: { id: string } }
  | {
      type: 'SIMULATE_CONFLICT';
      payload: {
        scenario: ConflictScenarioType;
        ticketId: string;
        draftData?: any;
      };
    }
  | { type: 'CLOSE_CONFLICT_MODAL' }
  | {
      type: 'SHOW_TOAST';
      payload: {
        type: 'success' | 'warning' | 'error' | 'info';
        title: string;
        message: string;
      };
    }
  | { type: 'DISMISS_TOAST' };
