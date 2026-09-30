export type ImpactLevel = 'HIGH' | 'MEDIUM' | 'LOW';
export type UrgencyLevel = 'HIGH' | 'MEDIUM' | 'LOW';
export type PriorityLevel = 'P1' | 'P2' | 'P3' | 'P4';

export interface PriorityInfo {
  level: PriorityLevel;
  label: string;
  description: string;
  firstResponseTargetMinutes: number;
  resolutionTargetMinutes: number;
}

export const PRIORITY_CONFIG: Record<PriorityLevel, PriorityInfo> = {
  P1: {
    level: 'P1',
    label: 'Critical (P1)',
    description: 'High impact, high urgency. Immediate response required.',
    firstResponseTargetMinutes: 15,
    resolutionTargetMinutes: 240, // 4 hours
  },
  P2: {
    level: 'P2',
    label: 'High (P2)',
    description: 'Major impact or urgency. Fast turnaround expected.',
    firstResponseTargetMinutes: 60, // 1 hour
    resolutionTargetMinutes: 480, // 8 hours
  },
  P3: {
    level: 'P3',
    label: 'Medium (P3)',
    description: 'Moderate impact or urgency. Standard resolution workflow.',
    firstResponseTargetMinutes: 240, // 4 hours
    resolutionTargetMinutes: 1440, // 24 hours (1 day)
  },
  P4: {
    level: 'P4',
    label: 'Low (P4)',
    description: 'Minor impact and low urgency. Scheduled support.',
    firstResponseTargetMinutes: 480, // 8 hours
    resolutionTargetMinutes: 4320, // 72 hours (3 days)
  },
};

/**
 * Calculates ticket Priority (P1–P4) strictly based on Impact and Urgency matrix.
 * Priority is READ-ONLY in the UI and cannot be set directly.
 *
 *               Urgency
 * Impact      High    Medium    Low
 * High        P1      P2        P3
 * Medium      P2      P3        P4
 * Low         P3      P4        P4
 */
export function calculatePriority(impact: ImpactLevel, urgency: UrgencyLevel): PriorityLevel {
  if (impact === 'HIGH') {
    if (urgency === 'HIGH') return 'P1';
    if (urgency === 'MEDIUM') return 'P2';
    return 'P3';
  }
  if (impact === 'MEDIUM') {
    if (urgency === 'HIGH') return 'P2';
    if (urgency === 'MEDIUM') return 'P3';
    return 'P4';
  }
  // impact === 'LOW'
  if (urgency === 'HIGH') return 'P3';
  return 'P4';
}

export const IMPACT_DESCRIPTIONS: Record<ImpactLevel, string> = {
  HIGH: 'High (50+ users affected or company-wide service disrupted)',
  MEDIUM: 'Medium (2–49 users affected)',
  LOW: 'Low (Single user affected)',
};

export const URGENCY_DESCRIPTIONS: Record<UrgencyLevel, string> = {
  HIGH: 'High (Work is completely blocked, no workaround)',
  MEDIUM: 'Medium (Work partially hindered, workaround inconvenient)',
  LOW: 'Low (Planned request or does not block current work)',
};
