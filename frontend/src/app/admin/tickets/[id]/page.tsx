'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Play,
  UserPlus,
  RefreshCw,
  Pause,
  CheckCircle2,
  XCircle,
  RotateCcw,
  SlidersHorizontal,
  MessageSquare,
  Lock,
  History,
  Send,
  AlertTriangle,
} from 'lucide-react';
import { usePrototype } from '@/prototype/PrototypeProvider';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { StatusBadge } from '@/components/tickets/StatusBadge';
import { PriorityBadge } from '@/components/tickets/PriorityBadge';
import { SlaIndicator } from '@/components/tickets/SlaIndicator';
import { CommentItem } from '@/components/tickets/CommentItem';
import { InternalNoteItem } from '@/components/tickets/InternalNoteItem';
import { HistoryTimeline } from '@/components/tickets/HistoryTimeline';
import {
  WaitingQuestionModal,
  ResolveSolutionModal,
  CancelTicketModal,
  ReopenTicketModal,
  ReassignModal,
} from '@/components/tickets/ActionModals';
import { Dialog } from '@/components/ui/dialog';
import { CalculatedPriority } from '@/components/forms/CalculatedPriority';
import { ImpactLevel, UrgencyLevel } from '@/lib/priority';
import { getFirstResponseSlaDisplay, getResolutionSlaDisplay } from '@/lib/sla';
import { formatDateTime, formatMinutes } from '@/lib/utils';
import { CommentType } from '@/mocks/comments';

export default function AdminTicketDetailPage() {
  const params = useParams();
  const router = useRouter();
  const ticketId = params.id as string;

  const { state, dispatch, activeUser, selectors } = usePrototype();
  const ticket = selectors.getTicketById(state, ticketId);

  const [activeTab, setActiveTab] = useState<'conversation' | 'history'>('conversation');
  const [commentType, setCommentType] = useState<CommentType>('PUBLIC');
  const [newComment, setNewComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  // Workflow modals
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isReassignModalOpen, setIsReassignModalOpen] = useState(false);
  const [isWaitModalOpen, setIsWaitModalOpen] = useState(false);
  const [isResolveModalOpen, setIsResolveModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isReopenModalOpen, setIsReopenModalOpen] = useState(false);
  const [isAdminCloseModalOpen, setIsAdminCloseModalOpen] = useState(false);
  const [adminCloseReason, setAdminCloseReason] = useState('');
  const [isPriorityFactorsModalOpen, setIsPriorityFactorsModalOpen] = useState(false);

  // Priority adjustment
  const [newImpact, setNewImpact] = useState<ImpactLevel>(ticket?.impact || 'MEDIUM');
  const [newUrgency, setNewUrgency] = useState<UrgencyLevel>(ticket?.urgency || 'MEDIUM');
  const [priorityChangeReason, setPriorityChangeReason] = useState('');
  const [priorityModalError, setPriorityModalError] = useState('');

  // Assign agent
  const [assignAgentId, setAssignAgentId] = useState('');

  if (!ticket) {
    return (
      <div className="p-8 text-center space-y-4">
        <p className="text-heading-2 text-text-primary">Ticket Not Found</p>
        <Link href="/admin/tickets">
          <Button variant="secondary" size="md">
            Return to Ticket Directory
          </Button>
        </Link>
      </div>
    );
  }

  const activeAgents = selectors.getActiveAgents(state);
  const comments = selectors.getTicketComments(state, ticket.id, activeUser);
  const historyEntries = selectors.getTicketHistory(state, ticket.id);

  const firstResponseSla = getFirstResponseSlaDisplay(ticket.sla);
  const resolutionSla = getResolutionSlaDisplay(ticket.sla, ticket.status);
  const isTerminal = ticket.status === 'CLOSED' || ticket.status === 'CANCELLED';

  const handleStartProcessing = () => {
    // Invariant: ticket must have an assigned agent before starting
    if (!ticket.assigneeId) {
      alert('Ticket must be assigned to an active Support Agent before starting processing.');
      return;
    }

    dispatch({
      type: 'START_PROCESSING',
      payload: {
        ticketId: ticket.id,
        actorId: activeUser.id,
      },
    });
  };

  const handleConfirmAssign = () => {
    if (!assignAgentId) return;

    dispatch({
      type: 'ASSIGN_TICKET',
      payload: {
        ticketId: ticket.id,
        agentId: assignAgentId,
        adminId: activeUser.id,
      },
    });

    setIsAssignModalOpen(false);
    setAssignAgentId('');
  };

  const handleAdminClose = () => {
    if (!adminCloseReason.trim()) return;

    dispatch({
      type: 'ADMIN_CLOSE',
      payload: {
        ticketId: ticket.id,
        adminId: activeUser.id,
        reason: adminCloseReason.trim(),
      },
    });

    setAdminCloseReason('');
    setIsAdminCloseModalOpen(false);
  };

  const handleSavePriorityFactors = () => {
    if (!priorityChangeReason.trim()) {
      setPriorityModalError('A reason is mandatory when updating business priority factors.');
      return;
    }

    dispatch({
      type: 'EDIT_TICKET',
      payload: {
        ticketId: ticket.id,
        title: ticket.title,
        description: ticket.description,
        requestTypeId: ticket.requestTypeId,
        impact: newImpact,
        urgency: newUrgency,
      },
    });

    setPriorityChangeReason('');
    setPriorityModalError('');
    setIsPriorityFactorsModalOpen(false);
  };

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmittingComment(true);
    setTimeout(() => {
      dispatch({
        type: 'ADD_COMMENT',
        payload: {
          ticketId: ticket.id,
          authorId: activeUser.id,
          type: commentType,
          content: newComment.trim(),
        },
      });

      setNewComment('');
      setIsSubmittingComment(false);
    }, 300);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title={ticket.title}
        breadcrumbs={[
          { label: 'OpsFlow', href: '/' },
          { label: 'Administrator', href: '/admin/dashboard' },
          { label: 'Ticket Directory', href: '/admin/tickets' },
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
          <div className="flex items-center gap-2 flex-wrap">
            <Link href="/admin/tickets">
              <Button variant="secondary" size="sm" leftIcon={<ArrowLeft className="w-3.5 h-3.5" />}>
                Back to Directory
              </Button>
            </Link>

            {/* UNASSIGNED: Assign Action */}
            {ticket.assigneeId === null && !isTerminal && (
              <Button
                variant="primary"
                size="sm"
                leftIcon={<UserPlus className="w-3.5 h-3.5" />}
                onClick={() => {
                  setAssignAgentId(activeAgents[0]?.id || '');
                  setIsAssignModalOpen(true);
                }}
              >
                Assign Agent
              </Button>
            )}

            {/* ASSIGNED: Reassign Action */}
            {ticket.assigneeId !== null && !isTerminal && (
              <Button
                variant="secondary"
                size="sm"
                leftIcon={<RefreshCw className="w-3.5 h-3.5 text-text-muted" />}
                onClick={() => setIsReassignModalOpen(true)}
              >
                Reassign
              </Button>
            )}

            {/* STATUS: NEW (Can Start Processing only when assigned) */}
            {ticket.status === 'NEW' && (
              <>
                <Button
                  variant="secondary"
                  size="sm"
                  leftIcon={<SlidersHorizontal className="w-3.5 h-3.5" />}
                  onClick={() => {
                    setNewImpact(ticket.impact);
                    setNewUrgency(ticket.urgency);
                    setIsPriorityFactorsModalOpen(true);
                  }}
                >
                  Adjust Factors
                </Button>
                {ticket.assigneeId ? (
                  <Button
                    variant="primary"
                    size="sm"
                    leftIcon={<Play className="w-3.5 h-3.5 fill-current" />}
                    onClick={handleStartProcessing}
                  >
                    Start Processing
                  </Button>
                ) : null}
                <Button
                  variant="danger"
                  size="sm"
                  leftIcon={<XCircle className="w-3.5 h-3.5" />}
                  onClick={() => setIsCancelModalOpen(true)}
                >
                  Cancel
                </Button>
              </>
            )}

            {/* STATUS: IN_PROGRESS */}
            {ticket.status === 'IN_PROGRESS' && (
              <>
                <Button
                  variant="secondary"
                  size="sm"
                  leftIcon={<Pause className="w-3.5 h-3.5" />}
                  onClick={() => setIsWaitModalOpen(true)}
                >
                  Wait for Employee
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}
                  onClick={() => setIsResolveModalOpen(true)}
                >
                  Resolve
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  leftIcon={<XCircle className="w-3.5 h-3.5" />}
                  onClick={() => setIsCancelModalOpen(true)}
                >
                  Cancel
                </Button>
              </>
            )}

            {/* STATUS: WAITING_FOR_EMPLOYEE */}
            {ticket.status === 'WAITING_FOR_EMPLOYEE' && (
              <>
                <Button
                  variant="primary"
                  size="sm"
                  leftIcon={<Play className="w-3.5 h-3.5 fill-current" />}
                  onClick={() =>
                    dispatch({
                      type: 'RESUME_PROCESSING',
                      payload: {
                        ticketId: ticket.id,
                        actorId: activeUser.id,
                        reason: 'Admin resumed processing based on administrative assessment.',
                      },
                    })
                  }
                >
                  Resume Processing
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  leftIcon={<XCircle className="w-3.5 h-3.5" />}
                  onClick={() => setIsCancelModalOpen(true)}
                >
                  Cancel
                </Button>
              </>
            )}

            {/* STATUS: RESOLVED */}
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
                  onClick={() => setIsAdminCloseModalOpen(true)}
                >
                  Close Ticket
                </Button>
              </>
            )}
          </div>
        }
      />

      {/* 2-COLUMN WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* MAIN COLUMN (2/3) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Issue Description */}
          <div className="bg-bg-surface border border-border rounded-xl p-5 shadow-subtle space-y-2">
            <h4 className="text-caption font-semibold text-text-muted uppercase tracking-wider">
              Issue Description
            </h4>
            <p className="text-body text-text-primary whitespace-pre-wrap leading-relaxed">
              {ticket.description}
            </p>
          </div>

          {/* Conversation & Full History Tabs */}
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
                <span>Communications ({comments.length})</span>
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
                <span>Audit Trail ({historyEntries.length})</span>
              </button>
            </div>

            <div className="p-5">
              {activeTab === 'conversation' && (
                <div className="space-y-5">
                  {comments.length === 0 ? (
                    <p className="text-caption text-text-muted text-center py-6">
                      No communications posted yet.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {comments.map((c) =>
                        c.type === 'INTERNAL' ? (
                          <InternalNoteItem key={c.id} comment={c} />
                        ) : (
                          <CommentItem key={c.id} comment={c} />
                        )
                      )}
                    </div>
                  )}

                  {/* Comment Composer */}
                  {!isTerminal && (
                    <form onSubmit={handlePostComment} className="pt-4 border-t border-border space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center p-0.5 rounded-lg border border-border bg-bg-subtle">
                          <button
                            type="button"
                            onClick={() => setCommentType('PUBLIC')}
                            className={`px-3 py-1 rounded text-caption font-medium transition-all ${
                              commentType === 'PUBLIC'
                                ? 'bg-bg-surface text-text-primary shadow-xs font-semibold'
                                : 'text-text-muted hover:text-text-primary'
                            }`}
                          >
                            Public Reply
                          </button>
                          <button
                            type="button"
                            onClick={() => setCommentType('INTERNAL')}
                            className={`px-3 py-1 rounded text-caption font-medium transition-all flex items-center gap-1 ${
                              commentType === 'INTERNAL'
                                ? 'bg-amber-100 text-amber-900 border border-amber-300 font-semibold'
                                : 'text-text-muted hover:text-text-primary'
                            }`}
                          >
                            <Lock className="w-3 h-3" />
                            Internal Note
                          </button>
                        </div>
                        <span className="text-[11px] text-text-muted">
                          Administrator privileged composer
                        </span>
                      </div>

                      <Textarea
                        placeholder={
                          commentType === 'PUBLIC'
                            ? 'Type public announcement or inquiry...'
                            : 'Type administrative internal note or coordination guidance...'
                        }
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        rows={3}
                        disabled={isSubmittingComment}
                      />

                      <div className="flex items-center justify-between">
                        <span className="text-[11px] text-text-muted">
                          All comments are permanently audited.
                        </span>
                        <Button
                          type="submit"
                          variant="primary"
                          size="sm"
                          isLoading={isSubmittingComment}
                          leftIcon={<Send className="w-3.5 h-3.5" />}
                          disabled={!newComment.trim()}
                        >
                          {commentType === 'INTERNAL' ? 'Save Internal Note' : 'Post Public Reply'}
                        </Button>
                      </div>
                    </form>
                  )}
                </div>
              )}

              {activeTab === 'history' && (
                <div className="space-y-4">
                  <p className="text-caption text-text-muted">
                    Full administrative audit log with complete before → after transitions and operator reasons.
                  </p>
                  <HistoryTimeline entries={historyEntries} />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT METADATA PANEL (1/3) */}
        <div className="space-y-5">
          {/* SLA Overview */}
          <div className="bg-bg-surface border border-border rounded-xl p-5 shadow-subtle space-y-4">
            <h4 className="text-caption font-semibold text-text-muted uppercase tracking-wider">
              SLA Commitments (24/7)
            </h4>

            {/* First Response */}
            <div className="p-3 rounded-lg border border-border bg-bg-subtle/50 space-y-1.5">
              <div className="flex items-center justify-between text-caption">
                <span className="font-medium text-text-secondary">First Response</span>
                <SlaIndicator info={firstResponseSla} size="sm" />
              </div>
              <div className="text-[12px] text-text-muted flex justify-between">
                <span>Target: {ticket.sla.firstResponseTargetMinutes}m</span>
                <span>
                  {ticket.sla.firstResponseAchievedAt
                    ? `Achieved: ${formatDateTime(ticket.sla.firstResponseAchievedAt)}`
                    : `Due: ${formatDateTime(ticket.sla.firstResponseDueAt)}`}
                </span>
              </div>
            </div>

            {/* Resolution */}
            <div className="p-3 rounded-lg border border-border bg-bg-subtle/50 space-y-1.5">
              <div className="flex items-center justify-between text-caption">
                <span className="font-medium text-text-secondary">Resolution</span>
                <SlaIndicator info={resolutionSla} size="sm" />
              </div>
              <div className="text-[12px] text-text-muted flex justify-between">
                <span>Target: {formatMinutes(ticket.sla.resolutionTargetMinutes)}</span>
                <span>Active Elapsed: {formatMinutes(ticket.sla.resolutionElapsedMinutes)}</span>
              </div>
            </div>
          </div>

          {/* Properties */}
          <div className="bg-bg-surface border border-border rounded-xl p-5 shadow-subtle space-y-4">
            <h4 className="text-caption font-semibold text-text-muted uppercase tracking-wider">
              Ticket Administration
            </h4>

            <div className="space-y-3 divide-y divide-border/60 text-body">
              <div className="pt-2 flex items-center justify-between">
                <span className="text-caption font-medium text-text-secondary">Requester</span>
                <span className="text-caption font-semibold text-text-primary">
                  {ticket.creatorName} ({ticket.creatorDepartment})
                </span>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-caption font-medium text-text-secondary">Category</span>
                <span className="text-caption font-medium text-text-primary truncate max-w-[160px]">
                  {ticket.requestTypeName}
                </span>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-caption font-medium text-text-secondary">Priority</span>
                <PriorityBadge priority={ticket.priority} size="sm" showLabel />
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-caption font-medium text-text-secondary">Impact / Urgency</span>
                <span className="text-caption font-medium text-text-primary">
                  {ticket.impact} / {ticket.urgency}
                </span>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-caption font-medium text-text-secondary">Assignee</span>
                <span className="text-caption font-medium text-text-primary">
                  {ticket.assigneeName ? (
                    <span className="font-semibold text-primary">{ticket.assigneeName}</span>
                  ) : (
                    <span className="text-amber-700 font-semibold bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                      Unassigned
                    </span>
                  )}
                </span>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-caption font-medium text-text-secondary">Created</span>
                <span className="text-caption text-text-muted">{formatDateTime(ticket.createdAt)}</span>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-caption font-medium text-text-secondary">Updated</span>
                <span className="text-caption text-text-muted">{formatDateTime(ticket.updatedAt)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ASSIGN MODAL */}
      <Dialog
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        title="Assign Ticket"
        description={`Assign ${ticket.ticketCode} to an active support agent.`}
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={() => setIsAssignModalOpen(false)}>
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
            label="Support Agent *"
            value={assignAgentId}
            onChange={(e) => setAssignAgentId(e.target.value)}
            options={activeAgents.map((a) => ({
              value: a.id,
              label: `${a.name} (${a.department})`,
            }))}
          />
          <p className="text-caption text-text-muted">
            Status will remain NEW upon assignment. Processing starts when an agent or administrator explicitly clicks Start Processing.
          </p>
        </div>
      </Dialog>

      {/* REASSIGN MODAL */}
      <ReassignModal
        isOpen={isReassignModalOpen}
        onClose={() => setIsReassignModalOpen(false)}
        ticketCode={ticket.ticketCode}
        activeAgents={activeAgents}
        currentAssigneeId={ticket.assigneeId}
        onSubmit={(newAgentId, reason) => {
          dispatch({
            type: 'REASSIGN_TICKET',
            payload: {
              ticketId: ticket.id,
              newAgentId,
              adminId: activeUser.id,
              reason,
            },
          });
        }}
      />

      {/* WORKFLOW MODALS */}
      <WaitingQuestionModal
        isOpen={isWaitModalOpen}
        onClose={() => setIsWaitModalOpen(false)}
        ticketCode={ticket.ticketCode}
        onSubmit={(question) => {
          dispatch({
            type: 'WAIT_FOR_EMPLOYEE',
            payload: {
              ticketId: ticket.id,
              actorId: activeUser.id,
              question,
            },
          });
        }}
      />

      <ResolveSolutionModal
        isOpen={isResolveModalOpen}
        onClose={() => setIsResolveModalOpen(false)}
        ticketCode={ticket.ticketCode}
        onSubmit={(solution) => {
          dispatch({
            type: 'RESOLVE_TICKET',
            payload: {
              ticketId: ticket.id,
              actorId: activeUser.id,
              solution,
            },
          });
        }}
      />

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

      {/* ADMIN CLOSE MODAL */}
      <Dialog
        isOpen={isAdminCloseModalOpen}
        onClose={() => setIsAdminCloseModalOpen(false)}
        title="Close Ticket (Administrator Override)"
        description={`Permanently close ${ticket.ticketCode}. Terminal state.`}
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={() => setIsAdminCloseModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleAdminClose}>
              Confirm Closure
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          <Textarea
            label="Administrative Closure Reason *"
            placeholder="Document reasons for closing without requester confirmation..."
            value={adminCloseReason}
            onChange={(e) => setAdminCloseReason(e.target.value)}
            rows={3}
            required
          />
        </div>
      </Dialog>

      {/* ADJUST FACTORS MODAL */}
      <Dialog
        isOpen={isPriorityFactorsModalOpen}
        onClose={() => setIsPriorityFactorsModalOpen(false)}
        title="Adjust Business Priority Factors"
        description="Administrator adjustment of Impact and Urgency. System automatically recalculates Priority."
        maxWidth="lg"
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={() => setIsPriorityFactorsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleSavePriorityFactors}>
              Update Factors
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Impact Level *"
              value={newImpact}
              onChange={(e) => setNewImpact(e.target.value as ImpactLevel)}
              options={[
                { value: 'HIGH', label: 'HIGH (50+ users affected)' },
                { value: 'MEDIUM', label: 'MEDIUM (2–49 users)' },
                { value: 'LOW', label: 'LOW (Single user)' },
              ]}
            />
            <Select
              label="Urgency Level *"
              value={newUrgency}
              onChange={(e) => setNewUrgency(e.target.value as UrgencyLevel)}
              options={[
                { value: 'HIGH', label: 'HIGH (Work blocked)' },
                { value: 'MEDIUM', label: 'MEDIUM (Hindered)' },
                { value: 'LOW', label: 'LOW (Can wait)' },
              ]}
            />
          </div>

          <CalculatedPriority impact={newImpact} urgency={newUrgency} />

          <Textarea
            label="Adjustment Reason *"
            placeholder="Document administrative justification..."
            value={priorityChangeReason}
            onChange={(e) => {
              setPriorityChangeReason(e.target.value);
              if (priorityModalError) setPriorityModalError('');
            }}
            error={priorityModalError}
            rows={3}
            required
          />
        </div>
      </Dialog>
    </div>
  );
}
