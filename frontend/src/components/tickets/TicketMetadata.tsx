import React from 'react';
import { Ticket } from '@/mocks/tickets';
import { StatusBadge } from './StatusBadge';
import { PriorityBadge } from './PriorityBadge';
import { SlaIndicator } from './SlaIndicator';
import { getFirstResponseSlaDisplay, getResolutionSlaDisplay } from '@/lib/sla';
import { formatDateTime } from '@/lib/utils';
import { User, Tag, Calendar, Layers, ShieldAlert, Clock } from 'lucide-react';

export interface TicketMetadataProps {
  ticket: Ticket;
}

export function TicketMetadata({ ticket }: TicketMetadataProps) {
  const firstResponseSla = getFirstResponseSlaDisplay(ticket.sla);
  const resolutionSla = getResolutionSlaDisplay(ticket.sla, ticket.status);

  return (
    <div className="bg-bg-surface border border-border rounded-lg p-4 space-y-4 shadow-subtle">
      <h4 className="text-caption font-semibold text-text-muted uppercase tracking-wider">
        Ticket Details
      </h4>

      <div className="space-y-3 divide-y divide-border/60 text-body">
        {/* Status */}
        <div className="flex items-center justify-between pt-2">
          <span className="text-text-secondary flex items-center gap-1.5 text-caption font-medium">
            <Layers className="w-3.5 h-3.5 text-text-muted" /> Status
          </span>
          <StatusBadge status={ticket.status} />
        </div>

        {/* Priority */}
        <div className="flex items-center justify-between pt-2">
          <span className="text-text-secondary flex items-center gap-1.5 text-caption font-medium">
            <ShieldAlert className="w-3.5 h-3.5 text-text-muted" /> Priority
          </span>
          <PriorityBadge priority={ticket.priority} showLabel />
        </div>

        {/* Impact & Urgency */}
        <div className="flex items-center justify-between pt-2">
          <span className="text-text-secondary text-caption font-medium">Impact / Urgency</span>
          <span className="text-caption font-medium text-text-primary">
            {ticket.impact} / {ticket.urgency}
          </span>
        </div>

        {/* Request Type */}
        <div className="flex items-center justify-between pt-2">
          <span className="text-text-secondary flex items-center gap-1.5 text-caption font-medium">
            <Tag className="w-3.5 h-3.5 text-text-muted" /> Request Type
          </span>
          <span className="text-caption font-medium text-text-primary truncate max-w-[180px]">
            {ticket.requestTypeName}
          </span>
        </div>

        {/* Creator */}
        <div className="flex items-center justify-between pt-2">
          <span className="text-text-secondary flex items-center gap-1.5 text-caption font-medium">
            <User className="w-3.5 h-3.5 text-text-muted" /> Requester
          </span>
          <span className="text-caption font-medium text-text-primary">
            {ticket.creatorName}
          </span>
        </div>

        {/* Assignee */}
        <div className="flex items-center justify-between pt-2">
          <span className="text-text-secondary flex items-center gap-1.5 text-caption font-medium">
            <User className="w-3.5 h-3.5 text-text-muted" /> Assignee
          </span>
          <span className="text-caption font-medium text-text-primary">
            {ticket.assigneeName ? (
              <span className="inline-flex items-center gap-1 text-primary-700 font-semibold">
                {ticket.assigneeName}
              </span>
            ) : (
              <span className="text-text-muted italic">Unassigned</span>
            )}
          </span>
        </div>

        {/* First Response SLA */}
        <div className="flex flex-col gap-1 pt-2">
          <span className="text-text-secondary flex items-center gap-1.5 text-caption font-medium">
            <Clock className="w-3.5 h-3.5 text-text-muted" /> First Response SLA
          </span>
          <div className="self-start">
            <SlaIndicator info={firstResponseSla} size="sm" />
          </div>
        </div>

        {/* Resolution SLA */}
        <div className="flex flex-col gap-1 pt-2">
          <span className="text-text-secondary flex items-center gap-1.5 text-caption font-medium">
            <Clock className="w-3.5 h-3.5 text-text-muted" /> Resolution SLA
          </span>
          <div className="self-start">
            <SlaIndicator info={resolutionSla} size="sm" />
          </div>
        </div>

        {/* Created At */}
        <div className="flex items-center justify-between pt-2">
          <span className="text-text-secondary flex items-center gap-1.5 text-caption font-medium">
            <Calendar className="w-3.5 h-3.5 text-text-muted" /> Created
          </span>
          <span className="text-caption text-text-muted">{formatDateTime(ticket.createdAt)}</span>
        </div>
      </div>
    </div>
  );
}
