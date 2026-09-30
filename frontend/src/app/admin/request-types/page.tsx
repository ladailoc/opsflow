'use client';

import React, { useState, useMemo } from 'react';
import {
  Layers,
  Search,
  Plus,
  Edit2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Power,
  PowerOff,
  FileText,
} from 'lucide-react';
import { usePrototype } from '@/prototype/PrototypeProvider';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { DataTable, Column } from '@/components/tickets/DataTable';
import { Dialog } from '@/components/ui/dialog';
import { RequestType } from '@/mocks/request-types';

export default function AdminRequestTypesPage() {
  const { state, dispatch } = usePrototype();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingType, setEditingType] = useState<RequestType | null>(null);
  const [deactivatingType, setDeactivatingType] = useState<RequestType | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [formError, setFormError] = useState('');

  // Compute active tickets per request type
  const getActiveTicketCountForType = (typeId: string) => {
    return state.tickets.filter(
      (t) =>
        t.requestTypeId === typeId &&
        (t.status === 'NEW' || t.status === 'IN_PROGRESS' || t.status === 'WAITING_FOR_EMPLOYEE')
    ).length;
  };

  // Filtered Request Types
  const filteredTypes = useMemo(() => {
    return state.requestTypes.filter((r) => {
      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        if (
          !r.name.toLowerCase().includes(q) &&
          !r.code.toLowerCase().includes(q) &&
          !r.description.toLowerCase().includes(q)
        ) {
          return false;
        }
      }
      if (statusFilter !== 'ALL' && r.status !== statusFilter) return false;
      return true;
    });
  }, [state.requestTypes, searchQuery, statusFilter]);

  // Statistics
  const totalCount = state.requestTypes.length;
  const activeCount = state.requestTypes.filter((r) => r.status === 'ACTIVE').length;
  const inactiveCount = state.requestTypes.filter((r) => r.status === 'INACTIVE').length;

  const openCreateModal = () => {
    setName('');
    setCode('');
    setDescription('');
    setFormError('');
    setIsCreateModalOpen(true);
  };

  const openEditModal = (r: RequestType) => {
    setEditingType(r);
    setName(r.name);
    setCode(r.code);
    setDescription(r.description);
    setFormError('');
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setFormError('Category name is required.');
      return;
    }
    if (name.trim().length < 3) {
      setFormError('Category name must be at least 3 characters.');
      return;
    }
    if (!code.trim()) {
      setFormError('Category code is required.');
      return;
    }
    const cleanCode = code.trim().toUpperCase().replace(/[^A-Z0-9_]/g, '_');
    if (state.requestTypes.some((r) => r.code.toUpperCase() === cleanCode)) {
      setFormError(`A category with code "${cleanCode}" already exists.`);
      return;
    }
    if (!description.trim()) {
      setFormError('Description is required so Employees know when to select this category.');
      return;
    }
    if (description.trim().length < 10) {
      setFormError('Description must be at least 10 characters.');
      return;
    }

    dispatch({
      type: 'CREATE_REQUEST_TYPE',
      payload: {
        name: name.trim(),
        code: cleanCode,
        description: description.trim(),
      },
    });

    setIsCreateModalOpen(false);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingType) return;

    if (!name.trim()) {
      setFormError('Category name is required.');
      return;
    }
    if (name.trim().length < 3) {
      setFormError('Category name must be at least 3 characters.');
      return;
    }
    if (!description.trim()) {
      setFormError('Description is required.');
      return;
    }
    if (description.trim().length < 10) {
      setFormError('Description must be at least 10 characters.');
      return;
    }

    dispatch({
      type: 'UPDATE_REQUEST_TYPE',
      payload: {
        id: editingType.id,
        name: name.trim(),
        description: description.trim(),
      },
    });

    setEditingType(null);
  };

  const handleToggleStatus = (r: RequestType) => {
    if (r.status === 'ACTIVE') {
      setDeactivatingType(r);
    } else {
      // Activating can be done directly
      dispatch({
        type: 'TOGGLE_REQUEST_TYPE_STATUS',
        payload: { id: r.id },
      });
    }
  };

  const confirmDeactivate = () => {
    if (!deactivatingType) return;
    dispatch({
      type: 'TOGGLE_REQUEST_TYPE_STATUS',
      payload: { id: deactivatingType.id },
    });
    setDeactivatingType(null);
  };

  // Define columns for DataTable
  const columns: Column<RequestType>[] = [
    {
      key: 'name',
      header: 'Category Name & Code',
      sortable: true,
      render: (r: RequestType) => (
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-text-primary text-body-medium">{r.name}</span>
            <code className="px-1.5 py-0.5 text-[11px] font-mono bg-bg-subtle text-text-muted rounded border border-border">
              {r.code}
            </code>
          </div>
        </div>
      ),
    },
    {
      key: 'description',
      header: 'Description',
      render: (r: RequestType) => (
        <span className="text-body-medium text-text-secondary line-clamp-2 max-w-md">
          {r.description}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      width: '130px',
      sortable: true,
      render: (r: RequestType) => (
        <Badge
          variant={r.status === 'ACTIVE' ? 'success' : 'default'}
          icon={
            r.status === 'ACTIVE' ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <XCircle className="w-3.5 h-3.5 text-text-muted" />
            )
          }
        >
          {r.status}
        </Badge>
      ),
    },
    {
      key: 'activeTickets',
      header: 'Active In Tickets',
      width: '150px',
      render: (r: RequestType) => {
        const count = getActiveTicketCountForType(r.id);
        return (
          <div className="flex items-center gap-1.5 text-caption font-medium">
            <FileText className="w-3.5 h-3.5 text-text-muted" />
            <span>{count} open ticket{count !== 1 ? 's' : ''}</span>
          </div>
        );
      },
    },
    {
      key: 'actions',
      header: 'Actions',
      width: '200px',
      align: 'right',
      render: (r: RequestType) => (
        <div className="flex items-center justify-end gap-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={(e) => {
              e.stopPropagation();
              openEditModal(r);
            }}
            className="h-8 gap-1.5"
          >
            <Edit2 className="w-3.5 h-3.5" />
            Edit
          </Button>

          {r.status === 'ACTIVE' ? (
            <Button
              size="sm"
              variant="secondary"
              onClick={(e) => {
                e.stopPropagation();
                handleToggleStatus(r);
              }}
              className="h-8 gap-1.5 text-amber-700 hover:text-amber-800 hover:bg-amber-50 border-amber-200"
              title="Deactivate this category"
            >
              <PowerOff className="w-3.5 h-3.5" />
              Deactivate
            </Button>
          ) : (
            <Button
              size="sm"
              variant="secondary"
              onClick={(e) => {
                e.stopPropagation();
                handleToggleStatus(r);
              }}
              className="h-8 gap-1.5 text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50 border-emerald-200"
              title="Activate this category"
            >
              <Power className="w-3.5 h-3.5" />
              Activate
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Request Types"
        description="Manage categories Employees use when creating tickets."
        actions={
          <Button onClick={openCreateModal} className="gap-2">
            <Plus className="w-4 h-4" />
            Add Request Type
          </Button>
        }
      />

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-bg-surface p-4 rounded-lg border border-border shadow-subtle flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="text-caption text-text-muted">Total Categories</div>
            <div className="text-heading-2 font-bold text-text-primary">{totalCount}</div>
          </div>
        </div>

        <div className="bg-bg-surface p-4 rounded-lg border border-border shadow-subtle flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-caption text-text-muted">Active (Available to Staff)</div>
            <div className="text-heading-2 font-bold text-emerald-700">{activeCount}</div>
          </div>
        </div>

        <div className="bg-bg-surface p-4 rounded-lg border border-border shadow-subtle flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center text-text-muted">
            <XCircle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-caption text-text-muted">Inactive (Hidden)</div>
            <div className="text-heading-2 font-bold text-text-muted">{inactiveCount}</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-bg-surface p-4 rounded-lg border border-border shadow-subtle flex flex-col md:flex-row items-center gap-3 justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <Input
            placeholder="Search category name, code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="w-48">
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={[
                { value: 'ALL', label: 'All Statuses' },
                { value: 'ACTIVE', label: 'Active Only' },
                { value: 'INACTIVE', label: 'Inactive Only' },
              ]}
            />
          </div>

          {(searchQuery || statusFilter !== 'ALL') && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('ALL');
              }}
              className="text-text-muted hover:text-text-primary text-caption"
            >
              Reset Filters
            </Button>
          )}
        </div>
      </div>

      {/* Request Types DataTable */}
      <DataTable
        data={filteredTypes}
        columns={columns}
        emptyTitle="No request types found"
        emptyDescription={
          searchQuery || statusFilter !== 'ALL'
            ? 'No categories match the current filter criteria.'
            : 'Get started by creating your first request category.'
        }
      />

      {/* Create Request Type Modal */}
      <Dialog
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Add Request Type"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <p className="text-caption text-text-secondary">
            Define a new classification category that employees can select when submitting IT support tickets.
          </p>

          {formError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md text-caption text-red-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
              <span>{formError}</span>
            </div>
          )}

          <Input
            label="Category Name *"
            placeholder="e.g. Cloud & Infrastructure"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              // Auto-generate code if code hasn't been manually diverged
              if (!code || code === name.toUpperCase().replace(/[^A-Z0-9]/g, '_')) {
                setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '_'));
              }
              setFormError('');
            }}
            required
          />

          <Input
            label="Category Code *"
            placeholder="e.g. CLOUD_INFRA"
            value={code}
            onChange={(e) => {
              setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9_]/g, '_'));
              setFormError('');
            }}
            required
          />

          <Textarea
            label="Description *"
            placeholder="Describe what kinds of issues belong to this category so Employees know when to select it..."
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              setFormError('');
            }}
            rows={4}
            required
          />

          <div className="flex justify-end gap-2 pt-2 border-t border-border">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsCreateModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              Create Category
            </Button>
          </div>
        </form>
      </Dialog>

      {/* Edit Request Type Modal */}
      <Dialog
        isOpen={!!editingType}
        onClose={() => setEditingType(null)}
        title="Edit Request Type"
      >
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <p className="text-caption text-text-secondary">
            Update category details. Note that category code cannot be modified once created to preserve historical ticket audit integrity.
          </p>

          {formError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md text-caption text-red-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
              <span>{formError}</span>
            </div>
          )}

          <div>
            <label className="block text-caption font-medium text-text-primary mb-1">
              Category Code
            </label>
            <div className="px-3 py-2 bg-bg-subtle border border-border rounded-md text-body-medium font-mono text-text-muted">
              {editingType?.code}
            </div>
          </div>

          <Input
            label="Category Name *"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setFormError('');
            }}
            required
          />

          <Textarea
            label="Description *"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              setFormError('');
            }}
            rows={4}
            required
          />

          <div className="flex justify-end gap-2 pt-2 border-t border-border">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setEditingType(null)}
            >
              Cancel
            </Button>
            <Button type="submit">
              Save Changes
            </Button>
          </div>
        </form>
      </Dialog>

      {/* Deactivate Warning Dialog */}
      <Dialog
        isOpen={!!deactivatingType}
        onClose={() => setDeactivatingType(null)}
        title="Deactivate Request Type?"
      >
        <div className="space-y-4">
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-md text-caption text-amber-800 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
            <div>
              <p className="font-semibold">Impact on Ticket Creation</p>
              <p className="mt-0.5">
                Deactivating <strong>{deactivatingType?.name}</strong> will prevent Employees from selecting it when submitting new support tickets.
              </p>
            </div>
          </div>

          <p className="text-body-medium text-text-secondary">
            Existing tickets that reference this category (including{' '}
            <strong>{deactivatingType ? getActiveTicketCountForType(deactivatingType.id) : 0} open ticket(s)</strong>)
            will retain their historical category tag and audit records unchanged.
          </p>

          <p className="text-caption text-text-muted">
            You can reactivate this category at any time from this dashboard.
          </p>

          <div className="flex justify-end gap-2 pt-3 border-t border-border">
            <Button
              variant="secondary"
              onClick={() => setDeactivatingType(null)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={confirmDeactivate}
            >
              Confirm Deactivation
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
