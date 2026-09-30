'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  LifeBuoy,
  Search,
  CheckCircle,
  Clock,
  AlertTriangle,
  UserCheck,
  X,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { usePrototype } from '@/prototype/PrototypeProvider';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DataTable, Column } from '@/components/tickets/DataTable';
import { StatusBadge } from '@/components/tickets/StatusBadge';
import { PriorityBadge } from '@/components/tickets/PriorityBadge';
import { SlaIndicator } from '@/components/tickets/SlaIndicator';
import { getFirstResponseSlaDisplay, getResolutionSlaDisplay } from '@/lib/sla';
import { Ticket, TicketStatus } from '@/mocks/tickets';
import { formatDateTime } from '@/lib/utils';

export default function AgentQueuePage() {
  const router = useRouter();
  const { state, dispatch, activeUser, selectors } = usePrototype();

  // Tab: 'all' | 'unassigned' | 'assigned_to_me' | 'overdue'
  const [activeTab, setActiveTab] = useState<'all' | 'unassigned' | 'assigned_to_me' | 'overdue'>('all');

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [requestTypeFilter, setRequestTypeFilter] = useState('ALL');
  const [assigneeFilter, setAssigneeFilter] = useState('ALL');
  const [slaFilter, setSlaFilter] = useState('ALL');

  // Base tickets from active tab
  const tabTickets = useMemo(() => {
    return selectors.getQueueTickets(state, activeTab, activeUser.id);
  }, [state, activeTab, activeUser.id, selectors]);

  // Apply filters
  const filteredTickets = useMemo(() => {
    return tabTickets.filter((t) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        const matchesCode = t.ticketCode.toLowerCase().includes(q);
        const matchesTitle = t.title.toLowerCase().includes(q);
        const matchesRequester = t.creatorName.toLowerCase().includes(q);
        if (!matchesCode && !matchesTitle && !matchesRequester) return false;
      }

      // Status
      if (statusFilter !== 'ALL' && t.status !== statusFilter) {
        return false;
      }

      // Priority
      if (priorityFilter !== 'ALL' && t.priority !== priorityFilter) {
        return false;
      }

      // Request Type
      if (requestTypeFilter !== 'ALL' && t.requestTypeId !== requestTypeFilter) {
        return false;
      }

      // Assignee
      if (assigneeFilter === 'UNASSIGNED' && t.assigneeId !== null) {
        return false;
      } else if (assigneeFilter !== 'ALL' && assigneeFilter !== 'UNASSIGNED' && t.assigneeId !== assigneeFilter) {
        return false;
      }

      // SLA filter
      if (slaFilter === 'OVERDUE' && t.sla.resolutionState !== 'OVERDUE' && t.sla.firstResponseState !== 'OVERDUE') {
        return false;
      } else if (slaFilter === 'DUE_SOON' && t.sla.resolutionState !== 'DUE_SOON' && t.sla.firstResponseState !== 'DUE_SOON') {
        return false;
      }

      return true;
    });
  }, [tabTickets, searchQuery, statusFilter, priorityFilter, requestTypeFilter, assigneeFilter, slaFilter]);

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    statusFilter !== 'ALL' ||
    priorityFilter !== 'ALL' ||
    requestTypeFilter !== 'ALL' ||
    assigneeFilter !== 'ALL' ||
    slaFilter !== 'ALL';

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('ALL');
    setPriorityFilter('ALL');
    setRequestTypeFilter('ALL');
    setAssigneeFilter('ALL');
    setSlaFilter('ALL');
  };

  const handleTakeTicket = (e: React.MouseEvent, ticket: Ticket) => {
    e.stopPropagation();

    // Verify invariant: status must be NEW and assignee must be null
    if (ticket.status !== 'NEW' || ticket.assigneeId !== null) {
      dispatch({
        type: 'SIMULATE_CONFLICT',
        payload: {
          scenario: 'TAKE_COLLISION',
          ticketId: ticket.id,
        },
      });
      return;
    }

    dispatch({
      type: 'TAKE_TICKET',
      payload: {
        ticketId: ticket.id,
        agentId: activeUser.id,
      },
    });
  };

  // Tab counts
  const allCount = state.tickets.length;
  const unassignedCount = state.tickets.filter((t) => t.assigneeId === null && t.status !== 'CLOSED' && t.status !== 'CANCELLED').length;
  const assignedToMeCount = state.tickets.filter((t) => t.assigneeId === activeUser.id).length;
  const overdueCount = state.tickets.filter(
    (t) => t.sla.resolutionState === 'OVERDUE' && (t.status === 'NEW' || t.status === 'IN_PROGRESS')
  ).length;

  const columns: Column<Ticket>[] = [
    {
      key: 'ticketCode',
      header: 'Ticket Code',
      width: '135px',
      sortable: true,
      render: (t) => (
        <span className="font-semibold text-primary font-mono text-[13px] hover:underline">
          {t.ticketCode}
        </span>
      ),
    },
    {
      key: 'title',
      header: 'Summary',
      sortable: true,
      render: (t) => (
        <div className="space-y-0.5 max-w-md">
          <p className="font-medium text-text-primary hover:text-primary transition-colors truncate">
            {t.title}
          </p>
          <p className="text-[12px] text-text-muted truncate">
            From: <span className="font-medium text-text-secondary">{t.creatorName}</span> · {t.creatorDepartment}
          </p>
        </div>
      ),
    },
    {
      key: 'requestTypeName',
      header: 'Category',
      width: '150px',
      render: (t) => <span className="text-caption text-text-secondary truncate">{t.requestTypeName}</span>,
    },
    {
      key: 'priority',
      header: 'Priority',
      width: '85px',
      sortable: true,
      render: (t) => <PriorityBadge priority={t.priority} size="sm" />,
    },
    {
      key: 'status',
      header: 'Status',
      width: '160px',
      sortable: true,
      render: (t) => <StatusBadge status={t.status} size="sm" />,
    },
    {
      key: 'assigneeName',
      header: 'Assignee',
      width: '140px',
      render: (t) =>
        t.assigneeName ? (
          <span className="text-caption font-medium text-text-primary">
            {t.assigneeId === activeUser.id ? (
              <span className="text-blue-700 font-semibold">You ({t.assigneeName})</span>
            ) : (
              t.assigneeName
            )}
          </span>
        ) : (
          <span className="text-caption text-amber-700 font-medium bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
            Unassigned
          </span>
        ),
    },
    {
      key: 'firstResponseSla',
      header: 'Response SLA',
      width: '150px',
      render: (t) => {
        const info = getFirstResponseSlaDisplay(t.sla);
        return <SlaIndicator info={info} size="sm" />;
      },
    },
    {
      key: 'resolutionSla',
      header: 'Resolution SLA',
      width: '160px',
      render: (t) => {
        const info = getResolutionSlaDisplay(t.sla, t.status);
        return <SlaIndicator info={info} size="sm" />;
      },
    },
    {
      key: 'actions',
      header: 'Action',
      width: '120px',
      align: 'right',
      render: (t) => {
        // QUICK ACTION: Only when Status = NEW and Assignee = Unassigned
        if (t.status === 'NEW' && t.assigneeId === null) {
          return (
            <Button
              variant="secondary"
              size="sm"
              onClick={(e) => handleTakeTicket(e, t)}
              className="text-primary hover:text-primary-hover font-semibold"
            >
              Take Ticket
            </Button>
          );
        }
        return (
          <span className="text-[12px] text-text-muted hover:text-primary inline-flex items-center gap-0.5">
            View <ArrowRight className="w-3 h-3" />
          </span>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Support Queue"
        description="Review, take and process IT support requests."
        breadcrumbs={[
          { label: 'OpsFlow', href: '/' },
          { label: 'Support Queue' },
        ]}
      />

      {/* Navigational View Tabs */}
      <div className="flex items-center gap-2 border-b border-border select-none">
        <button
          onClick={() => setActiveTab('all')}
          className={`py-2.5 px-4 text-body font-medium transition-colors border-b-2 -mb-[2px] flex items-center gap-2 ${
            activeTab === 'all'
              ? 'border-primary text-primary font-semibold'
              : 'border-transparent text-text-secondary hover:text-text-primary'
          }`}
        >
          <span>All Tickets</span>
          <span className="px-1.5 py-0.2 rounded-full text-caption bg-bg-subtle text-text-secondary font-mono">
            {allCount}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('unassigned')}
          className={`py-2.5 px-4 text-body font-medium transition-colors border-b-2 -mb-[2px] flex items-center gap-2 ${
            activeTab === 'unassigned'
              ? 'border-primary text-primary font-semibold'
              : 'border-transparent text-text-secondary hover:text-text-primary'
          }`}
        >
          <span>Unassigned</span>
          <span className="px-1.5 py-0.2 rounded-full text-caption bg-amber-100 text-amber-800 font-mono font-semibold">
            {unassignedCount}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('assigned_to_me')}
          className={`py-2.5 px-4 text-body font-medium transition-colors border-b-2 -mb-[2px] flex items-center gap-2 ${
            activeTab === 'assigned_to_me'
              ? 'border-primary text-primary font-semibold'
              : 'border-transparent text-text-secondary hover:text-text-primary'
          }`}
        >
          <span>Assigned to Me</span>
          <span className="px-1.5 py-0.2 rounded-full text-caption bg-blue-100 text-blue-800 font-mono font-semibold">
            {assignedToMeCount}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('overdue')}
          className={`py-2.5 px-4 text-body font-medium transition-colors border-b-2 -mb-[2px] flex items-center gap-2 ${
            activeTab === 'overdue'
              ? 'border-red-600 text-red-600 font-semibold'
              : 'border-transparent text-text-secondary hover:text-red-600'
          }`}
          title="Predefined filter shortcut: Resolution SLA overdue"
        >
          <AlertTriangle className="w-4 h-4 text-red-600" />
          <span>Overdue SLA</span>
          <span className="px-1.5 py-0.2 rounded-full text-caption bg-red-100 text-red-800 font-mono font-semibold">
            {overdueCount}
          </span>
        </button>
      </div>

      {/* Filter Area */}
      <div className="bg-bg-surface border border-border rounded-lg p-3 shadow-subtle flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search */}
        <div className="w-full md:w-80">
          <Input
            placeholder="Search code, title or requester..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>

        {/* Compact Filter Bar */}
        <div className="flex items-center gap-2 flex-wrap flex-1 justify-end">
          {/* Status */}
          <div className="w-36">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full h-9 px-2.5 rounded-md bg-bg-surface border border-border text-caption text-text-primary focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              <option value="NEW">New</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="WAITING_FOR_EMPLOYEE">Waiting for Employee</option>
              <option value="RESOLVED">Resolved</option>
              <option value="CLOSED">Closed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>

          {/* Priority */}
          <div className="w-32">
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full h-9 px-2.5 rounded-md bg-bg-surface border border-border text-caption text-text-primary focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
            >
              <option value="ALL">All Priorities</option>
              <option value="P1">P1 - Critical</option>
              <option value="P2">P2 - High</option>
              <option value="P3">P3 - Medium</option>
              <option value="P4">P4 - Low</option>
            </select>
          </div>

          {/* Request Type */}
          <div className="w-40">
            <select
              value={requestTypeFilter}
              onChange={(e) => setRequestTypeFilter(e.target.value)}
              className="w-full h-9 px-2.5 rounded-md bg-bg-surface border border-border text-caption text-text-primary focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer truncate"
            >
              <option value="ALL">All Categories</option>
              {state.requestTypes.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>

          {/* Assignee */}
          <div className="w-36">
            <select
              value={assigneeFilter}
              onChange={(e) => setAssigneeFilter(e.target.value)}
              className="w-full h-9 px-2.5 rounded-md bg-bg-surface border border-border text-caption text-text-primary focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer truncate"
            >
              <option value="ALL">All Assignees</option>
              <option value="UNASSIGNED">Unassigned Only</option>
              {state.users
                .filter((u) => u.role === 'SUPPORT_AGENT')
                .map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
            </select>
          </div>

          {/* SLA Filter */}
          <div className="w-32">
            <select
              value={slaFilter}
              onChange={(e) => setSlaFilter(e.target.value)}
              className="w-full h-9 px-2.5 rounded-md bg-bg-surface border border-border text-caption text-text-primary focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
            >
              <option value="ALL">All SLA States</option>
              <option value="OVERDUE">Overdue Only</option>
              <option value="DUE_SOON">Due Soon Only</option>
            </select>
          </div>

          {hasActiveFilters && (
            <Button
              variant="tertiary"
              size="sm"
              leftIcon={<X className="w-3.5 h-3.5" />}
              onClick={clearFilters}
              title="Reset all filters"
            >
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Support Queue DataTable */}
      <DataTable
        columns={columns}
        data={filteredTickets}
        defaultPageSize={20}
        initialSortKey="updatedAt"
        initialSortDirection="desc"
        onRowClick={(ticket) => router.push(`/agent/tickets/${ticket.id}`)}
        emptyTitle={hasActiveFilters ? 'No tickets match filter criteria' : 'Queue is empty'}
        emptyDescription={
          hasActiveFilters
            ? 'Adjust or clear your search and filter parameters.'
            : 'There are no active tickets in this queue view.'
        }
        emptyActionLabel={hasActiveFilters ? 'Clear filters' : undefined}
        onEmptyAction={hasActiveFilters ? clearFilters : undefined}
      />
    </div>
  );
}
