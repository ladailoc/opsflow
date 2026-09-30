import React from 'react';
import { TicketStatus } from '@/mocks/tickets';
import { cn } from '@/lib/utils';

export interface StatusBadgeProps {
  status: TicketStatus;
  className?: string;
  size?: 'sm' | 'md';
}

const STATUS_CONFIG: Record<
  TicketStatus,
  { label: string; bg: string; fg: string; border: string; dot: string }
> = {
  NEW: {
    label: 'New',
    bg: 'bg-[#E8F5FF]',
    fg: 'text-[#175EAD]',
    border: 'border-[#BAE6FD]',
    dot: 'bg-[#175EAD]',
  },
  IN_PROGRESS: {
    label: 'In Progress',
    bg: 'bg-[#E8EEFF]',
    fg: 'text-[#294FBA]',
    border: 'border-[#C7D2FE]',
    dot: 'bg-[#294FBA]',
  },
  WAITING_FOR_EMPLOYEE: {
    label: 'Waiting for Employee',
    bg: 'bg-[#FFF5E0]',
    fg: 'text-[#995703]',
    border: 'border-[#FED7AA]',
    dot: 'bg-[#995703]',
  },
  RESOLVED: {
    label: 'Resolved',
    bg: 'bg-[#E6F7EB]',
    fg: 'text-[#146E38]',
    border: 'border-[#BBF7D0]',
    dot: 'bg-[#146E38]',
  },
  CLOSED: {
    label: 'Closed',
    bg: 'bg-[#F0F2F4]',
    fg: 'text-[#4A5363]',
    border: 'border-[#E2E8F0]',
    dot: 'bg-[#4A5363]',
  },
  CANCELLED: {
    label: 'Cancelled',
    bg: 'bg-[#FFEAEA]',
    fg: 'text-[#B02A2B]',
    border: 'border-[#FECACA]',
    dot: 'bg-[#B02A2B]',
  },
};

export function StatusBadge({ status, className, size = 'md' }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.NEW;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-medium rounded border select-none',
        config.bg,
        config.fg,
        config.border,
        size === 'sm' ? 'px-1.5 py-0.5 text-[11px] leading-tight' : 'px-2 py-0.5 text-caption',
        className
      )}
    >
      <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', config.dot)} />
      <span>{config.label}</span>
    </span>
  );
}
