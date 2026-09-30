'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Plus, Search, Filter, X } from 'lucide-react';
import { usePrototype } from '@/prototype/PrototypeProvider';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { DataTable, Column } from '@/components/tickets/DataTable';
import { StatusBadge } from '@/components/tickets/StatusBadge';
import { PriorityBadge } from '@/components/tickets/PriorityBadge';
import { Ticket, TicketStatus } from '@/mocks/tickets';
import { PriorityLevel } from '@/lib/priority';
import { formatDateTime } from '@/lib/utils';

export default function EmployeeTicketsPage() {
  const router = useRouter();
  const { state, activeUser } = usePrototype();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  const [requestTypeFilter, setRequestTypeFilter] = useState<string>('ALL');

  // Employee only sees tickets created by themselves
  const myTickets = useMemo(() => {
    return state.tickets.filter((t) => t.creatorId === activeUser.id);
  }, [state.tickets, activeUser.id]);

  // Apply filters
  const filteredTickets = useMemo(() => {
    return myTickets.filter((t) => {
      // Search: exact code or partial title (case-insensitive)
      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        const matchesCode = t.ticketCode.toLowerCase().includes(q);
        const matchesTitle = t.title.toLowerCase().includes(q);
        if (!matchesCode && !matchesTitle) return false;
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

      return true;
    });
  }, [myTickets, searchQuery, statusFilter, priorityFilter, requestTypeFilter]);

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    statusFilter !== 'ALL' ||
    priorityFilter !== 'ALL' ||
    requestTypeFilter !== 'ALL';

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('ALL');
    setPriorityFilter('ALL');
    setRequestTypeFilter('ALL');
  };

  const columns: Column<Ticket>[] = [
    {
      key: 'ticketCode',
      header: 'Ticket Code',
      width: '140px',
      sortable: true,
      render: (t) => (
        <span className="font-semibold text-primary hover:underline font-mono text-[13px]">
          {t.ticketCode}
        </span>
      ),
    },
    {
      key: 'title',
      header: 'Title & Summary',
      sortable: true,
      render: (t) => (
        <div className="space-y-0.5">
          <p className="font-medium text-text-primary hover:text-primary transition-colors line-clamp-1">
            {t.title}
          </p>
          <p className="text-[12px] text-text-muted line-clamp-1">{t.description}</p>
        </div>
      ),
    },
    {
      key: 'requestTypeName',
      header: 'Request Type',
      width: '160px',
      render: (t) => <span className="text-caption text-text-secondary">{t.requestTypeName}</span>,
    },
    {
      key: 'priority',
      header: 'Priority',
      width: '90px',
      sortable: true,
      render: (t) => <PriorityBadge priority={t.priority} size="sm" />,
    },
    {
      key: 'status',
      header: 'Status',
      width: '170px',
      sortable: true,
      render: (t) => <StatusBadge status={t.status} size="sm" />,
    },
    {
      key: 'assigneeName',
      header: 'Assignee',
      width: '140px',
      render: (t) =>
        t.assigneeName ? (
          <span className="text-caption font-medium text-text-primary">{t.assigneeName}</span>
        ) : (
          <span className="text-caption text-text-muted italic">Unassigned</span>
        ),
    },
    {
      key: 'updatedAt',
      header: 'Updated',
      width: '130px',
      sortable: true,
      render: (t) => (
        <span className="text-caption text-text-muted">{formatDateTime(t.updatedAt)}</span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Tickets"
        description="Track your IT support requests and updates."
        breadcrumbs={[
          { label: 'OpsFlow', href: '/' },
          { label: 'My Tickets' },
        ]}
        actions={
          <Link href="/employee/tickets/new">
            <Button variant="primary" size="md" leftIcon={<Plus className="w-4 h-4" />}>
              Create Ticket
            </Button>
          </Link>
        }
      />

      {/* Filter & Search Bar */}
      <div className="bg-bg-surface border border-border rounded-lg p-3 shadow-subtle flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search Box */}
        <div className="w-full md:w-80">
          <Input
            placeholder="Search code or title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>

        {/* Dropdown Filters */}
        <div className="flex items-center gap-2 flex-wrap flex-1 justify-end">
          {/* Status Filter */}
          <div className="w-36">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full h-9 px-2.5 rounded-md bg-bg-surface border border-border text-caption text-text-primary focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              <option value="NEW">New</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="WAITING_FOR_EMPLOYEE">Waiting</option>
              <option value="RESOLVED">Resolved</option>
              <option value="CLOSED">Closed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>

          {/* Priority Filter */}
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

          {/* Request Type Filter */}
          <div className="w-44">
            <select
              value={requestTypeFilter}
              onChange={(e) => setRequestTypeFilter(e.target.value)}
              className="w-full h-9 px-2.5 rounded-md bg-bg-surface border border-border text-caption text-text-primary focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer truncate"
            >
              <option value="ALL">All Request Types</option>
              {state.requestTypes.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
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

      {/* Tickets Operational Table */}
      <DataTable
        columns={columns}
        data={filteredTickets}
        defaultPageSize={20}
        initialSortKey="updatedAt"
        initialSortDirection="desc"
        onRowClick={(ticket) => router.push(`/employee/tickets/${ticket.id}`)}
        emptyTitle={hasActiveFilters ? 'No tickets match your filters' : 'No tickets yet'}
        emptyDescription={
          hasActiveFilters
            ? 'Try adjusting your search keywords or clearing status and priority filters.'
            : 'When you need IT support, create a ticket and track its progress here.'
        }
        emptyActionLabel={hasActiveFilters ? 'Clear filters' : 'Create Ticket'}
        onEmptyAction={hasActiveFilters ? clearFilters : () => router.push('/employee/tickets/new')}
      />
    </div>
  );
}
