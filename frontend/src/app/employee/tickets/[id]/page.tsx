'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Edit3,
  XCircle,
  CheckCircle2,
  RotateCcw,
  MessageSquare,
  History,
  AlertTriangle,
  Send,
  HelpCircle,
  Check,
  Copy,
  Info,
} from 'lucide-react';
import { usePrototype } from '@/prototype/PrototypeProvider';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { StatusBadge } from '@/components/tickets/StatusBadge';
import { PriorityBadge } from '@/components/tickets/PriorityBadge';
import { CommentItem } from '@/components/tickets/CommentItem';
import { HistoryTimeline } from '@/components/tickets/HistoryTimeline';
import { CancelTicketModal, ReopenTicketModal } from '@/components/tickets/ActionModals';
import { Dialog } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { CalculatedPriority } from '@/components/forms/CalculatedPriority';
import { ImpactLevel, UrgencyLevel } from '@/lib/priority';
import { formatDateTime } from '@/lib/utils';

export default function EmployeeTicketDetailPage() {
  const params = useParams();
  const router = useRouter();
  const ticketId = params.id as string;

  const { state, dispatch, activeUser, selectors } = usePrototype();
  const ticket = selectors.getTicketById(state, ticketId);

  const [activeTab, setActiveTab] = useState<'conversation' | 'history'>('conversation');
  const [newComment, setNewComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  // Workflow modals
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isReopenModalOpen, setIsReopenModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Edit ticket state
  const [editTitle, setEditTitle] = useState(ticket?.title || '');
  const [editDesc, setEditDesc] = useState(ticket?.description || '');
  const [editReqType, setEditReqType] = useState(ticket?.requestTypeId || '');
  const [editImpact, setEditImpact] = useState<ImpactLevel>(ticket?.impact || 'MEDIUM');
  const [editUrgency, setEditUrgency] = useState<UrgencyLevel>(ticket?.urgency || 'MEDIUM');

  // Simulated Edit Conflict State (Preserves draft)
  const [editConflict, setEditConflict] = useState<{
    occurred: boolean;
    draftTitle: string;
    draftDesc: string;
  } | null>(null);

  if (!ticket) {
    return (
      <div className="p-8 text-center space-y-4">
        <p className="text-heading-2 text-text-primary">Ticket Not Found</p>
        <p className="text-body text-text-secondary">
          The requested ticket does not exist or you do not have permission to view it.
        </p>
        <Link href="/employee/tickets">
          <Button variant="secondary" size="md">
            Return to My Tickets
          </Button>
        </Link>
      </div>
    );
  }

  // Strictly enforce: Employee views ONLY public comments
  const comments = selectors.getTicketComments(state, ticket.id, activeUser);
  const historyEntries = selectors.getTicketHistory(state, ticket.id);

  // Latest public question if currently WAITING_FOR_EMPLOYEE
  const latestQuestion =
    ticket.status === 'WAITING_FOR_EMPLOYEE'
      ? comments.filter((c) => c.authorRole !== 'EMPLOYEE').slice(-1)[0]
      : null;

  // Latest public solution if RESOLVED or CLOSED
  const solutionComment =
    ticket.status === 'RESOLVED' || ticket.status === 'CLOSED'
      ? comments.find((c) => c.content.startsWith('Solution:'))
      : null;

  // Cancellation reason if CANCELLED
  const cancelHistory = ticket.status === 'CANCELLED'
    ? historyEntries.find((h) => h.action.includes('cancelled') || h.action.includes('Cancelled'))
    : null;

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmittingComment(true);
    setTimeout(() => {
      // If waiting for employee, reply automatically resumes ticket to IN_PROGRESS
      if (ticket.status === 'WAITING_FOR_EMPLOYEE') {
        dispatch({
          type: 'EMPLOYEE_REPLY',
          payload: {
            ticketId: ticket.id,
            employeeId: activeUser.id,
            comment: newComment.trim(),
          },
        });
      } else {
        dispatch({
          type: 'ADD_COMMENT',
          payload: {
            ticketId: ticket.id,
            authorId: activeUser.id,
            type: 'PUBLIC',
            content: newComment.trim(),
          },
        });
      }

      setNewComment('');
      setIsSubmittingComment(false);
    }, 300);
  };

  const handleSaveEdit = () => {
    // If ticket has left NEW during draft, simulate conflict!
    if (ticket.status !== 'NEW') {
      setEditConflict({
        occurred: true,
        draftTitle: editTitle,
        draftDesc: editDesc,
      });
      setIsEditModalOpen(false);
      return;
    }

    dispatch({
      type: 'EDIT_TICKET',
      payload: {
        ticketId: ticket.id,
        title: editTitle.trim(),
        description: editDesc.trim(),
        requestTypeId: editReqType,
        impact: editImpact,
        urgency: editUrgency,
      },
    });

    setIsEditModalOpen(false);
  };

  const handleConfirmClose = () => {
    dispatch({
      type: 'CONFIRM_AND_CLOSE',
      payload: {
        ticketId: ticket.id,
        employeeId: activeUser.id,
      },
    });
  };

  const isTerminal = ticket.status === 'CLOSED' || ticket.status === 'CANCELLED';

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title={ticket.title}
        breadcrumbs={[
          { label: 'OpsFlow', href: '/' },
          { label: 'My Tickets', href: '/employee/tickets' },
          { label: ticket.ticketCode },
        ]}
        badge={
          <div className="flex items-center gap-2">
            <span className="font-mono text-caption px-2 py-0.5 rounded bg-bg-subtle text-text-secondary border border-border">
              {ticket.ticketCode}
            </span>
            <StatusBadge status={ticket.status} />
            <PriorityBadge priority={ticket.priority} showLabel />
          </div>
        }
        actions={
          <div className="flex items-center gap-2">
            <Link href="/employee/tickets">
              <Button variant="secondary" size="sm" leftIcon={<ArrowLeft className="w-3.5 h-3.5" />}>
                Back to My Tickets
              </Button>
            </Link>

            {/* State Actions: NEW */}
            {ticket.status === 'NEW' && (
              <>
                <Button
                  variant="secondary"
                  size="sm"
                  leftIcon={<Edit3 className="w-3.5 h-3.5" />}
                  onClick={() => {
                    setEditTitle(ticket.title);
                    setEditDesc(ticket.description);
                    setEditReqType(ticket.requestTypeId);
                    setEditImpact(ticket.impact);
                    setEditUrgency(ticket.urgency);
                    setIsEditModalOpen(true);
                  }}
                >
                  Edit Ticket
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  leftIcon={<XCircle className="w-3.5 h-3.5" />}
                  onClick={() => setIsCancelModalOpen(true)}
                >
                  Cancel Ticket
                </Button>
              </>
            )}

            {/* State Actions: IN_PROGRESS & WAITING */}
            {(ticket.status === 'IN_PROGRESS' || ticket.status === 'WAITING_FOR_EMPLOYEE') && (
              <Button
                variant="danger"
                size="sm"
                leftIcon={<XCircle className="w-3.5 h-3.5" />}
                onClick={() => setIsCancelModalOpen(true)}
              >
                Cancel Ticket
              </Button>
            )}

            {/* State Actions: RESOLVED */}
            {ticket.status === 'RESOLVED' && (
              <>
                <Button
                  variant="secondary"
                  size="sm"
                  leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
                  onClick={() => setIsReopenModalOpen(true)}
                >
                  Reopen Ticket
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}
                  onClick={handleConfirmClose}
                >
                  Confirm & Close
                </Button>
              </>
            )}
          </div>
        }
      />

      {/* CONCURRENT EDIT CONFLICT BANNER (Preserves draft) */}
      {editConflict && (
        <div className="p-4 rounded-xl border border-amber-300 bg-amber-50/90 text-amber-950 space-y-3 animate-in fade-in shadow-subtle">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1 flex-1">
              <h4 className="text-body-medium font-semibold text-amber-950">
                This ticket has changed and is now being processed
              </h4>
              <p className="text-body text-amber-900/90 leading-relaxed">
                Your direct edits were not saved because the support agent has already started processing this request. Copy any additional information below and add it as a public comment.
              </p>
            </div>
          </div>

          <div className="bg-bg-surface p-3 rounded-lg border border-amber-200 space-y-1.5 font-mono text-[12px] text-text-secondary">
            <div>
              <strong className="text-text-primary font-sans">Draft Title:</strong> {editConflict.draftTitle}
            </div>
            <div>
              <strong className="text-text-primary font-sans">Draft Description:</strong> {editConflict.draftDesc}
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<Copy className="w-3.5 h-3.5" />}
              onClick={() => {
                navigator.clipboard.writeText(editConflict.draftDesc);
                setNewComment(editConflict.draftDesc);
                setEditConflict(null);
              }}
            >
              Copy to Comment Field
            </Button>
            <Button variant="tertiary" size="sm" onClick={() => setEditConflict(null)}>
              Dismiss Notice
            </Button>
          </div>
        </div>
      )}

      {/* WAITING FOR EMPLOYEE PROMINENT BANNER */}
      {ticket.status === 'WAITING_FOR_EMPLOYEE' && (
        <div className="p-4 rounded-xl border border-amber-300 bg-amber-50 text-amber-950 flex items-start gap-3.5 shadow-subtle">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1 flex-1">
            <h4 className="text-body-medium font-semibold text-amber-950">
              IT Support is waiting for your response
            </h4>
            <p className="text-body text-amber-900 leading-relaxed">
              Please review the inquiry from the support agent below and reply using the comment box. Your reply will automatically return the ticket to <strong>In Progress</strong>.
            </p>
            {latestQuestion && (
              <div className="mt-2 p-3 bg-bg-surface rounded-lg border border-amber-200 text-body text-text-primary italic">
                &ldquo;{latestQuestion.content}&rdquo;
              </div>
            )}
          </div>
        </div>
      )}

      {/* RESOLUTION PROMINENT BANNER */}
      {(ticket.status === 'RESOLVED' || ticket.status === 'CLOSED') && solutionComment && (
        <div className="p-4 rounded-xl border border-emerald-300 bg-emerald-50 text-emerald-950 flex items-start gap-3.5 shadow-subtle">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div className="space-y-1 flex-1">
            <h4 className="text-body-medium font-semibold text-emerald-950">
              {ticket.status === 'CLOSED' ? 'Resolved & Closed' : 'Resolution Provided – Awaiting Verification'}
            </h4>
            <p className="text-body text-emerald-900/90 leading-relaxed">
              {solutionComment.content.replace(/^Solution:\s*/i, '')}
            </p>
            {ticket.status === 'RESOLVED' && (
              <p className="text-caption text-emerald-800 font-medium pt-1">
                Please test and confirm the fix. Click <strong>Confirm & Close</strong> to close the ticket permanently, or <strong>Reopen</strong> if the issue persists.
              </p>
            )}
          </div>
        </div>
      )}

      {/* CANCELLED NOTICE BANNER */}
      {ticket.status === 'CANCELLED' && (
        <div className="p-4 rounded-xl border border-red-200 bg-red-50 text-red-950 flex items-start gap-3.5 shadow-subtle">
          <XCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-body-medium font-semibold text-red-950">Ticket Cancelled</h4>
            <p className="text-body text-red-900/90 leading-relaxed">
              This ticket has been cancelled. Reason:{' '}
              <strong>{cancelHistory?.reason || 'Cancelled by ticket owner.'}</strong>
            </p>
          </div>
        </div>
      )}

      {/* 2-COLUMN LAYOUT: Main ~2/3, Right Metadata ~1/3 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* MAIN COLUMN (2/3) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Issue Description Card */}
          <div className="bg-bg-surface border border-border rounded-xl p-5 shadow-subtle space-y-2">
            <h4 className="text-caption font-semibold text-text-muted uppercase tracking-wider">
              Issue Description
            </h4>
            <p className="text-body text-text-primary whitespace-pre-wrap leading-relaxed">
              {ticket.description}
            </p>
          </div>

          {/* Tabs: Conversation vs History */}
          <div className="bg-bg-surface border border-border rounded-xl shadow-subtle overflow-hidden">
            <div className="flex border-b border-border bg-bg-subtle/50 px-4">
              <button
                onClick={() => setActiveTab('conversation')}
                className={`py-3 px-4 text-body font-medium transition-colors border-b-2 -mb-[1px] flex items-center gap-2 ${
                  activeTab === 'conversation'
                    ? 'border-primary text-primary font-semibold'
                    : 'border-transparent text-text-secondary hover:text-text-primary'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                <span>Conversation ({comments.length})</span>
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`py-3 px-4 text-body font-medium transition-colors border-b-2 -mb-[1px] flex items-center gap-2 ${
                  activeTab === 'history'
                    ? 'border-primary text-primary font-semibold'
                    : 'border-transparent text-text-secondary hover:text-text-primary'
                }`}
              >
                <History className="w-4 h-4" />
                <span>Activity History ({historyEntries.length})</span>
              </button>
            </div>

            <div className="p-5">
              {activeTab === 'conversation' && (
                <div className="space-y-5">
                  {/* Comments Thread */}
                  {comments.length === 0 ? (
                    <p className="text-caption text-text-muted text-center py-6">
                      No comments posted yet.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {comments.map((c) => (
                        <CommentItem key={c.id} comment={c} />
                      ))}
                    </div>
                  )}

                  {/* Comment Composer */}
                  {!isTerminal ? (
                    <form onSubmit={handlePostComment} className="pt-4 border-t border-border space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-caption font-semibold text-text-secondary">
                          {ticket.status === 'WAITING_FOR_EMPLOYEE'
                            ? 'Reply to IT Support *'
                            : 'Add a Public Comment'}
                        </label>
                        <span className="text-[11px] text-text-muted">
                          Public · Visible to IT Support
                        </span>
                      </div>
                      <Textarea
                        placeholder={
                          ticket.status === 'WAITING_FOR_EMPLOYEE'
                            ? 'Type your response here to resume ticket processing...'
                            : 'Need to add more information or follow up on progress? Type a comment here...'
                        }
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        rows={3}
                        disabled={isSubmittingComment}
                        className={ticket.status === 'WAITING_FOR_EMPLOYEE' ? 'border-amber-300 focus:ring-amber-300' : ''}
                      />
                      <div className="flex items-center justify-between">
                        <span className="text-caption text-text-muted text-[11px]">
                          Comments cannot be edited or deleted once submitted.
                        </span>
                        <Button
                          type="submit"
                          variant="primary"
                          size="sm"
                          isLoading={isSubmittingComment}
                          leftIcon={<Send className="w-3.5 h-3.5" />}
                          disabled={!newComment.trim()}
                        >
                          {ticket.status === 'WAITING_FOR_EMPLOYEE' ? 'Send Reply' : 'Post Comment'}
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <div className="p-3 bg-bg-subtle rounded-lg border border-border text-center text-caption text-text-muted">
                      This ticket is {ticket.status.toLowerCase()}. Further comments are disabled.
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'history' && (
                <div className="space-y-4">
                  <p className="text-caption text-text-muted">
                    Public timeline of status updates, assignment, and priority calculations.
                  </p>
                  <HistoryTimeline entries={historyEntries} />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT METADATA PANEL (1/3) */}
        <div className="space-y-4">
          <div className="bg-bg-surface border border-border rounded-xl p-5 shadow-subtle space-y-4">
            <h4 className="text-caption font-semibold text-text-muted uppercase tracking-wider">
              Ticket Information
            </h4>

            <div className="space-y-3 divide-y divide-border/60 text-body">
              {/* Request Type */}
              <div className="pt-2 flex items-center justify-between">
                <span className="text-caption font-medium text-text-secondary">Request Type</span>
                <span className="text-caption font-medium text-text-primary truncate max-w-[160px]">
                  {ticket.requestTypeName}
                </span>
              </div>

              {/* Status */}
              <div className="pt-2 flex items-center justify-between">
                <span className="text-caption font-medium text-text-secondary">Status</span>
                <StatusBadge status={ticket.status} size="sm" />
              </div>

              {/* Priority */}
              <div className="pt-2 flex items-center justify-between">
                <span className="text-caption font-medium text-text-secondary">Priority</span>
                <PriorityBadge priority={ticket.priority} size="sm" showLabel />
              </div>

              {/* Impact */}
              <div className="pt-2 flex items-center justify-between">
                <span className="text-caption font-medium text-text-secondary">Impact</span>
                <span className="text-caption font-medium text-text-primary">{ticket.impact}</span>
              </div>

              {/* Urgency */}
              <div className="pt-2 flex items-center justify-between">
                <span className="text-caption font-medium text-text-secondary">Urgency</span>
                <span className="text-caption font-medium text-text-primary">{ticket.urgency}</span>
              </div>

              {/* Assignee */}
              <div className="pt-2 flex items-center justify-between">
                <span className="text-caption font-medium text-text-secondary">Assigned Agent</span>
                <span className="text-caption font-medium text-text-primary">
                  {ticket.assigneeName ? (
                    <span className="font-semibold text-primary">{ticket.assigneeName}</span>
                  ) : (
                    <span className="text-text-muted italic">Unassigned</span>
                  )}
                </span>
              </div>

              {/* Created */}
              <div className="pt-2 flex items-center justify-between">
                <span className="text-caption font-medium text-text-secondary">Created At</span>
                <span className="text-caption text-text-muted">{formatDateTime(ticket.createdAt)}</span>
              </div>

              {/* Updated */}
              <div className="pt-2 flex items-center justify-between">
                <span className="text-caption font-medium text-text-secondary">Last Updated</span>
                <span className="text-caption text-text-muted">{formatDateTime(ticket.updatedAt)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* EDIT TICKET MODAL (Only when in NEW) */}
      <Dialog
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Ticket Details"
        description="Employee may update ticket details while status is NEW. Priority will be automatically recalculated."
        maxWidth="lg"
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleSaveEdit}>
              Save Changes
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Title *"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            required
          />

          <Select
            label="Request Type *"
            value={editReqType}
            onChange={(e) => setEditReqType(e.target.value)}
            options={state.requestTypes.map((r) => ({
              value: r.id,
              label: r.name,
              disabled: r.status === 'INACTIVE',
            }))}
          />

          <Textarea
            label="Description *"
            value={editDesc}
            onChange={(e) => setEditDesc(e.target.value)}
            rows={4}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Impact *"
              value={editImpact}
              onChange={(e) => setEditImpact(e.target.value as ImpactLevel)}
              options={[
                { value: 'HIGH', label: 'HIGH (50+ users)' },
                { value: 'MEDIUM', label: 'MEDIUM (2–49 users)' },
                { value: 'LOW', label: 'LOW (Single user)' },
              ]}
            />
            <Select
              label="Urgency *"
              value={editUrgency}
              onChange={(e) => setEditUrgency(e.target.value as UrgencyLevel)}
              options={[
                { value: 'HIGH', label: 'HIGH (Blocked)' },
                { value: 'MEDIUM', label: 'MEDIUM (Hindered)' },
                { value: 'LOW', label: 'LOW (Can wait)' },
              ]}
            />
          </div>

          <CalculatedPriority impact={editImpact} urgency={editUrgency} />
        </div>
      </Dialog>

      {/* CANCEL MODAL */}
      <CancelTicketModal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        ticketCode={ticket.ticketCode}
        onSubmit={(reason) => {
          dispatch({
            type: 'CANCEL_TICKET',
            payload: {
              ticketId: ticket.id,
              actorId: activeUser.id,
              reason,
            },
          });
        }}
      />

      {/* REOPEN MODAL */}
      <ReopenTicketModal
        isOpen={isReopenModalOpen}
        onClose={() => setIsReopenModalOpen(false)}
        ticketCode={ticket.ticketCode}
        onSubmit={(reason) => {
          dispatch({
            type: 'REOPEN_TICKET',
            payload: {
              ticketId: ticket.id,
              actorId: activeUser.id,
              reason,
            },
          });
        }}
      />
    </div>
  );
}
