import { User, MOCK_USERS } from '@/mocks/users';
import { RequestType, MOCK_REQUEST_TYPES } from '@/mocks/request-types';
import { Ticket, MOCK_TICKETS } from '@/mocks/tickets';
import { Comment, MOCK_COMMENTS } from '@/mocks/comments';
import { HistoryEntry, MOCK_HISTORY } from '@/mocks/history';

export type ConflictScenarioType =
  | 'TAKE_COLLISION'
  | 'TICKET_CHANGED'
  | 'EDIT_START_COLLISION'
  | 'RESOLVE_REJECTED'
  | 'CANCEL_REJECTED'
  | 'CANCEL_RESOLVE_COLLISION';

export interface ConflictSimulation {
  type: ConflictScenarioType;
  title: string;
  message: string;
  supportingMessage?: string;
  ticketId: string;
  draftData?: {
    title?: string;
    description?: string;
    impact?: string;
    urgency?: string;
  };
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message: string;
}

export interface AppState {
  tickets: Ticket[];
  users: User[];
  requestTypes: RequestType[];
  comments: Comment[];
  history: HistoryEntry[];
  activeUserId: string;
  conflictModal: ConflictSimulation | null;
  toast: ToastMessage | null;
}

export const INITIAL_STATE: AppState = {
  tickets: MOCK_TICKETS,
  users: MOCK_USERS,
  requestTypes: MOCK_REQUEST_TYPES,
  comments: MOCK_COMMENTS,
  history: MOCK_HISTORY,
  activeUserId: 'user-emp-01', // Default persona: Alex Nguyen (Employee)
  conflictModal: null,
  toast: null,
};
