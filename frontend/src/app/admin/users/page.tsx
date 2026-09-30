'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Users,
  Search,
  Plus,
  Lock,
  Unlock,
  Edit2,
  AlertTriangle,
  ShieldAlert,
  ArrowRight,
} from 'lucide-react';
import { usePrototype } from '@/prototype/PrototypeProvider';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { DataTable, Column } from '@/components/tickets/DataTable';
import { Dialog } from '@/components/ui/dialog';
import { User, Role, UserStatus } from '@/mocks/users';

export default function AdminUsersPage() {
  const router = useRouter();
  const { state, dispatch, activeUser } = usePrototype();

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<Role>('EMPLOYEE');
  const [department, setDepartment] = useState('Engineering');
  const [formError, setFormError] = useState('');

  // Blocking guard modal states
  const [blockingModal, setBlockingModal] = useState<{
    title: string;
    message: string;
    agentId?: string;
    activeCount?: number;
  } | null>(null);

  // Filtered users
  const filteredUsers = useMemo(() => {
    return state.users.filter((u) => {
      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        if (!u.name.toLowerCase().includes(q) && !u.email.toLowerCase().includes(q)) {
          return false;
        }
      }
      if (roleFilter !== 'ALL' && u.role !== roleFilter) return false;
      if (statusFilter !== 'ALL' && u.status !== statusFilter) return false;
      return true;
    });
  }, [state.users, searchQuery, roleFilter, statusFilter]);

  // Compute live active tickets count per agent
  const getUserActiveTicketCount = (userId: string) => {
    return state.tickets.filter(
      (t) =>
        t.assigneeId === userId &&
        (t.status === 'NEW' || t.status === 'IN_PROGRESS' || t.status === 'WAITING_FOR_EMPLOYEE')
    ).length;
  };

  const handleToggleLock = (user: User) => {
    // GUARD 1: Last Active Administrator check
    if (user.role === 'ADMINISTRATOR' && user.status === 'ACTIVE') {
      const activeAdmins = state.users.filter((u) => u.role === 'ADMINISTRATOR' && u.status === 'ACTIVE');
      if (activeAdmins.length <= 1) {
        setBlockingModal({
          title: 'Cannot Lock Administrator',
          message: 'At least one active Administrator is required to maintain system access.',
        });
        return;
      }
    }

    // GUARD 2: Support Agent with active tickets check
    if (user.role === 'SUPPORT_AGENT' && user.status === 'ACTIVE') {
      const activeCount = getUserActiveTicketCount(user.id);
      if (activeCount > 0) {
        setBlockingModal({
          title: 'This agent still has active tickets',
          message: `Reassign the ${activeCount} active ticket(s) currently assigned to ${user.name} before locking this account.`,
          agentId: user.id,
          activeCount,
        });
        return;
      }
    }

    dispatch({
      type: 'TOGGLE_USER_LOCK',
      payload: { userId: user.id },
    });
  };

  const handleSaveCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setFormError('Name and Email are required.');
      return;
    }

    // Check duplicate email
    if (state.users.some((u) => u.email.toLowerCase() === email.trim().toLowerCase())) {
      setFormError('An account with this email address already exists.');
      return;
    }

    dispatch({
      type: 'CREATE_USER',
      payload: {
        name: name.trim(),
        email: email.trim(),
        role,
        department,
      },
    });

    setName('');
    setEmail('');
    setRole('EMPLOYEE');
    setDepartment('Engineering');
    setFormError('');
    setIsCreateModalOpen(false);
  };

  const handleSaveEditUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    if (!name.trim() || !email.trim()) {
      setFormError('Name and Email are required.');
      return;
    }

    // Check last admin downgrade
    if (editingUser.role === 'ADMINISTRATOR' && role !== 'ADMINISTRATOR') {
      const activeAdmins = state.users.filter((u) => u.role === 'ADMINISTRATOR' && u.status === 'ACTIVE');
      if (activeAdmins.length <= 1) {
        setFormError('Cannot remove Administrator role from the final active administrator.');
        return;
      }
    }

    // Check active agent tickets role change
    if (editingUser.role === 'SUPPORT_AGENT' && role !== 'SUPPORT_AGENT') {
      const activeCount = getUserActiveTicketCount(editingUser.id);
      if (activeCount > 0) {
        setFormError(`Cannot change role of ${editingUser.name} while they have ${activeCount} active assigned ticket(s). Reassign them first.`);
        return;
      }
    }

    dispatch({
      type: 'UPDATE_USER',
      payload: {
        userId: editingUser.id,
        name: name.trim(),
        email: email.trim(),
        department,
        role,
      },
    });

    setEditingUser(null);
    setFormError('');
  };

  const columns: Column<User>[] = [
    {
      key: 'name',
      header: 'Name',
      sortable: true,
      render: (u) => (
        <div className="flex items-center gap-2.5">
          <div
            className="w-7 h-7 rounded-full text-white flex items-center justify-center font-bold text-[11px] shrink-0"
            style={{ backgroundColor: u.avatarColor || '#2563EB' }}
          >
            {u.name.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-text-primary text-body leading-tight">{u.name}</p>
            <p className="text-[12px] text-text-muted">{u.department}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'email',
      header: 'Email Address',
      sortable: true,
      render: (u) => <span className="font-mono text-caption text-text-secondary">{u.email}</span>,
    },
    {
      key: 'role',
      header: 'Role',
      width: '160px',
      sortable: true,
      render: (u) => (
        <span
          className={`inline-flex px-2 py-0.5 rounded text-caption font-medium border ${
            u.role === 'ADMINISTRATOR'
              ? 'bg-slate-100 text-slate-800 border-slate-300 font-semibold'
              : u.role === 'SUPPORT_AGENT'
              ? 'bg-amber-50 text-amber-900 border-amber-200'
              : 'bg-blue-50 text-blue-900 border-blue-200'
          }`}
        >
          {u.role === 'SUPPORT_AGENT'
            ? 'Support Agent'
            : u.role === 'ADMINISTRATOR'
            ? 'Administrator'
            : 'Employee'}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Account Status',
      width: '130px',
      sortable: true,
      render: (u) => (
        <span
          className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-caption font-medium border ${
            u.status === 'ACTIVE'
              ? 'bg-[#E6F7EB] text-[#146E38] border-[#BBF7D0]'
              : 'bg-[#FFEAEA] text-[#B02A2B] border-[#FECACA]'
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              u.status === 'ACTIVE' ? 'bg-[#146E38]' : 'bg-[#B02A2B]'
            }`}
          />
          {u.status}
        </span>
      ),
    },
    {
      key: 'activeTickets',
      header: 'Active Workload',
      width: '140px',
      render: (u) => {
        if (u.role !== 'SUPPORT_AGENT') {
          return <span className="text-text-muted">—</span>;
        }
        const count = getUserActiveTicketCount(u.id);
        return (
          <span className="text-caption font-semibold font-mono text-text-primary">
            {count} open ticket(s)
          </span>
        );
      },
    },
    {
      key: 'actions',
      header: 'Actions',
      width: '160px',
      align: 'right',
      render: (u) => (
        <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
          <Button
            variant="tertiary"
            size="sm"
            leftIcon={<Edit2 className="w-3 h-3" />}
            onClick={() => {
              setEditingUser(u);
              setName(u.name);
              setEmail(u.email);
              setRole(u.role);
              setDepartment(u.department);
              setFormError('');
            }}
          >
            Edit
          </Button>

          <Button
            variant={u.status === 'ACTIVE' ? 'tertiary' : 'secondary'}
            size="sm"
            leftIcon={u.status === 'ACTIVE' ? <Lock className="w-3 h-3 text-red-600" /> : <Unlock className="w-3 h-3 text-emerald-600" />}
            onClick={() => handleToggleLock(u)}
            className={u.status === 'ACTIVE' ? 'text-red-600 hover:text-red-700' : 'text-emerald-700 font-semibold'}
          >
            {u.status === 'ACTIVE' ? 'Lock' : 'Unlock'}
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Users"
        description="Manage company user accounts, role assignments, and account statuses."
        breadcrumbs={[
          { label: 'OpsFlow', href: '/' },
          { label: 'Administrator', href: '/admin/dashboard' },
          { label: 'Users' },
        ]}
        actions={
          <Button
            variant="primary"
            size="md"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => {
              setName('');
              setEmail('');
              setRole('EMPLOYEE');
              setDepartment('Engineering');
              setFormError('');
              setIsCreateModalOpen(true);
            }}
          >
            Create User
          </Button>
        }
      />

      {/* Filter Bar */}
      <div className="bg-bg-surface border border-border rounded-lg p-3 shadow-subtle flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="w-full md:w-80">
          <Input
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Role */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="h-9 px-2.5 rounded-md bg-bg-surface border border-border text-caption text-text-primary focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer w-40"
          >
            <option value="ALL">All Roles</option>
            <option value="EMPLOYEE">Employee</option>
            <option value="SUPPORT_AGENT">Support Agent</option>
            <option value="ADMINISTRATOR">Administrator</option>
          </select>

          {/* Account Status */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-9 px-2.5 rounded-md bg-bg-surface border border-border text-caption text-text-primary focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer w-36"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="LOCKED">Locked</option>
          </select>
        </div>
      </div>

      {/* Users DataTable */}
      <DataTable
        columns={columns}
        data={filteredUsers}
        defaultPageSize={20}
        initialSortKey="name"
        initialSortDirection="asc"
        emptyTitle="No users found"
        emptyDescription="No employee or staff accounts match your current filter parameters."
      />

      {/* CREATE USER MODAL */}
      <Dialog
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create User Account"
        description="Add a new employee or support agent. Account status will default to ACTIVE."
        maxWidth="md"
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleSaveCreateUser}>
              Create Account
            </Button>
          </>
        }
      >
        <form onSubmit={handleSaveCreateUser} className="space-y-4">
          {formError && (
            <div className="p-2.5 rounded bg-red-50 border border-red-200 text-caption text-red-900 font-medium">
              {formError}
            </div>
          )}

          <Input
            label="Full Name *"
            placeholder="e.g. Rachel Adams"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <Input
            label="Work Email / Username *"
            type="email"
            placeholder="rachel.adams@opsflow.internal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Select
            label="Account Role *"
            value={role}
            onChange={(e) => setRole(e.target.value as Role)}
            options={[
              { value: 'EMPLOYEE', label: 'Employee (Standard user - creates tickets)' },
              { value: 'SUPPORT_AGENT', label: 'Support Agent (Processes tickets & queue)' },
              { value: 'ADMINISTRATOR', label: 'Administrator (Manages system, users, reports)' },
            ]}
          />

          <Input
            label="Department *"
            placeholder="e.g. Quality Assurance"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            required
          />

          <p className="text-[11px] text-text-muted">
            * Note: In OpsFlow, an account has exactly ONE role. Multi-role accounts and self-registration are not supported.
          </p>
        </form>
      </Dialog>

      {/* EDIT USER MODAL */}
      {editingUser && (
        <Dialog
          isOpen={!!editingUser}
          onClose={() => setEditingUser(null)}
          title={`Edit User: ${editingUser.name}`}
          description="Update account details and role assignment."
          maxWidth="md"
          footer={
            <>
              <Button variant="secondary" size="sm" onClick={() => setEditingUser(null)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleSaveEditUser}>
                Save Changes
              </Button>
            </>
          }
        >
          <form onSubmit={handleSaveEditUser} className="space-y-4">
            {formError && (
              <div className="p-2.5 rounded bg-red-50 border border-red-200 text-caption text-red-900 font-medium">
                {formError}
              </div>
            )}

            <Input
              label="Full Name *"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <Input
              label="Work Email *"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Select
              label="Account Role *"
              value={role}
              onChange={(e) => setRole(e.target.value as Role)}
              options={[
                { value: 'EMPLOYEE', label: 'Employee' },
                { value: 'SUPPORT_AGENT', label: 'Support Agent' },
                { value: 'ADMINISTRATOR', label: 'Administrator' },
              ]}
            />

            <Input
              label="Department *"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              required
            />
          </form>
        </Dialog>
      )}

      {/* BLOCKING GUARD MODAL */}
      {blockingModal && (
        <Dialog
          isOpen={!!blockingModal}
          onClose={() => setBlockingModal(null)}
          title={
            <div className="flex items-center gap-2 text-red-600 font-semibold">
              <ShieldAlert className="w-5 h-5 shrink-0" />
              <span>{blockingModal.title}</span>
            </div>
          }
          footer={
            <>
              <Button variant="secondary" size="sm" onClick={() => setBlockingModal(null)}>
                Cancel
              </Button>
              {blockingModal.agentId && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    setBlockingModal(null);
                    router.push('/admin/tickets');
                  }}
                >
                  View Assigned Tickets
                </Button>
              )}
            </>
          }
        >
          <div className="space-y-3">
            <p className="text-body text-text-primary leading-relaxed">
              {blockingModal.message}
            </p>
            {blockingModal.activeCount && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-caption text-amber-900">
                <strong>Active Workload:</strong> {blockingModal.activeCount} ticket(s) currently in progress or waiting. Reassign these tickets in the Ticket Directory before locking this account.
              </div>
            )}
          </div>
        </Dialog>
      )}
    </div>
  );
}
