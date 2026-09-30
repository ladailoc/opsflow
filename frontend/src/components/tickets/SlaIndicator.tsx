import React from 'react';
import { Clock, AlertTriangle, AlertCircle, CheckCircle2, PauseCircle } from 'lucide-react';
import { SlaState, SlaDisplayInfo } from '@/lib/sla';
import { cn } from '@/lib/utils';

export interface SlaIndicatorProps {
  info: SlaDisplayInfo;
  label?: string; // e.g. "Response" or "Resolution"
  className?: string;
  size?: 'sm' | 'md';
}

const SLA_STYLES: Record<
  SlaState,
  { bg: string; fg: string; border: string; icon: React.ReactNode }
> = {
  NORMAL: {
    bg: 'bg-[#E6F7EB]',
    fg: 'text-[#146E38]',
    border: 'border-[#BBF7D0]',
    icon: <Clock className="w-3.5 h-3.5 shrink-0 text-[#146E38]" />,
  },
  DUE_SOON: {
    bg: 'bg-[#FFF5E0]',
    fg: 'text-[#995703]',
    border: 'border-[#FED7AA]',
    icon: <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-[#995703]" />,
  },
  OVERDUE: {
    bg: 'bg-[#FFEAEA]',
    fg: 'text-[#B02A2B]',
    border: 'border-[#FECACA]',
    icon: <AlertCircle className="w-3.5 h-3.5 shrink-0 text-[#B02A2B]" />,
  },
};

export function SlaIndicator({ info, label, className, size = 'md' }: SlaIndicatorProps) {
  const style = SLA_STYLES[info.state] || SLA_STYLES.NORMAL;

  let icon = style.icon;
  if (info.isAchieved) {
    icon = <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-[#146E38]" />;
  } else if (info.isPaused) {
    icon = <PauseCircle className="w-3.5 h-3.5 shrink-0 text-[#995703]" />;
  }

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 font-medium rounded border select-none',
        style.bg,
        style.fg,
        style.border,
        size === 'sm' ? 'px-1.5 py-0.5 text-[11px] leading-tight' : 'px-2 py-0.5 text-caption',
        className
      )}
      title={label ? `${label}: ${info.text}` : info.text}
    >
      {icon}
      <span>
        {label && <span className="opacity-75 mr-1">{label}:</span>}
        {info.text}
      </span>
    </div>
  );
}
