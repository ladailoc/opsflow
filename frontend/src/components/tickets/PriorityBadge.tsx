import React from 'react';
import { PriorityLevel } from '@/lib/priority';
import { cn } from '@/lib/utils';

export interface PriorityBadgeProps {
  priority: PriorityLevel;
  className?: string;
  showLabel?: boolean;
  size?: 'sm' | 'md';
}

const PRIORITY_BADGE_CONFIG: Record<
  PriorityLevel,
  { label: string; full: string; bg: string; fg: string; border: string }
> = {
  P1: {
    label: 'P1',
    full: 'P1 · Critical',
    bg: 'bg-[#FFEAEA]',
    fg: 'text-[#B02A2B]',
    border: 'border-[#FECACA]',
  },
  P2: {
    label: 'P2',
    full: 'P2 · High',
    bg: 'bg-[#FFF5E0]',
    fg: 'text-[#995703]',
    border: 'border-[#FED7AA]',
  },
  P3: {
    label: 'P3',
    full: 'P3 · Medium',
    bg: 'bg-[#E8EEFF]',
    fg: 'text-[#294FBA]',
    border: 'border-[#C7D2FE]',
  },
  P4: {
    label: 'P4',
    full: 'P4 · Low',
    bg: 'bg-[#F0F2F4]',
    fg: 'text-[#4A5363]',
    border: 'border-[#E2E8F0]',
  },
};

export function PriorityBadge({
  priority,
  className,
  showLabel = false,
  size = 'md',
}: PriorityBadgeProps) {
  const config = PRIORITY_BADGE_CONFIG[priority] || PRIORITY_BADGE_CONFIG.P4;

  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded border select-none',
        config.bg,
        config.fg,
        config.border,
        size === 'sm' ? 'px-1.5 py-0.5 text-[11px] leading-tight' : 'px-2 py-0.5 text-caption',
        className
      )}
    >
      {showLabel ? config.full : config.label}
    </span>
  );
}
