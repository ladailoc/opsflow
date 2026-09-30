import React from 'react';
import { HistoryEntry } from '@/mocks/history';
import { formatDateTime } from '@/lib/utils';
import { Clock, CheckCircle2, UserCheck, MessageSquare, AlertTriangle, ArrowRight } from 'lucide-react';

export interface HistoryTimelineProps {
  entries: HistoryEntry[];
}

export function HistoryTimeline({ entries }: HistoryTimelineProps) {
  if (entries.length === 0) {
    return (
      <div className="py-6 text-center text-caption text-text-muted">
        No history events recorded yet.
      </div>
    );
  }

  return (
    <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[2px] before:bg-border">
      {entries.map((entry) => (
        <div key={entry.id} className="relative group">
          {/* Timeline Dot */}
          <div className="absolute -left-6 top-1 w-4 h-4 rounded-full bg-bg-surface border-2 border-primary flex items-center justify-center shrink-0">
            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-body-medium font-semibold text-text-primary">
                {entry.action}
              </span>
              <span className="text-caption text-text-muted">by</span>
              <span className="text-caption font-medium text-text-secondary">
                {entry.actorName} ({entry.actorRole === 'SUPPORT_AGENT' ? 'Agent' : entry.actorRole === 'ADMINISTRATOR' ? 'Admin' : 'Employee'})
              </span>
              <span className="text-caption text-text-muted">·</span>
              <span className="text-caption text-text-muted">{formatDateTime(entry.timestamp)}</span>
            </div>

            <p className="text-body text-text-secondary">{entry.details}</p>

            {entry.reason && (
              <div className="mt-1.5 p-2 rounded bg-bg-subtle border border-border text-caption text-text-secondary">
                <span className="font-semibold text-text-primary">Reason: </span>
                <span>{entry.reason}</span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
