'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/tickets/StatusBadge';
import { PriorityBadge } from '@/components/tickets/PriorityBadge';
import { SlaIndicator } from '@/components/tickets/SlaIndicator';
import { DataTable } from '@/components/tickets/DataTable';
import { CommentItem } from '@/components/tickets/CommentItem';
import { InternalNoteItem } from '@/components/tickets/InternalNoteItem';
import { HistoryTimeline } from '@/components/tickets/HistoryTimeline';
import { CalculatedPriority } from '@/components/forms/CalculatedPriority';
import { PriorityMatrixHelp } from '@/components/forms/PriorityMatrixHelp';
import { EmptyState } from '@/components/feedback/EmptyState';
import { TableSkeleton, DetailSkeleton } from '@/components/feedback/LoadingSkeleton';
import { ConfirmDialog } from '@/components/feedback/ConfirmDialog';
import {
  AssignTicketModal,
  ReassignModal,
  UpdateImpactUrgencyModal,
  WaitingQuestionModal,
  ResolveSolutionModal,
  CancelTicketModal,
  AdminCloseModal,
  ConfirmCloseModal,
  ReopenTicketModal,
} from '@/components/tickets/ActionModals';
import { usePrototype } from '@/prototype/PrototypeProvider';
import {
  Sparkles,
  Search,
  Lock,
  Plus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Info,
  Layers,
  ArrowRight,
  ExternalLink,
  ShieldAlert,
  Play,
  UserCheck,
  UserX,
  FileQuestion,
  FileCheck,
  RotateCcw,
  SlidersHorizontal,
  Clock,
  RefreshCw,
  Copy,
  Users,
  Check,
  Ban,
  FileText,
} from 'lucide-react';
import { TicketStatus } from '@/mocks/tickets';
import { PriorityLevel, ImpactLevel, UrgencyLevel } from '@/lib/priority';

export default function DesignSystemPage() {
  const { state, dispatch, selectors } = usePrototype();
  const [activeTab, setActiveTab] = useState<
    'foundations' | 'components' | 'communication' | 'feedback' | 'states_modals' | 'prototype_flows'
  >('foundations');

  // Interactive controls state
  const [inputVal, setInputVal] = useState('Sample operational text');
  const [selectedImpact, setSelectedImpact] = useState<ImpactLevel>('HIGH');
  const [selectedUrgency, setSelectedUrgency] = useState<UrgencyLevel>('MEDIUM');
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  // Modals for 07 - States & Modals showroom
  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [isReassignOpen, setIsReassignOpen] = useState(false);
  const [isImpactUrgencyOpen, setIsImpactUrgencyOpen] = useState(false);
  const [isWaitOpen, setIsWaitOpen] = useState(false);
  const [isResolveOpen, setIsResolveOpen] = useState(false);
  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const [isAdminCloseOpen, setIsAdminCloseOpen] = useState(false);
  const [isConfirmCloseOpen, setIsConfirmCloseOpen] = useState(false);
  const [isReopenOpen, setIsReopenOpen] = useState(false);

  const activeAgents = selectors.getActiveAgents(state);

  const sampleColumns = [
    { key: 'ticketCode', header: 'Ticket Code', width: '130px', sortable: true },
    { key: 'title', header: 'Title & Summary', sortable: true },
    {
      key: 'status',
      header: 'Status',
      width: '150px',
      render: (t: any) => <StatusBadge status={t.status} size="sm" />,
    },
    {
      key: 'priority',
      header: 'Priority',
      width: '90px',
      render: (t: any) => <PriorityBadge priority={t.priority} size="sm" />,
    },
    {
      key: 'assigneeName',
      header: 'Assignee',
      width: '140px',
      render: (t: any) =>
        t.assigneeName ? (
          <span className="font-medium text-text-primary">{t.assigneeName}</span>
        ) : (
          <span className="text-text-muted italic">Unassigned</span>
        ),
    },
  ];

  return (
    <AppShell>
      <PageHeader
        title="Design System & Component Showroom"
        description="Comprehensive enterprise SaaS design tokens, typography, edge states, and prototype flows."
        breadcrumbs={[
          { label: 'OpsFlow', href: '/' },
          { label: 'Design System' },
        ]}
        actions={
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<Sparkles className="w-3.5 h-3.5 text-primary" />}
              onClick={() => setIsHelpOpen(true)}
            >
              Priority Matrix Reference
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() =>
                dispatch({
                  type: 'SHOW_TOAST',
                  payload: {
                    type: 'success',
                    title: 'System Toast',
                    message: 'Design token validated successfully.',
                  },
                })
              }
            >
              Trigger Toast
            </Button>
          </div>
        }
      />

      {/* Showroom Navigation Tabs */}
      <div className="flex items-center gap-1 border-b border-border mb-6 overflow-x-auto">
        {[
          { id: 'foundations', label: '00 – Foundations' },
          { id: 'components', label: '01 – Components' },
          { id: 'communication', label: '02 – Communication' },
          { id: 'feedback', label: 'Feedback & Skeletons' },
          { id: 'states_modals', label: '07 – States & Modals' },
          { id: 'prototype_flows', label: '08 – Prototype Flows' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2.5 text-body font-medium transition-colors border-b-2 -mb-[2px] whitespace-nowrap ${
              activeTab === tab.id
                ? 'border-primary text-primary font-semibold'
                : 'border-transparent text-text-secondary hover:text-text-primary hover:border-border'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 00 - FOUNDATIONS */}
      {activeTab === 'foundations' && (
        <div className="space-y-8 animate-in fade-in duration-150">
          {/* Colors */}
          <section className="space-y-4">
            <h3 className="text-heading-2 text-text-primary border-b border-border pb-2">
              Color Tokens (OpsFlow Tokens.json)
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              <div className="p-3 rounded-lg border border-border bg-bg-surface space-y-1">
                <div className="h-10 rounded bg-[#2563EB] border border-blue-600 shadow-sm" />
                <p className="text-caption font-semibold">Primary Action</p>
                <p className="text-[11px] font-mono text-text-muted">#2563EB</p>
              </div>
              <div className="p-3 rounded-lg border border-border bg-bg-surface space-y-1">
                <div className="h-10 rounded bg-[#111827] shadow-sm" />
                <p className="text-caption font-semibold">Text Primary</p>
                <p className="text-[11px] font-mono text-text-muted">#111827</p>
              </div>
              <div className="p-3 rounded-lg border border-border bg-bg-surface space-y-1">
                <div className="h-10 rounded bg-[#4B5563] shadow-sm" />
                <p className="text-caption font-semibold">Text Secondary</p>
                <p className="text-[11px] font-mono text-text-muted">#4B5563</p>
              </div>
              <div className="p-3 rounded-lg border border-border bg-bg-surface space-y-1">
                <div className="h-10 rounded bg-[#16A34A] shadow-sm" />
                <p className="text-caption font-semibold">Semantic Success</p>
                <p className="text-[11px] font-mono text-text-muted">#16A34A</p>
              </div>
              <div className="p-3 rounded-lg border border-border bg-bg-surface space-y-1">
                <div className="h-10 rounded bg-[#D97706] shadow-sm" />
                <p className="text-caption font-semibold">Semantic Warning</p>
                <p className="text-[11px] font-mono text-text-muted">#D97706</p>
              </div>
              <div className="p-3 rounded-lg border border-border bg-bg-surface space-y-1">
                <div className="h-10 rounded bg-[#DC2626] shadow-sm" />
                <p className="text-caption font-semibold">Semantic Danger</p>
                <p className="text-[11px] font-mono text-text-muted">#DC2626</p>
              </div>
            </div>
          </section>

          {/* Typography */}
          <section className="space-y-4">
            <h3 className="text-heading-2 text-text-primary border-b border-border pb-2">
              Typography Scale (Inter)
            </h3>
            <div className="space-y-3 bg-bg-surface border border-border rounded-lg p-5">
              <div className="border-b border-border pb-3">
                <p className="text-display font-semibold">Display / 28px SemiBold</p>
                <p className="text-[12px] text-text-muted">Key dashboards, landing, and primary counters</p>
              </div>
              <div className="border-b border-border pb-3">
                <p className="text-heading-1 font-semibold">Heading 1 / 22px SemiBold</p>
                <p className="text-[12px] text-text-muted">Page headers and primary screen titles</p>
              </div>
              <div className="border-b border-border pb-3">
                <p className="text-heading-2 font-semibold">Heading 2 / 18px SemiBold</p>
                <p className="text-[12px] text-text-muted">Section headers, modal titles, and card groups</p>
              </div>
              <div className="border-b border-border pb-3">
                <p className="text-heading-3 font-semibold">Heading 3 / 15px SemiBold</p>
                <p className="text-[12px] text-text-muted">Component group titles and widget headers</p>
              </div>
              <div className="border-b border-border pb-3">
                <p className="text-body font-normal text-text-primary">
                  Body Regular / 13px Regular (400) — The standard density font for tables, metadata, and thread conversations.
                </p>
              </div>
              <div>
                <p className="text-caption text-text-secondary font-medium">
                  Caption / 12px Medium (500) — Labels, form descriptors, and secondary breadcrumb tags.
                </p>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* 01 - COMPONENTS */}
      {activeTab === 'components' && (
        <div className="space-y-8 animate-in fade-in duration-150">
          {/* Buttons */}
          <section className="space-y-4">
            <h3 className="text-heading-2 text-text-primary border-b border-border pb-2">
              Buttons & Action Hierarchy
            </h3>
            <div className="flex flex-wrap gap-3 items-center bg-bg-surface border border-border rounded-lg p-5">
              <Button variant="primary" size="md">
                Primary Action
              </Button>
              <Button variant="secondary" size="md">
                Secondary Action
              </Button>
              <Button variant="danger" size="md">
                Danger Action
              </Button>
              <Button variant="ghost" size="md">
                Ghost Action
              </Button>
              <Button variant="primary" size="sm" leftIcon={<Plus className="w-3.5 h-3.5" />}>
                Small with Icon
              </Button>
              <Button variant="secondary" size="md" isLoading>
                Loading State
              </Button>
              <Button variant="primary" size="md" disabled>
                Disabled State
              </Button>
            </div>
          </section>

          {/* Form Inputs */}
          <section className="space-y-4 max-w-2xl">
            <h3 className="text-heading-2 text-text-primary border-b border-border pb-2">
              Form Controls
            </h3>
            <div className="bg-bg-surface border border-border rounded-lg p-5 space-y-4">
              <Input
                label="Standard Text Input *"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="Enter value..."
              />
              <Input
                label="Input with Validation Error"
                value="Invalid input string"
                error="Field format does not meet requirement criteria."
                readOnly
              />
              <Select
                label="Single Selection Dropdown"
                options={[
                  { value: 'opt1', label: 'Option 1 - Engineering' },
                  { value: 'opt2', label: 'Option 2 - Operations' },
                  { value: 'opt3', label: 'Option 3 - Finance' },
                ]}
              />
              <Textarea
                label="Operational Textarea"
                rows={3}
                placeholder="Type multiple lines of technical diagnostics..."
              />
            </div>
          </section>

          {/* Status & Priority Badges */}
          <section className="space-y-4">
            <h3 className="text-heading-2 text-text-primary border-b border-border pb-2">
              Domain Status & Calculated Priority Badges
            </h3>
            <div className="bg-bg-surface border border-border rounded-lg p-5 space-y-4">
              <div>
                <p className="text-caption font-semibold text-text-muted mb-2">TICKET STATUSES (6)</p>
                <div className="flex flex-wrap gap-2">
                  <StatusBadge status="NEW" />
                  <StatusBadge status="IN_PROGRESS" />
                  <StatusBadge status="WAITING_FOR_EMPLOYEE" />
                  <StatusBadge status="RESOLVED" />
                  <StatusBadge status="CLOSED" />
                  <StatusBadge status="CANCELLED" />
                </div>
              </div>

              <div>
                <p className="text-caption font-semibold text-text-muted mb-2">CALCULATED PRIORITIES (P1 - P4)</p>
                <div className="flex flex-wrap gap-2">
                  <PriorityBadge priority="P1" showLabel />
                  <PriorityBadge priority="P2" showLabel />
                  <PriorityBadge priority="P3" showLabel />
                  <PriorityBadge priority="P4" showLabel />
                </div>
              </div>

              <div>
                <p className="text-caption font-semibold text-text-muted mb-2">SLA INDICATORS</p>
                <div className="flex flex-wrap gap-3">
                  <SlaIndicator info={{ state: 'NORMAL', text: 'Due in 2h 45m', isPaused: false, isAchieved: false }} />
                  <SlaIndicator info={{ state: 'DUE_SOON', text: 'Due in 15m (Urgent)', isPaused: false, isAchieved: false }} />
                  <SlaIndicator info={{ state: 'OVERDUE', text: 'Overdue by 1h 20m', isPaused: false, isAchieved: false }} />
                  <SlaIndicator info={{ state: 'NORMAL', text: 'Paused in Waiting', isPaused: true, isAchieved: false }} />
                  <SlaIndicator info={{ state: 'NORMAL', text: 'Achieved in 18m', isPaused: false, isAchieved: true }} />
                </div>
              </div>
            </div>
          </section>

          {/* Operational DataTable */}
          <section className="space-y-4">
            <h3 className="text-heading-2 text-text-primary border-b border-border pb-2">
              Operational Data Table (Sortable & Paginated)
            </h3>
            <DataTable
              columns={sampleColumns}
              data={state.tickets.slice(0, 5)}
              defaultPageSize={5}
            />
          </section>
        </div>
      )}

      {/* 02 - COMMUNICATION */}
      {activeTab === 'communication' && (
        <div className="space-y-8 animate-in fade-in duration-150">
          {/* Comments & Internal Notes */}
          <section className="space-y-4 max-w-3xl">
            <h3 className="text-heading-2 text-text-primary border-b border-border pb-2">
              Public Comment vs Internal Note
            </h3>
            <div className="space-y-4 bg-bg-surface border border-border rounded-lg p-6 shadow-subtle">
              <CommentItem
                comment={{
                  id: 'cmt-1',
                  ticketId: 't-00124',
                  authorId: 'user-emp-01',
                  authorName: 'Alex Nguyen',
                  authorRole: 'EMPLOYEE',
                  type: 'PUBLIC',
                  content: 'Good morning IT team, all Ethernet jacks in room 402 appear dead since 8 AM.',
                  createdAt: '2026-09-24T08:15:00+07:00',
                }}
              />
              <CommentItem
                comment={{
                  id: 'cmt-2',
                  ticketId: 't-00124',
                  authorId: 'user-agt-01',
                  authorName: 'Maya Chen',
                  authorRole: 'SUPPORT_AGENT',
                  type: 'PUBLIC',
                  content: 'Hi Alex, I have dispatched a technician to inspect the switch stack in rack B2.',
                  createdAt: '2026-09-24T08:35:00+07:00',
                }}
              />
              <InternalNoteItem
                comment={{
                  id: 'cmt-3',
                  ticketId: 't-00124',
                  authorId: 'user-agt-01',
                  authorName: 'Maya Chen',
                  authorRole: 'SUPPORT_AGENT',
                  type: 'INTERNAL',
                  content: 'SFP module on port 24 showed amber fault in switch logs. Hot-swapping spare optic now.',
                  createdAt: '2026-09-24T08:40:00+07:00',
                }}
              />
            </div>
          </section>

          {/* Audit History Timeline */}
          <section className="space-y-4 max-w-3xl">
            <h3 className="text-heading-2 text-text-primary border-b border-border pb-2">
              Human-Readable Audit History Timeline
            </h3>
            <div className="bg-bg-surface border border-border rounded-lg p-6 shadow-subtle">
              <HistoryTimeline entries={state.history.slice(0, 4)} />
            </div>
          </section>
        </div>
      )}

      {/* FEEDBACK & SKELETONS */}
      {activeTab === 'feedback' && (
        <div className="space-y-8 animate-in fade-in duration-150">
          <section className="space-y-4">
            <h3 className="text-heading-2 text-text-primary border-b border-border pb-2">
              Compact Enterprise Empty State
            </h3>
            <div className="bg-bg-surface border border-border rounded-lg p-6">
              <EmptyState
                title="No Open Tickets in Queue"
                description="All tickets assigned to your department have been resolved or closed. Great job!"
                actionLabel="Create New Request"
                onAction={() =>
                  dispatch({
                    type: 'SHOW_TOAST',
                    payload: {
                      type: 'info',
                      title: 'Action Triggered',
                      message: 'Navigating to Create Ticket form.',
                    },
                  })
                }
              />
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-heading-2 text-text-primary border-b border-border pb-2">
              Loading Skeletons
            </h3>
            <div className="bg-bg-surface border border-border rounded-lg">
              <TableSkeleton rows={3} cols={4} />
            </div>
          </section>
        </div>
      )}

      {/* 07 - STATES & MODALS */}
      {activeTab === 'states_modals' && (
        <div className="space-y-10 animate-in fade-in duration-150">
          {/* SECTION 1: Semantic Action Modals */}
          <section className="space-y-4">
            <div className="border-b border-border pb-2">
              <h3 className="text-heading-2 text-text-primary">
                1. Reusable Semantic Action Modals
              </h3>
              <p className="text-caption text-text-secondary">
                Specific, intent-driven modals enforcing mandatory reasons and role authorization checks.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Assign Ticket */}
              <div className="bg-bg-surface border border-border rounded-lg p-4 space-y-3 shadow-subtle flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-primary font-semibold text-body-medium">
                    <UserCheck className="w-4 h-4" />
                    <span>Assign Ticket</span>
                  </div>
                  <p className="text-caption text-text-secondary mt-1">
                    Allows Administrator to assign ticket. Restricted strictly to active Support Agents.
                  </p>
                </div>
                <Button variant="secondary" size="sm" onClick={() => setIsAssignOpen(true)}>
                  Test Assign Modal
                </Button>
              </div>

              {/* Reassign Ticket */}
              <div className="bg-bg-surface border border-border rounded-lg p-4 space-y-3 shadow-subtle flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-amber-700 font-semibold text-body-medium">
                    <UserX className="w-4 h-4" />
                    <span>Reassign Ticket</span>
                  </div>
                  <p className="text-caption text-text-secondary mt-1">
                    Transfers ownership to new agent. Requires mandatory reason and preserves accumulated SLA.
                  </p>
                </div>
                <Button variant="secondary" size="sm" onClick={() => setIsReassignOpen(true)}>
                  Test Reassign Modal
                </Button>
              </div>

              {/* Update Impact & Urgency */}
              <div className="bg-bg-surface border border-border rounded-lg p-4 space-y-3 shadow-subtle flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-blue-700 font-semibold text-body-medium">
                    <SlidersHorizontal className="w-4 h-4" />
                    <span>Update Impact & Urgency</span>
                  </div>
                  <p className="text-caption text-text-secondary mt-1">
                    Adjusts severity factors with reason. Recalculates priority; NO direct priority editing.
                  </p>
                </div>
                <Button variant="secondary" size="sm" onClick={() => setIsImpactUrgencyOpen(true)}>
                  Test Factors Modal
                </Button>
              </div>

              {/* Wait for Employee */}
              <div className="bg-bg-surface border border-border rounded-lg p-4 space-y-3 shadow-subtle flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-amber-700 font-semibold text-body-medium">
                    <FileQuestion className="w-4 h-4" />
                    <span>Wait for Employee</span>
                  </div>
                  <p className="text-caption text-text-secondary mt-1">
                    Requires a public clarifying question. Pauses Resolution SLA clock.
                  </p>
                </div>
                <Button variant="secondary" size="sm" onClick={() => setIsWaitOpen(true)}>
                  Test Question Modal
                </Button>
              </div>

              {/* Resolve Ticket */}
              <div className="bg-bg-surface border border-border rounded-lg p-4 space-y-3 shadow-subtle flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-emerald-700 font-semibold text-body-medium">
                    <FileCheck className="w-4 h-4" />
                    <span>Resolve Ticket</span>
                  </div>
                  <p className="text-caption text-text-secondary mt-1">
                    Requires a public solution summary so employee can verify the outcome.
                  </p>
                </div>
                <Button variant="secondary" size="sm" onClick={() => setIsResolveOpen(true)}>
                  Test Resolve Modal
                </Button>
              </div>

              {/* Cancel Ticket */}
              <div className="bg-bg-surface border border-border rounded-lg p-4 space-y-3 shadow-subtle flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-red-700 font-semibold text-body-medium">
                    <Trash2 className="w-4 h-4" />
                    <span>Cancel Ticket</span>
                  </div>
                  <p className="text-caption text-text-secondary mt-1">
                    Moves ticket to terminal CANCELLED state. Requires mandatory cancellation reason.
                  </p>
                </div>
                <Button variant="danger" size="sm" onClick={() => setIsCancelOpen(true)}>
                  Test Cancel Modal
                </Button>
              </div>

              {/* Confirm & Close */}
              <div className="bg-bg-surface border border-border rounded-lg p-4 space-y-3 shadow-subtle flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-emerald-700 font-semibold text-body-medium">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Confirm & Close</span>
                  </div>
                  <p className="text-caption text-text-secondary mt-1">
                    Employee verifies resolution and moves ticket to permanent CLOSED state.
                  </p>
                </div>
                <Button variant="secondary" size="sm" onClick={() => setIsConfirmCloseOpen(true)}>
                  Test Confirm & Close
                </Button>
              </div>

              {/* Admin Close */}
              <div className="bg-bg-surface border border-border rounded-lg p-4 space-y-3 shadow-subtle flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-slate-800 font-semibold text-body-medium">
                    <Lock className="w-4 h-4" />
                    <span>Admin Close</span>
                  </div>
                  <p className="text-caption text-text-secondary mt-1">
                    Administrative direct closing with mandatory audit sign-off reason.
                  </p>
                </div>
                <Button variant="secondary" size="sm" onClick={() => setIsAdminCloseOpen(true)}>
                  Test Admin Close
                </Button>
              </div>

              {/* Reopen Ticket */}
              <div className="bg-bg-surface border border-border rounded-lg p-4 space-y-3 shadow-subtle flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-amber-700 font-semibold text-body-medium">
                    <RotateCcw className="w-4 h-4" />
                    <span>Reopen Ticket</span>
                  </div>
                  <p className="text-caption text-text-secondary mt-1">
                    Returns resolved ticket to IN_PROGRESS. Mandatory reason; resumes Resolution SLA.
                  </p>
                </div>
                <Button variant="secondary" size="sm" onClick={() => setIsReopenOpen(true)}>
                  Test Reopen Modal
                </Button>
              </div>
            </div>
          </section>

          {/* SECTION 2: Concurrency Collision UI */}
          <section className="space-y-4">
            <div className="border-b border-border pb-2">
              <h3 className="text-heading-2 text-text-primary">
                2. Concurrent Update Collision UI (Optimistic Concurrency)
              </h3>
              <p className="text-caption text-text-secondary">
                Production-ready stale data recovery. No 409 errors; preserves user drafts with Reload CTA.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Take Collision */}
              <div className="bg-bg-surface border border-border rounded-lg p-4 space-y-3 shadow-subtle flex flex-col justify-between">
                <div>
                  <Badge variant="warning">Take vs Take</Badge>
                  <h4 className="font-semibold text-text-primary mt-2">Ticket Already Assigned</h4>
                  <p className="text-caption text-text-secondary mt-1">
                    Triggered when two agents attempt to Take the same unassigned ticket simultaneously.
                  </p>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() =>
                    dispatch({
                      type: 'SIMULATE_CONFLICT',
                      payload: { scenario: 'TAKE_COLLISION', ticketId: 't-00128' },
                    })
                  }
                >
                  Simulate Take Collision
                </Button>
              </div>

              {/* Edit vs Start Collision */}
              <div className="bg-bg-surface border border-border rounded-lg p-4 space-y-3 shadow-subtle flex flex-col justify-between">
                <div>
                  <Badge variant="warning">Edit vs Start</Badge>
                  <h4 className="font-semibold text-text-primary mt-2">Employee Edit Rejected</h4>
                  <p className="text-caption text-text-secondary mt-1">
                    Agent starts processing while Employee edits. Preserves draft and provides Copy Draft CTA.
                  </p>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() =>
                    dispatch({
                      type: 'SIMULATE_CONFLICT',
                      payload: {
                        scenario: 'EDIT_START_COLLISION',
                        ticketId: 't-00129',
                        draftData: {
                          title: 'GitLab repository push rejected with 403 Forbidden [DRAFT UPDATE]',
                          description: 'Additional diagnostics: Pre-receive hook returned exit code 1 on branch release-v2.3.',
                        },
                      },
                    })
                  }
                >
                  Simulate Edit Collision
                </Button>
              </div>

              {/* Ticket Changed */}
              <div className="bg-bg-surface border border-border rounded-lg p-4 space-y-3 shadow-subtle flex flex-col justify-between">
                <div>
                  <Badge variant="info">Stale Version</Badge>
                  <h4 className="font-semibold text-text-primary mt-2">Ticket Changed Since Opened</h4>
                  <p className="text-caption text-text-secondary mt-1">
                    Version mismatch on any action. Prompts user to reload before continuing.
                  </p>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() =>
                    dispatch({
                      type: 'SIMULATE_CONFLICT',
                      payload: { scenario: 'TICKET_CHANGED', ticketId: 't-00124' },
                    })
                  }
                >
                  Simulate Stale Version
                </Button>
              </div>

              {/* Cancel vs Resolve */}
              <div className="bg-bg-surface border border-border rounded-lg p-4 space-y-3 shadow-subtle flex flex-col justify-between">
                <div>
                  <Badge variant="danger">Cancel vs Resolve</Badge>
                  <h4 className="font-semibold text-text-primary mt-2">Cancel Rejected (Resolved Won)</h4>
                  <p className="text-caption text-text-secondary mt-1">
                    Employee tries to cancel while Agent resolves. System informs ticket is already resolved.
                  </p>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() =>
                    dispatch({
                      type: 'SIMULATE_CONFLICT',
                      payload: { scenario: 'CANCEL_REJECTED', ticketId: 't-00126' },
                    })
                  }
                >
                  Simulate Cancel Collision
                </Button>
              </div>

              {/* Resolve vs Cancel */}
              <div className="bg-bg-surface border border-border rounded-lg p-4 space-y-3 shadow-subtle flex flex-col justify-between">
                <div>
                  <Badge variant="danger">Resolve vs Cancel</Badge>
                  <h4 className="font-semibold text-text-primary mt-2">Resolve Rejected (Cancel Won)</h4>
                  <p className="text-caption text-text-secondary mt-1">
                    Agent tries to resolve while Employee cancels. Ensures unsent solution text is not posted.
                  </p>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() =>
                    dispatch({
                      type: 'SIMULATE_CONFLICT',
                      payload: { scenario: 'RESOLVE_REJECTED', ticketId: 't-00130' },
                    })
                  }
                >
                  Simulate Resolve Collision
                </Button>
              </div>
            </div>
          </section>

          {/* SECTION 3: Common Application Edge States */}
          <section className="space-y-4">
            <div className="border-b border-border pb-2">
              <h3 className="text-heading-2 text-text-primary">
                3. Common Operational Edge States
              </h3>
              <p className="text-caption text-text-secondary">
                Standard visual language for warnings, locked states, and read-only views.
              </p>
            </div>

            <div className="space-y-4">
              {/* Read Only Banner */}
              <div className="p-3.5 rounded-lg bg-blue-50/80 border border-blue-200 text-caption text-blue-900 flex items-center gap-2.5">
                <Info className="w-4 h-4 text-blue-600 shrink-0" />
                <span>
                  <strong>Read-Only Notice:</strong> Assigned to <strong>Maya Chen</strong>. You can review this ticket, but only the assigned agent or an administrator can perform workflow operations.
                </span>
              </div>

              {/* Waiting for Response Banner */}
              <div className="p-3.5 rounded-lg bg-amber-50/90 border border-amber-300 text-caption text-amber-950 flex items-center gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  <strong>Awaiting Requester Reply:</strong> Support agent asked for more information. Resolution SLA is paused until employee responds.
                </span>
              </div>

              {/* Terminal State Notice */}
              <div className="p-3.5 rounded-lg bg-bg-subtle border border-border text-center text-caption text-text-muted">
                This ticket is <strong>CLOSED</strong>. Further comments and status modifications are permanently sealed.
              </div>
            </div>
          </section>
        </div>
      )}

      {/* 08 - PROTOTYPE FLOWS */}
      {activeTab === 'prototype_flows' && (
        <div className="space-y-10 animate-in fade-in duration-150">
          <div className="border-b border-border pb-2">
            <h3 className="text-heading-2 text-text-primary">
              Prototype Journey & Flow Verification (08 – Prototype)
            </h3>
            <p className="text-caption text-text-secondary">
              Step through the 3 end-to-end user journeys defined in the business specification.
            </p>
          </div>

          {/* FLOW 1: EMPLOYEE */}
          <div className="bg-bg-surface border border-border rounded-xl p-5 shadow-subtle space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 text-[12px] font-bold flex items-center justify-center">
                  1
                </span>
                <h4 className="text-heading-3 text-text-primary font-bold">
                  Flow 1 — Employee Experience
                </h4>
              </div>
              <Badge variant="primary">Alex Nguyen (EMPLOYEE)</Badge>
            </div>

            <p className="text-caption text-text-secondary">
              Login → My Tickets → Create Ticket → Edit while NEW → Reply to inquiry → Verify resolution & Confirm & Close / Reopen.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
              <div className="p-3 rounded-lg border border-border bg-bg-subtle/50 space-y-2">
                <p className="text-caption font-semibold text-text-primary">Step 1: View My Tickets</p>
                <p className="text-[12px] text-text-muted">Filtered strictly to tickets created by employee.</p>
                <Link href="/employee/tickets">
                  <Button variant="secondary" size="sm" className="w-full mt-1">
                    Open My Tickets
                  </Button>
                </Link>
              </div>

              <div className="p-3 rounded-lg border border-border bg-bg-subtle/50 space-y-2">
                <p className="text-caption font-semibold text-text-primary">Step 2: Create Request</p>
                <p className="text-[12px] text-text-muted">Calculated priority, no direct priority input.</p>
                <Link href="/employee/tickets/new">
                  <Button variant="secondary" size="sm" className="w-full mt-1">
                    Create Ticket Form
                  </Button>
                </Link>
              </div>

              <div className="p-3 rounded-lg border border-border bg-bg-subtle/50 space-y-2">
                <p className="text-caption font-semibold text-text-primary">Step 3: Edit while NEW</p>
                <p className="text-[12px] text-text-muted">Edit permitted before agent starts processing.</p>
                <Link href="/employee/tickets/t-00129">
                  <Button variant="secondary" size="sm" className="w-full mt-1">
                    View NEW Ticket
                  </Button>
                </Link>
              </div>

              <div className="p-3 rounded-lg border border-border bg-bg-subtle/50 space-y-2">
                <p className="text-caption font-semibold text-text-primary">Step 4: Close / Reopen</p>
                <p className="text-[12px] text-text-muted">Verify solution, Confirm & Close or Reopen.</p>
                <Link href="/employee/tickets/t-00126">
                  <Button variant="secondary" size="sm" className="w-full mt-1">
                    Resolved Ticket
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* FLOW 2: SUPPORT AGENT */}
          <div className="bg-bg-surface border border-border rounded-xl p-5 shadow-subtle space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-800 text-[12px] font-bold flex items-center justify-center">
                  2
                </span>
                <h4 className="text-heading-3 text-text-primary font-bold">
                  Flow 2 — Support Agent Operations
                </h4>
              </div>
              <Badge variant="warning">Maya Chen (SUPPORT_AGENT)</Badge>
            </div>

            <p className="text-caption text-text-secondary">
              Login → Support Queue → Take Ticket (keeps NEW) → Start Processing → Public Question / Internal Note → Resolve Ticket.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
              <div className="p-3 rounded-lg border border-border bg-bg-subtle/50 space-y-2">
                <p className="text-caption font-semibold text-text-primary">Step 1: Queue Triage</p>
                <p className="text-[12px] text-text-muted">Tabs: All, Unassigned, Assigned to Me, Overdue shortcut.</p>
                <Link href="/agent/queue">
                  <Button variant="secondary" size="sm" className="w-full mt-1">
                    Open Support Queue
                  </Button>
                </Link>
              </div>

              <div className="p-3 rounded-lg border border-border bg-bg-subtle/50 space-y-2">
                <p className="text-caption font-semibold text-text-primary">Step 2: Take & Start</p>
                <p className="text-[12px] text-text-muted">Take keeps status NEW. Start Processing moves to IN_PROGRESS.</p>
                <Link href="/agent/tickets/t-00128">
                  <Button variant="secondary" size="sm" className="w-full mt-1">
                    Unassigned Ticket
                  </Button>
                </Link>
              </div>

              <div className="p-3 rounded-lg border border-border bg-bg-subtle/50 space-y-2">
                <p className="text-caption font-semibold text-text-primary">Step 3: Resolve Ticket</p>
                <p className="text-[12px] text-text-muted">Internal note toggle, solution modal, stops resolution SLA.</p>
                <Link href="/agent/tickets/t-00124">
                  <Button variant="secondary" size="sm" className="w-full mt-1">
                    In Progress Ticket
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* FLOW 3: ADMINISTRATOR */}
          <div className="bg-bg-surface border border-border rounded-xl p-5 shadow-subtle space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-900 text-[12px] font-bold flex items-center justify-center">
                  3
                </span>
                <h4 className="text-heading-3 text-text-primary font-bold">
                  Flow 3 — Administrator Operations & Governance
                </h4>
              </div>
              <Badge variant="default">Sarah Lee (ADMINISTRATOR)</Badge>
            </div>

            <p className="text-caption text-text-secondary">
              Login → Operational Dashboard → Ticket Coordination (Reassign) → User Guard Checks → Request Types.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
              <div className="p-3 rounded-lg border border-border bg-bg-subtle/50 space-y-2">
                <p className="text-caption font-semibold text-text-primary">Step 1: Dashboard</p>
                <p className="text-[12px] text-text-muted">30-day Avg Resolution Time, Workload by Agent.</p>
                <Link href="/admin/dashboard">
                  <Button variant="secondary" size="sm" className="w-full mt-1">
                    Open Dashboard
                  </Button>
                </Link>
              </div>

              <div className="p-3 rounded-lg border border-border bg-bg-subtle/50 space-y-2">
                <p className="text-caption font-semibold text-text-primary">Step 2: Ticket Directory</p>
                <p className="text-[12px] text-text-muted">Assign and Reassign with mandatory reason.</p>
                <Link href="/admin/tickets">
                  <Button variant="secondary" size="sm" className="w-full mt-1">
                    Ticket Directory
                  </Button>
                </Link>
              </div>

              <div className="p-3 rounded-lg border border-border bg-bg-subtle/50 space-y-2">
                <p className="text-caption font-semibold text-text-primary">Step 3: User Directory</p>
                <p className="text-[12px] text-text-muted">Guards: protect last admin & active agents.</p>
                <Link href="/admin/users">
                  <Button variant="secondary" size="sm" className="w-full mt-1">
                    User Management
                  </Button>
                </Link>
              </div>

              <div className="p-3 rounded-lg border border-border bg-bg-subtle/50 space-y-2">
                <p className="text-caption font-semibold text-text-primary">Step 4: Request Types</p>
                <p className="text-[12px] text-text-muted">Add, edit, and toggle active status.</p>
                <Link href="/admin/request-types">
                  <Button variant="secondary" size="sm" className="w-full mt-1">
                    Request Types
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODALS */}
      <PriorityMatrixHelp isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />

      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={() => {
          setIsConfirmOpen(false);
          dispatch({
            type: 'SHOW_TOAST',
            payload: {
              type: 'info',
              title: 'Confirmed',
              message: 'Dialog action confirmed.',
            },
          });
        }}
        title="Confirm Cancellation"
        message="Are you sure you want to cancel this operation? This action will be recorded in the audit history."
        variant="danger"
        confirmLabel="Yes, Proceed"
      />

      {/* Semantic Action Modals */}
      <AssignTicketModal
        isOpen={isAssignOpen}
        onClose={() => setIsAssignOpen(false)}
        ticketCode="IT-2026-00128"
        activeAgents={activeAgents}
        onSubmit={(agentId) => {
          const agent = activeAgents.find((a) => a.id === agentId);
          dispatch({
            type: 'SHOW_TOAST',
            payload: {
              type: 'success',
              title: 'Ticket Assigned',
              message: `IT-2026-00128 assigned to ${agent?.name || 'Agent'}.`,
            },
          });
        }}
      />

      <ReassignModal
        isOpen={isReassignOpen}
        onClose={() => setIsReassignOpen(false)}
        ticketCode="IT-2026-00124"
        activeAgents={activeAgents}
        currentAssigneeId="user-agt-01"
        onSubmit={(agentId, reason) => {
          const agent = activeAgents.find((a) => a.id === agentId);
          dispatch({
            type: 'SHOW_TOAST',
            payload: {
              type: 'success',
              title: 'Ticket Reassigned',
              message: `IT-2026-00124 reassigned to ${agent?.name || 'Agent'} with reason recorded.`,
            },
          });
        }}
      />

      <UpdateImpactUrgencyModal
        isOpen={isImpactUrgencyOpen}
        onClose={() => setIsImpactUrgencyOpen(false)}
        ticketCode="IT-2026-00124"
        initialImpact="HIGH"
        initialUrgency="MEDIUM"
        onSubmit={(impact, urgency, reason) => {
          dispatch({
            type: 'SHOW_TOAST',
            payload: {
              type: 'success',
              title: 'Severity Updated',
              message: `Factors updated: Impact ${impact}, Urgency ${urgency} with reason: "${reason}".`,
            },
          });
        }}
      />

      <WaitingQuestionModal
        isOpen={isWaitOpen}
        onClose={() => setIsWaitOpen(false)}
        ticketCode="IT-2026-00124"
        onSubmit={(question) => {
          dispatch({
            type: 'SHOW_TOAST',
            payload: {
              type: 'info',
              title: 'Waiting for Employee',
              message: `Inquiry sent: "${question}". Resolution SLA paused.`,
            },
          });
        }}
      />

      <ResolveSolutionModal
        isOpen={isResolveOpen}
        onClose={() => setIsResolveOpen(false)}
        ticketCode="IT-2026-00124"
        onSubmit={(solution) => {
          dispatch({
            type: 'SHOW_TOAST',
            payload: {
              type: 'success',
              title: 'Ticket Resolved',
              message: `Public solution recorded: "${solution}".`,
            },
          });
        }}
      />

      <CancelTicketModal
        isOpen={isCancelOpen}
        onClose={() => setIsCancelOpen(false)}
        ticketCode="IT-2026-00129"
        onSubmit={(reason) => {
          dispatch({
            type: 'SHOW_TOAST',
            payload: {
              type: 'info',
              title: 'Ticket Cancelled',
              message: `Cancellation reason recorded: "${reason}".`,
            },
          });
        }}
      />

      <ConfirmCloseModal
        isOpen={isConfirmCloseOpen}
        onClose={() => setIsConfirmCloseOpen(false)}
        ticketCode="IT-2026-00126"
        onConfirm={() => {
          dispatch({
            type: 'SHOW_TOAST',
            payload: {
              type: 'success',
              title: 'Ticket Closed',
              message: 'IT-2026-00126 confirmed and closed by employee.',
            },
          });
        }}
      />

      <AdminCloseModal
        isOpen={isAdminCloseOpen}
        onClose={() => setIsAdminCloseOpen(false)}
        ticketCode="IT-2026-00126"
        onSubmit={(reason) => {
          dispatch({
            type: 'SHOW_TOAST',
            payload: {
              type: 'success',
              title: 'Admin Closed',
              message: `Ticket closed by Administrator with reason: "${reason}".`,
            },
          });
        }}
      />

      <ReopenTicketModal
        isOpen={isReopenOpen}
        onClose={() => setIsReopenOpen(false)}
        ticketCode="IT-2026-00126"
        onSubmit={(reason) => {
          dispatch({
            type: 'SHOW_TOAST',
            payload: {
              type: 'warning',
              title: 'Ticket Reopened',
              message: `Ticket returned to IN_PROGRESS. Reason: "${reason}". Resolution SLA resumed.`,
            },
          });
        }}
      />
    </AppShell>
  );
}
