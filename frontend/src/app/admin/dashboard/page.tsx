'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Clock,
  AlertTriangle,
  Inbox,
  UserCheck,
  Calendar,
  Info,
  ArrowRight,
  TrendingUp,
  ShieldAlert,
} from 'lucide-react';
import { usePrototype } from '@/prototype/PrototypeProvider';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/tickets/StatusBadge';
import { PriorityBadge } from '@/components/tickets/PriorityBadge';
import { SlaIndicator } from '@/components/tickets/SlaIndicator';
import { getResolutionSlaDisplay } from '@/lib/sla';
import { calculateAverageResolutionTime } from '@/mocks/dashboard';
import { formatMinutes } from '@/lib/utils';
import { Dialog } from '@/components/ui/dialog';

export default function AdminDashboardPage() {
  const router = useRouter();
  const { state, selectors } = usePrototype();

  const [daysRange, setDaysRange] = useState<number>(30);
  const [isCalcHelpOpen, setIsCalcHelpOpen] = useState(false);

  // Compute live metrics strictly based on confirmed business rules
  const openTickets = useMemo(() => {
    return state.tickets.filter(
      (t) => t.status === 'NEW' || t.status === 'IN_PROGRESS' || t.status === 'WAITING_FOR_EMPLOYEE'
    );
  }, [state.tickets]);

  const unassignedTickets = useMemo(() => {
    return openTickets.filter((t) => t.assigneeId === null);
  }, [openTickets]);

  const overdueTickets = useMemo(() => {
    return openTickets.filter((t) => t.sla.resolutionState === 'OVERDUE');
  }, [openTickets]);

  // Average Resolution Time (Only Resolved/Closed, latestResolvedAt in window)
  const avgResolutionData = useMemo(() => {
    return calculateAverageResolutionTime(state.tickets, daysRange);
  }, [state.tickets, daysRange]);

  // Workload by Agent (Active agents with open tickets: NEW, IN_PROGRESS, WAITING)
  const activeAgents = selectors.getActiveAgents(state);
  const workloadByAgent = useMemo(() => {
    return activeAgents.map((agent) => {
      const agentOpenTickets = openTickets.filter((t) => t.assigneeId === agent.id);
      return {
        id: agent.id,
        name: agent.name,
        department: agent.department,
        avatarColor: agent.avatarColor,
        count: agentOpenTickets.length,
      };
    }).sort((a, b) => b.count - a.count);
  }, [activeAgents, openTickets]);

  const maxWorkload = Math.max(...workloadByAgent.map((w) => w.count), unassignedTickets.length, 1);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Real-time operational metrics and resolution SLA performance."
        breadcrumbs={[
          { label: 'OpsFlow', href: '/' },
          { label: 'Administrator Dashboard' },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <span className="text-caption text-text-muted flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              Reporting Period:
            </span>
            <select
              value={daysRange}
              onChange={(e) => setDaysRange(Number(e.target.value))}
              className="h-8 px-2.5 rounded-md border border-border bg-bg-surface text-caption text-text-primary focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer font-medium"
            >
              <option value={7}>Last 7 calendar days</option>
              <option value={14}>Last 14 calendar days</option>
              <option value={30}>Last 30 days (Default)</option>
              <option value={60}>Last 60 calendar days</option>
              <option value={90}>Last 90 calendar days</option>
            </select>
          </div>
        }
      />

      {/* TOP KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* REQUIRED KPI: Average Resolution Time */}
        <div className="bg-bg-surface border border-border rounded-xl p-5 shadow-subtle flex flex-col justify-between space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-caption font-semibold text-text-muted uppercase tracking-wider">
              Avg. Resolution Time
            </span>
            <button
              onClick={() => setIsCalcHelpOpen(true)}
              className="text-text-muted hover:text-primary transition-colors p-0.5 rounded"
              title="How this metric is calculated"
            >
              <Info className="w-4 h-4" />
            </button>
          </div>

          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-display font-bold text-text-primary tracking-tight">
                {avgResolutionData.formatted}
              </span>
            </div>
            <p className="text-caption text-text-muted mt-1">
              {avgResolutionData.count > 0
                ? `Calculated from ${avgResolutionData.count} eligible resolved ticket(s)`
                : 'No eligible tickets in selected window'}
            </p>
          </div>

          <div className="pt-2 border-t border-border/60 flex items-center justify-between text-[11px] text-text-muted">
            <span>Window: Last {daysRange} days</span>
            <span className="text-emerald-700 font-medium">Vietnam 24/7 SLA</span>
          </div>
        </div>

        {/* Resolution Overdue */}
        <div className="bg-bg-surface border border-border rounded-xl p-5 shadow-subtle flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-caption font-semibold text-text-muted uppercase tracking-wider">
              Resolution Overdue
            </span>
            <AlertTriangle className="w-4 h-4 text-red-600" />
          </div>

          <div>
            <div className="flex items-baseline gap-2">
              <span className={`text-display font-bold tracking-tight ${overdueTickets.length > 0 ? 'text-red-600' : 'text-text-primary'}`}>
                {overdueTickets.length}
              </span>
              <span className="text-caption text-text-muted">tickets</span>
            </div>
            <p className="text-caption text-text-muted mt-1">
              Active tickets exceeding resolution SLA target
            </p>
          </div>

          <div className="pt-2 border-t border-border/60 flex items-center justify-between text-[11px] text-text-muted">
            <span>Needs immediate agent action</span>
          </div>
        </div>

        {/* Unassigned Tickets */}
        <div className="bg-bg-surface border border-border rounded-xl p-5 shadow-subtle flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-caption font-semibold text-text-muted uppercase tracking-wider">
              Unassigned Tickets
            </span>
            <Inbox className="w-4 h-4 text-amber-600" />
          </div>

          <div>
            <div className="flex items-baseline gap-2">
              <span className={`text-display font-bold tracking-tight ${unassignedTickets.length > 0 ? 'text-amber-700' : 'text-text-primary'}`}>
                {unassignedTickets.length}
              </span>
              <span className="text-caption text-text-muted">tickets</span>
            </div>
            <p className="text-caption text-text-muted mt-1">
              Awaiting agent assignment or take
            </p>
          </div>

          <div className="pt-2 border-t border-border/60 flex items-center justify-between text-[11px] text-text-muted">
            <Link href="/admin/tickets" className="text-primary hover:underline font-medium">
              Coordinate in Directory →
            </Link>
          </div>
        </div>

        {/* Open Tickets */}
        <div className="bg-bg-surface border border-border rounded-xl p-5 shadow-subtle flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-caption font-semibold text-text-muted uppercase tracking-wider">
              Total Open Tickets
            </span>
            <TrendingUp className="w-4 h-4 text-blue-600" />
          </div>

          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-display font-bold text-text-primary tracking-tight">
                {openTickets.length}
              </span>
              <span className="text-caption text-text-muted">tickets</span>
            </div>
            <p className="text-caption text-text-muted mt-1">
              In New, In Progress, or Waiting status
            </p>
          </div>

          <div className="pt-2 border-t border-border/60 flex items-center justify-between text-[11px] text-text-muted">
            <span>Total system workload</span>
          </div>
        </div>
      </div>

      {/* 2-COLUMN SECTION: Workload by Agent (Left) & Resolution Overdue List (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* WORKLOAD BY AGENT */}
        <div className="bg-bg-surface border border-border rounded-xl p-5 shadow-subtle space-y-4">
          <div className="flex items-center justify-between border-b border-border/80 pb-2">
            <div>
              <h3 className="text-heading-2 font-semibold text-text-primary">
                Workload by Agent
              </h3>
              <p className="text-caption text-text-muted">
                Active tickets in New, In Progress, and Waiting for Employee status.
              </p>
            </div>
          </div>

          <div className="space-y-3 pt-1">
            {/* Unassigned Bar */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-caption font-medium">
                <span className="text-amber-800 flex items-center gap-1.5 font-semibold">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  Unassigned Tickets (Triage Pool)
                </span>
                <span className="font-bold text-text-primary font-mono">{unassignedTickets.length}</span>
              </div>
              <div className="h-3 w-full bg-bg-subtle rounded-full overflow-hidden border border-border">
                <div
                  className="h-full bg-amber-500 rounded-full transition-all duration-300"
                  style={{ width: `${(unassignedTickets.length / maxWorkload) * 100}%` }}
                />
              </div>
            </div>

            {/* Individual Active Agents */}
            {workloadByAgent.map((item) => (
              <div key={item.id} className="space-y-1">
                <div className="flex items-center justify-between text-caption font-medium">
                  <span className="text-text-primary flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: item.avatarColor }}
                    />
                    <span>{item.name}</span>
                    <span className="text-[11px] text-text-muted">({item.department})</span>
                  </span>
                  <span className="font-bold text-text-primary font-mono">{item.count}</span>
                </div>
                <div className="h-3 w-full bg-bg-subtle rounded-full overflow-hidden border border-border">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-300"
                    style={{ width: `${(item.count / maxWorkload) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <p className="text-[11px] text-text-muted pt-2 border-t border-border">
            * Note: Workload counts only active open tickets. Tickets in Resolved, Closed, or Cancelled are excluded.
          </p>
        </div>

        {/* OVERDUE TICKETS LIST */}
        <div className="bg-bg-surface border border-border rounded-xl p-5 shadow-subtle space-y-4">
          <div className="flex items-center justify-between border-b border-border/80 pb-2">
            <div>
              <h3 className="text-heading-2 font-semibold text-text-primary flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                Overdue Tickets (Resolution SLA)
              </h3>
              <p className="text-caption text-text-muted">
                Requires escalation or manager intervention.
              </p>
            </div>
            <Link href="/admin/tickets">
              <Button variant="secondary" size="sm">
                View All
              </Button>
            </Link>
          </div>

          {overdueTickets.length === 0 ? (
            <div className="py-8 text-center text-caption text-text-muted">
              No tickets are currently overdue for resolution. All SLA commitments are healthy.
            </div>
          ) : (
            <div className="space-y-2.5">
              {overdueTickets.map((t) => {
                const resSla = getResolutionSlaDisplay(t.sla, t.status);
                return (
                  <div
                    key={t.id}
                    onClick={() => router.push(`/admin/tickets/${t.id}`)}
                    className="p-3 rounded-lg border border-border hover:border-red-300 bg-bg-surface hover:bg-red-50/20 transition-all cursor-pointer space-y-2 shadow-xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-caption font-semibold text-primary">
                          {t.ticketCode}
                        </span>
                        <PriorityBadge priority={t.priority} size="sm" />
                        <StatusBadge status={t.status} size="sm" />
                      </div>
                      <SlaIndicator info={resSla} size="sm" />
                    </div>

                    <p className="text-body font-medium text-text-primary line-clamp-1">
                      {t.title}
                    </p>

                    <div className="flex items-center justify-between text-caption text-text-muted">
                      <span>Requester: {t.creatorName}</span>
                      <span>Assignee: {t.assigneeName || 'Unassigned'}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* AVERAGE RESOLUTION TIME CALCULATION MODAL */}
      <Dialog
        isOpen={isCalcHelpOpen}
        onClose={() => setIsCalcHelpOpen(false)}
        title="Average Resolution Time Calculation Rules"
        description="OpsFlow calculates this KPI strictly according to the confirmed product specification."
        maxWidth="lg"
        footer={
          <Button variant="primary" size="sm" onClick={() => setIsCalcHelpOpen(false)}>
            Close
          </Button>
        }
      >
        <div className="space-y-3 text-caption text-text-secondary leading-relaxed">
          <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-lg text-blue-950 space-y-1">
            <span className="font-semibold block text-body">Eligible Dataset Criteria</span>
            <ul className="list-disc pl-4 space-y-1">
              <li>
                <strong>Current Status:</strong> Must currently be in <code>RESOLVED</code> or <code>CLOSED</code>.
              </li>
              <li>
                <strong>Reporting Window:</strong> The latest transition to <code>RESOLVED</code> must have occurred within the selected window ({daysRange} calendar days).
              </li>
              <li>
                <strong>Excluded Statuses:</strong> Tickets currently in <code>NEW</code>, <code>IN_PROGRESS</code>, <code>WAITING_FOR_EMPLOYEE</code>, or <code>CANCELLED</code> are strictly excluded.
              </li>
              <li>
                <strong>Reopened Tickets:</strong> If a previously resolved ticket is reopened and currently in progress, it is temporarily excluded. When re-resolved, it is counted once using the newest resolved timestamp.
              </li>
            </ul>
          </div>

          <div className="p-3 bg-bg-subtle border border-border rounded-lg space-y-1">
            <span className="font-semibold block text-body text-text-primary">Calculation Formula</span>
            <p>
              Duration = Accumulated active time spent in <code>NEW</code> + <code>IN_PROGRESS</code> across all reopen cycles.
            </p>
            <p>
              Excludes pause durations in <code>WAITING_FOR_EMPLOYEE</code> and <code>RESOLVED</code>.
            </p>
            <p className="font-medium text-text-primary pt-1">
              Average = Total Resolution Duration of Eligible Tickets ÷ Number of Eligible Tickets.
            </p>
          </div>

          <p className="text-[11px] text-text-muted italic">
            * Note: If no eligible tickets are found in the selected period, the system displays &quot;No data&quot; instead of misleading 0h.
          </p>
        </div>
      </Dialog>
    </div>
  );
}
