'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Inbox,
  Search,
  UserCheck,
  UserPlus,
  RefreshCw,
  X,
  Layers,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { usePrototype } from '@/prototype/PrototypeProvider';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DataTable, Column } from '@/components/tickets/DataTable';
import { StatusBadge } from '@/components/tickets/StatusBadge';
import { PriorityBadge } from '@/components/tickets/PriorityBadge';
import { SlaIndicator } from '@/components/tickets/SlaIndicator';
import { ReassignModal } from '@/components/tickets/ActionModals';
import { Dialog } from '@/components/ui/dialog';
import { Select } from '@/components/ui/select';
import { getFirstResponseSlaDisplay, getResolutionSlaDisplay } from '@/lib/sla';
import { Ticket } from '@/mocks/tickets';
import { formatDateTime } from '@/lib/utils';

export default function AdminTicketsPage() {
  const router = useRouter();
  const { state, dispatch, activeUser, selectors } = usePrototype();

  // Search & Multi-filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [requestTypeFilter, setRequestTypeFilter] = useState('ALL');
  const [assigneeFilter, setAssigneeFilter] = useState('ALL');
  const [creatorFilter, setCreatorFilter] = useState('ALL');
  const [slaFilter, setSlaFilter] = useState('ALL');

  // Modals for Coordination
  const [selectedTicketForAssign, setSelectedTicketForAssign] = useState<Ticket | null>(null);
  const [selectedTicketForReassign, setSelectedTicketForReassign] = useState<Ticket | null>(null);
  const [assignModalAgentId, setAssignModalAgentId] = useState('');

  const activeAgents = selectors.getActiveAgents(state);

  const filteredTickets = useMemo(() => {
    return state.tickets.filter((t) => {
      // Search: code, title, creator, or assignee
      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        const matchesCode = t.ticketCode.toLowerCase().includes(q);
        const matchesTitle = t.title.toLowerCase().includes(q);
        const matchesRequester = t.creatorName.toLowerCase().includes(q);
        const matchesAssignee = (t.assigneeName || '').toLowerCase().includes(q);
        if (!matchesCode && !matchesTitle && !matchesRequester && !matchesAssignee) return false;
      }

      // Status
      if (statusFilter !== 'ALL' && t.status !== statusFilter) return false;

      // Priority
      if (priorityFilter !== 'ALL' && t.priority !== priorityFilter) return false;

      // Request Type
      if (requestTypeFilter !== 'ALL' && t.requestTypeId !== requestTypeFilter) return false;

      // Assignee
      if (assigneeFilter === 'UNASSIGNED' && t.assigneeId !== null) {
        return false;
      } else if (assigneeFilter !== 'ALL' && assigneeFilter !== 'UNASSIGNED' && t.assigneeId !== assigneeFilter) {
        return false;
      }

      // Creator (Employee)
      if (creatorFilter !== 'ALL' && t.creatorId !== creatorFilter) return false;

      // SLA
      if (slaFilter === 'OVERDUE' && t.sla.resolutionState !== 'OVERDUE') return false;
      if (slaFilter === 'DUE_SOON' && t.sla.resolutionState !== 'DUE_SOON') return false;

      return true;
    });
  }, [state.tickets, searchQuery, statusFilter, priorityFilter, requestTypeFilter, assigneeFilter, creatorFilter, slaFilter]);

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    statusFilter !== 'ALL' ||
    priorityFilter !== 'ALL' ||
    requestTypeFilter !== 'ALL' ||
    assigneeFilter !== 'ALL' ||
    creatorFilter !== 'ALL' ||
    slaFilter !== 'ALL';

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('ALL');
    setPriorityFilter('ALL');
    setRequestTypeFilter('ALL');
    setAssigneeFilter('ALL');
    setCreatorFilter('ALL');
    setSlaFilter('ALL');
  };

  const handleConfirmAssign = () => {
    if (!selectedTicketForAssign || !assignModalAgentId) return;

    dispatch({
      type: 'ASSIGN_TICKET',
      payload: {
        ticketId: selectedTicketForAssign.id,
        agentId: assignModalAgentId,
        adminId: activeUser.id,
      },
    });

    setSelectedTicketForAssign(null);
    setAssignModalAgentId('');
  };

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
      header: 'Title & Summary',
      sortable: true,
      render: (t) => (
        <div className="space-y-0.5 max-w-sm">
          <p className="font-medium text-text-primary hover:text-primary transition-colors truncate">
            {t.title}
          </p>
          <p className="text-[12px] text-text-muted truncate">
            Requester: {t.creatorName} · {t.creatorDepartment}
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
      width: '150px',
      render: (t) =>
        t.assigneeName ? (
          <span className="text-caption font-medium text-text-primary">{t.assigneeName}</span>
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
      key: 'coordination',
      header: 'Action',
      width: '120px',
      align: 'right',
      render: (t) => {
        if (t.status === 'CLOSED' || t.status === 'CANCELLED') {
          return <span className="text-[12px] text-text-muted">Closed</span>;
        }

        if (t.assigneeId === null) {
          return (
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<UserPlus className="w-3 h-3 text-primary" />}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedTicketForAssign(t);
                setAssignModalAgentId(activeAgents[0]?.id || '');
              }}
            >
              Assign
            </Button>
          );
        }

        return (
          <Button
            variant="tertiary"
            size="sm"
            leftIcon={<RefreshCw className="w-3 h-3 text-text-muted" />}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedTicketForReassign(t);
            }}
          >
            Reassign
          </Button>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Ticket Directory"
        description="Global administrator ticket operations, triage, and assignment management."
        breadcrumbs={[
          { label: 'OpsFlow', href: '/' },
          { label: 'Administrator', href: '/admin/dashboard' },
          { label: 'Ticket Directory' },
        ]}
      />

      {/* Filter Bar */}
      <div className="bg-bg-surface border border-border rounded-lg p-3 shadow-subtle space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="w-full md:w-80">
            <Input
              placeholder="Search code, title, requester or agent..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap flex-1 justify-end">
            {/* Status */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-9 px-2.5 rounded-md bg-bg-surface border border-border text-caption text-text-primary focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer w-36"
            >
              <option value="ALL">All Statuses</option>
              <option value="NEW">New</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="WAITING_FOR_EMPLOYEE">Waiting for Employee</option>
              <option value="RESOLVED">Resolved</option>
              <option value="CLOSED">Closed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>

            {/* Priority */}
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="h-9 px-2.5 rounded-md bg-bg-surface border border-border text-caption text-text-primary focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer w-32"
            >
              <option value="ALL">All Priorities</option>
              <option value="P1">P1 - Critical</option>
              <option value="P2">P2 - High</option>
              <option value="P3">P3 - Medium</option>
              <option value="P4">P4 - Low</option>
            </select>

            {/* Request Type */}
            <select
              value={requestTypeFilter}
              onChange={(e) => setRequestTypeFilter(e.target.value)}
              className="h-9 px-2.5 rounded-md bg-bg-surface border border-border text-caption text-text-primary focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer w-40 truncate"
            >
              <option value="ALL">All Categories</option>
              {state.requestTypes.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>

            {/* Assignee */}
            <select
              value={assigneeFilter}
              onChange={(e) => setAssigneeFilter(e.target.value)}
              className="h-9 px-2.5 rounded-md bg-bg-surface border border-border text-caption text-text-primary focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer w-36 truncate"
            >
              <option value="ALL">All Assignees</option>
              <option value="UNASSIGNED">Unassigned Only</option>
              {activeAgents.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>

            {/* Creator Filter */}
            <select
              value={creatorFilter}
              onChange={(e) => setCreatorFilter(e.target.value)}
              className="h-9 px-2.5 rounded-md bg-bg-surface border border-border text-caption text-text-primary focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer w-36 truncate"
            >
              <option value="ALL">All Requesters</option>
              {state.users
                .filter((u) => u.role === 'EMPLOYEE')
                .map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
            </select>

            {/* SLA Filter */}
            <select
              value={slaFilter}
              onChange={(e) => setSlaFilter(e.target.value)}
              className="h-9 px-2.5 rounded-md bg-bg-surface border border-border text-caption text-text-primary focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer w-32"
            >
              <option value="ALL">All SLA</option>
              <option value="OVERDUE">Overdue Only</option>
              <option value="DUE_SOON">Due Soon Only</option>
            </select>

            {hasActiveFilters && (
              <Button
                variant="tertiary"
                size="sm"
                leftIcon={<X className="w-3.5 h-3.5" />}
                onClick={clearFilters}
              >
                Clear
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Global DataTable */}
      <DataTable
        columns={columns}
        data={filteredTickets}
        defaultPageSize={20}
        initialSortKey="updatedAt"
        initialSortDirection="desc"
        onRowClick={(ticket) => router.push(`/admin/tickets/${ticket.id}`)}
        emptyTitle={hasActiveFilters ? 'No tickets found' : 'No tickets in system'}
        emptyDescription={
          hasActiveFilters
            ? 'Try widening your filter parameters.'
            : 'There are no support tickets logged in the system.'
        }
        emptyActionLabel={hasActiveFilters ? 'Clear filters' : undefined}
        onEmptyAction={hasActiveFilters ? clearFilters : undefined}
      />

      {/* ADMIN ASSIGN MODAL (Unassigned Ticket) */}
      {selectedTicketForAssign && (
        <Dialog
          isOpen={!!selectedTicketForAssign}
          onClose={() => setSelectedTicketForAssign(null)}
          title="Assign Ticket to Support Agent"
          description={`Assign ${selectedTicketForAssign.ticketCode} to an active support agent.`}
          footer={
            <>
              <Button variant="secondary" size="sm" onClick={() => setSelectedTicketForAssign(null)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleConfirmAssign}>
                Assign Agent
              </Button>
            </>
          }
        >
          <div className="space-y-4">
            <Select
              label="Select Active Support Agent *"
              value={assignModalAgentId}
              onChange={(e) => setAssignModalAgentId(e.target.value)}
              options={activeAgents.map((a) => ({
                value: a.id,
                label: `${a.name} (${a.department})`,
              }))}
            />
            <p className="text-caption text-text-muted">
              Note: Assignment coordinates responsibility and keeps the ticket status in NEW. It does not start processing.
            </p>
          </div>
        </Dialog>
      )}

      {/* ADMIN REASSIGN MODAL */}
      {selectedTicketForReassign && (
        <ReassignModal
          isOpen={!!selectedTicketForReassign}
          onClose={() => setSelectedTicketForReassign(null)}
          ticketCode={selectedTicketForReassign.ticketCode}
          activeAgents={activeAgents}
          currentAssigneeId={selectedTicketForReassign.assigneeId}
          onSubmit={(newAgentId, reason) => {
            dispatch({
              type: 'REASSIGN_TICKET',
              payload: {
                ticketId: selectedTicketForReassign.id,
                newAgentId,
                adminId: activeUser.id,
                reason,
              },
            });
            setSelectedTicketForReassign(null);
          }}
        />
      )}
    </div>
  );
}
