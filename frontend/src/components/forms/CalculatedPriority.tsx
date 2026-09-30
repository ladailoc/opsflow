import React from 'react';
import { ImpactLevel, UrgencyLevel, calculatePriority, PRIORITY_CONFIG } from '@/lib/priority';
import { PriorityBadge } from '@/components/tickets/PriorityBadge';
import { ShieldCheck, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface CalculatedPriorityProps {
  impact: ImpactLevel;
  urgency: UrgencyLevel;
  className?: string;
  onHelpClick?: () => void;
}

export function CalculatedPriority({
  impact,
  urgency,
  className,
  onHelpClick,
}: CalculatedPriorityProps) {
  const priority = calculatePriority(impact, urgency);
  const info = PRIORITY_CONFIG[priority];

  return (
    <div
      className={cn(
        'p-3.5 rounded-lg border border-border bg-bg-subtle space-y-2 select-none',
        className
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-label font-medium text-text-secondary flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-primary" />
          Calculated Priority (Read-Only)
        </span>
        <div className="flex items-center gap-2">
          <PriorityBadge priority={priority} size="md" showLabel />
          {onHelpClick && (
            <button
              type="button"
              onClick={onHelpClick}
              className="text-caption text-primary hover:underline inline-flex items-center gap-1"
            >
              <Info className="w-3.5 h-3.5" />
              View Matrix
            </button>
          )}
        </div>
      </div>

      <p className="text-caption text-text-secondary leading-relaxed">
        {info.description}
      </p>

      <div className="pt-2 border-t border-border/60 flex items-center justify-between text-caption text-text-muted">
        <span>SLA First Response: <strong>{info.firstResponseTargetMinutes}m</strong></span>
        <span>SLA Resolution: <strong>{info.resolutionTargetMinutes / 60}h</strong></span>
      </div>
    </div>
  );
}
