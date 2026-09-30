import React from 'react';
import { Inbox } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  icon = <Inbox className="w-8 h-8 text-text-muted stroke-[1.5]" />,
  title,
  description,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-10 px-4 text-center rounded-lg border border-dashed border-border bg-bg-surface/50 max-w-md mx-auto',
        className
      )}
    >
      <div className="p-2.5 rounded-full bg-bg-subtle mb-3 text-text-secondary">
        {icon}
      </div>
      <h4 className="text-heading-3 text-text-primary mb-1">{title}</h4>
      <p className="text-body text-text-secondary max-w-sm mb-4">{description}</p>
      {actionLabel && onAction && (
        <Button variant="secondary" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
