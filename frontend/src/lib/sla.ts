import { PriorityLevel, PRIORITY_CONFIG } from './priority';
import { formatMinutes } from './utils';

export type SlaState = 'NORMAL' | 'DUE_SOON' | 'OVERDUE';

export interface TicketSla {
  firstResponseTargetMinutes: number;
  firstResponseDueAt: string;          // ISO string
  firstResponseAchievedAt: string | null;
  firstResponseState: SlaState;

  resolutionTargetMinutes: number;
  resolutionDueAt: string;             // ISO string
  resolutionElapsedMinutes: number;    // Accumulated minutes in NEW & IN_PROGRESS
  resolutionPausedAt: string | null;   // Timestamp when entered WAITING or RESOLVED
  resolutionAchievedAt: string | null; // Timestamp of latest resolution
  resolutionState: SlaState;
}

export interface SlaDisplayInfo {
  state: SlaState;
  text: string;
  isPaused: boolean;
  isAchieved: boolean;
}

/**
 * Calculates current SLA status based on elapsed minutes vs target minutes.
 * - elapsed < 80% target => NORMAL
 * - 80% <= elapsed <= 100% target => DUE_SOON (100% is still within SLA)
 * - elapsed > 100% target => OVERDUE
 */
export function calculateSlaState(elapsedMinutes: number, targetMinutes: number): SlaState {
  if (targetMinutes <= 0) return 'NORMAL';
  const ratio = elapsedMinutes / targetMinutes;
  if (ratio <= 0.8) {
    return 'NORMAL';
  }
  if (ratio <= 1.0) {
    return 'DUE_SOON';
  }
  return 'OVERDUE';
}

/**
 * Formats First Response SLA for UI presentation with text, icon indicator, and relative time.
 * Never relies on color alone.
 */
export function getFirstResponseSlaDisplay(
  sla: TicketSla,
  currentTime: Date = new Date()
): SlaDisplayInfo {
  if (sla.firstResponseAchievedAt) {
    const elapsed = Math.max(
      0,
      Math.round(
        (new Date(sla.firstResponseAchievedAt).getTime() -
          new Date(sla.firstResponseDueAt).getTime() +
          sla.firstResponseTargetMinutes * 60 * 1000) /
          (60 * 1000)
      )
    );
    return {
      state: 'NORMAL',
      text: `Responded in ${formatMinutes(elapsed)}`,
      isPaused: false,
      isAchieved: true,
    };
  }

  const dueTime = new Date(sla.firstResponseDueAt).getTime();
  const now = currentTime.getTime();
  const diffMinutes = Math.round((dueTime - now) / (60 * 1000));

  if (diffMinutes >= 0) {
    const elapsedMinutes = sla.firstResponseTargetMinutes - diffMinutes;
    const state = calculateSlaState(elapsedMinutes, sla.firstResponseTargetMinutes);
    return {
      state,
      text: `Due in ${formatMinutes(diffMinutes)}`,
      isPaused: false,
      isAchieved: false,
    };
  } else {
    return {
      state: 'OVERDUE',
      text: `Overdue by ${formatMinutes(Math.abs(diffMinutes))}`,
      isPaused: false,
      isAchieved: false,
    };
  }
}

/**
 * Formats Resolution SLA for UI presentation with text, icon indicator, and relative time.
 * Handles pause states (WAITING_FOR_EMPLOYEE, RESOLVED).
 */
export function getResolutionSlaDisplay(
  sla: TicketSla,
  status: string,
  currentTime: Date = new Date()
): SlaDisplayInfo {
  if (sla.resolutionAchievedAt && (status === 'RESOLVED' || status === 'CLOSED')) {
    return {
      state: 'NORMAL',
      text: `Resolved in ${formatMinutes(sla.resolutionElapsedMinutes)}`,
      isPaused: false,
      isAchieved: true,
    };
  }

  if (status === 'CANCELLED') {
    return {
      state: 'NORMAL',
      text: 'Cancelled',
      isPaused: false,
      isAchieved: false,
    };
  }

  if (status === 'WAITING_FOR_EMPLOYEE') {
    const state = calculateSlaState(sla.resolutionElapsedMinutes, sla.resolutionTargetMinutes);
    const remaining = sla.resolutionTargetMinutes - sla.resolutionElapsedMinutes;
    return {
      state,
      text: remaining > 0 ? `Paused (Remaining: ${formatMinutes(remaining)})` : `Paused (Overdue by ${formatMinutes(Math.abs(remaining))})`,
      isPaused: true,
      isAchieved: false,
    };
  }

  // Active clock (NEW or IN_PROGRESS)
  const remainingMinutes = sla.resolutionTargetMinutes - sla.resolutionElapsedMinutes;
  const state = calculateSlaState(sla.resolutionElapsedMinutes, sla.resolutionTargetMinutes);

  if (remainingMinutes >= 0) {
    return {
      state,
      text: `Due in ${formatMinutes(remainingMinutes)}`,
      isPaused: false,
      isAchieved: false,
    };
  } else {
    return {
      state: 'OVERDUE',
      text: `Overdue by ${formatMinutes(Math.abs(remainingMinutes))}`,
      isPaused: false,
      isAchieved: false,
    };
  }
}

/**
 * Creates initial SLA object for a newly created ticket
 */
export function createInitialSla(priority: PriorityLevel, createdAt: Date = new Date()): TicketSla {
  const config = PRIORITY_CONFIG[priority];
  const firstDue = new Date(createdAt.getTime() + config.firstResponseTargetMinutes * 60 * 1000);
  const resDue = new Date(createdAt.getTime() + config.resolutionTargetMinutes * 60 * 1000);

  return {
    firstResponseTargetMinutes: config.firstResponseTargetMinutes,
    firstResponseDueAt: firstDue.toISOString(),
    firstResponseAchievedAt: null,
    firstResponseState: 'NORMAL',

    resolutionTargetMinutes: config.resolutionTargetMinutes,
    resolutionDueAt: resDue.toISOString(),
    resolutionElapsedMinutes: 0,
    resolutionPausedAt: null,
    resolutionAchievedAt: null,
    resolutionState: 'NORMAL',
  };
}
