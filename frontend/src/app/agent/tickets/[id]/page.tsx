'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Play,
  UserCheck,
  CheckCircle2,
  Clock,
  MessageSquare,
  Lock,
  History,
  AlertTriangle,
  Send,
  SlidersHorizontal,
  Info,
  Layers,
  ShieldCheck,
  Pause,
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
import { WaitingQuestionModal, ResolveSolutionModal } from '@/components/tickets/ActionModals';
import { Dialog } from '@/components/ui/dialog';
import { CalculatedPriority } from '@/components/forms/CalculatedPriority';
import { ImpactLevel, UrgencyLevel } from '@/lib/priority';
import { getFirstResponseSlaDisplay, getResolutionSlaDisplay } from '@/lib/sla';
import { formatDateTime, formatMinutes } from '@/lib/utils';
import { CommentType } from '@/mocks/comments';

export default function AgentTicketDetailPage() {
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
  const [isWaitModalOpen, setIsWaitModalOpen] = useState(false);
  const [isResolveModalOpen, setIsResolveModalOpen] = useState(false);
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const [resumeReason, setResumeReason] = useState('');
  const [isPriorityFactorsModalOpen, setIsPriorityFactorsModalOpen] = useState(false);

  // Update Priority factors modal state
  const [newImpact, setNewImpact] = useState<ImpactLevel>(ticket?.impact || 'MEDIUM');
  const [newUrgency, setNewUrgency] = useState<UrgencyLevel>(ticket?.urgency || 'MEDIUM');
  const [priorityChangeReason, setPriorityChangeReason] = useState('');
  const [priorityModalError, setPriorityModalError] = useState('');

  if (!ticket) {
    return (
      <div className="p-8 text-center space-y-4">
        <p className="text-heading-2 text-text-primary">Ticket Not Found</p>
        <Link href="/agent/queue">
          <Button variant="secondary" size="md">
            Return to Support Queue
          </Button>
        </Link>
      </div>
    );
  }

  // Support Agent sees BOTH public comments and internal notes
  const comments = selectors.getTicketComments(state, ticket.id, activeUser);
  const historyEntries = selectors.getTicketHistory(state, ticket.id);

  const isAssignedToMe = ticket.assigneeId === activeUser.id;
  const isUnassigned = ticket.assigneeId === null;
  const isTerminal = ticket.status === 'CLOSED' || ticket.status === 'CANCELLED';

  const firstResponseSla = getFirstResponseSlaDisplay(ticket.sla);
  const resolutionSla = getResolutionSlaDisplay(ticket.sla, ticket.status);

  // Actions
  const handleTakeTicket = () => {
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

  const handleStartProcessing = () => {
    // Invariant: must have an active assignee
    if (!ticket.assigneeId) {
      alert('Ticket must have an assigned agent before starting processing.');
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

  const handleResumeProcessing = () => {
    if (!resumeReason.trim()) return;

    dispatch({
      type: 'RESUME_PROCESSING',
      payload: {
        ticketId: ticket.id,
        actorId: activeUser.id,
        reason: resumeReason.trim(),
      },
    });

    setResumeReason('');
    setIsResumeModalOpen(false);
  };

  const handleSavePriorityFactors = () => {
    if (!priorityChangeReason.trim()) {
      setPriorityModalError('Reason is mandatory when updating priority factors.');
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
      {/* Header */}
      <PageHeader
        title={ticket.title}
        breadcrumbs={[
          { label: 'OpsFlow', href: '/' },
          { label: 'Support Queue', href: '/agent/queue' },
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
            <Link href="/agent/queue">
              <Button variant="secondary" size="sm" leftIcon={<ArrowLeft className="w-3.5 h-3.5" />}>
                Back to Queue
              </Button>
            </Link>

            {/* ACTION: NEW & UNASSIGNED */}
            {ticket.status === 'NEW' && isUnassigned && (
              <Button
                variant="primary"
                size="sm"
                leftIcon={<UserCheck className="w-3.5 h-3.5" />}
                onClick={handleTakeTicket}
              >
                Take Ticket
              </Button>
            )}

            {/* ACTION: NEW & ASSIGNED TO ME */}
            {ticket.status === 'NEW' && isAssignedToMe && (
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
                <Button
                  variant="primary"
                  size="sm"
                  leftIcon={<Play className="w-3.5 h-3.5 fill-current" />}
                  onClick={handleStartProcessing}
                >
                  Start Processing
                </Button>
              </>
            )}

            {/* ACTION: IN_PROGRESS & ASSIGNED TO ME */}
            {ticket.status === 'IN_PROGRESS' && isAssignedToMe && (
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
                  Resolve Ticket
                </Button>
              </>
            )}

            {/* ACTION: WAITING & ASSIGNED TO ME */}
            {ticket.status === 'WAITING_FOR_EMPLOYEE' && isAssignedToMe && (
              <Button
                variant="primary"
                size="sm"
                leftIcon={<Play className="w-3.5 h-3.5 fill-current" />}
                onClick={() => setIsResumeModalOpen(true)}
              >
                Resume Processing
              </Button>
            )}
          </div>
        }
      />

      {/* STATE BANNER: OTHER AGENT'S TICKET */}
      {!isAssignedToMe && !isUnassigned && (
        <div className="p-3.5 rounded-lg border border-border bg-bg-subtle text-text-secondary flex items-center gap-2.5 text-caption">
          <Info className="w-4 h-4 text-primary shrink-0" />
          <span>
            Assigned to <strong>{ticket.assigneeName}</strong>. You can review this ticket, but only the assigned agent or an administrator can perform workflow operations.
          </span>
        </div>
      )}

      {/* STATE BANNER: WAITING FOR EMPLOYEE */}
      {ticket.status === 'WAITING_FOR_EMPLOYEE' && (
        <div className="p-3.5 rounded-lg border border-amber-300 bg-amber-50 text-amber-950 flex items-center gap-2.5 text-caption">
          <Clock className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            Waiting for employee response. <strong>Resolution SLA is currently paused.</strong> You may proactively resume processing with a reason if necessary.
          </span>
        </div>
      )}

      {/* 2-COLUMN OPERATIONAL WORKSPACE */}
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

          {/* Conversation & History */}
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
                <span>Conversation & Notes ({comments.length})</span>
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
                  {/* Thread */}
                  {comments.length === 0 ? (
                    <p className="text-caption text-text-muted text-center py-6">
                      No communications logged yet.
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
                  {!isTerminal && isAssignedToMe ? (
                    <form onSubmit={handlePostComment} className="pt-4 border-t border-border space-y-3">
                      {/* Mode Toggle: Public vs Internal Note */}
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
                          {commentType === 'PUBLIC'
                            ? 'Visible to requester'
                            : 'Staff only (hidden from requester)'}
                        </span>
                      </div>

                      <Textarea
                        placeholder={
                          commentType === 'PUBLIC'
                            ? 'Type public message for requester...'
                            : 'Type internal diagnostic note or handoff detail (staff only)...'
                        }
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        rows={3}
                        disabled={isSubmittingComment}
                        className={
                          commentType === 'INTERNAL'
                            ? 'border-amber-300 bg-amber-50/20 focus:ring-amber-300'
                            : ''
                        }
                      />

                      <div className="flex items-center justify-between">
                        <span className="text-[11px] text-text-muted">
                          Comments are immutable and cannot be edited or deleted.
                        </span>
                        <Button
                          type="submit"
                          variant={commentType === 'INTERNAL' ? 'secondary' : 'primary'}
                          size="sm"
                          isLoading={isSubmittingComment}
                          leftIcon={<Send className="w-3.5 h-3.5" />}
                          disabled={!newComment.trim()}
                        >
                          {commentType === 'INTERNAL' ? 'Save Internal Note' : 'Send Public Reply'}
                        </Button>
                      </div>
                    </form>
                  ) : isTerminal ? (
                    <div className="p-3 bg-bg-subtle rounded-lg border border-border text-center text-caption text-text-muted">
                      This ticket is {ticket.status.toLowerCase()}. Further entries are locked.
                    </div>
                  ) : null}
                </div>
              )}

              {activeTab === 'history' && (
                <div className="space-y-4">
                  <p className="text-caption text-text-muted">
                    Full business lifecycle and audit event history.
                  </p>
                  <HistoryTimeline entries={historyEntries} />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT METADATA PANEL (1/3) */}
        <div className="space-y-5">
          {/* SLA Tracking Panel */}
          <div className="bg-bg-surface border border-border rounded-xl p-5 shadow-subtle space-y-4">
            <h4 className="text-caption font-semibold text-text-muted uppercase tracking-wider">
              SLA Commitments (24/7)
            </h4>

            {/* First Response SLA */}
            <div className="p-3 rounded-lg border border-border bg-bg-subtle/50 space-y-1.5">
              <div className="flex items-center justify-between text-caption">
                <span className="font-medium text-text-secondary">First Response</span>
                <SlaIndicator info={firstResponseSla} size="sm" />
              </div>
              <div className="text-[12px] text-text-muted flex justify-between">
                <span>Target: {ticket.sla.firstResponseTargetMinutes}m</span>
                <span>
                  {ticket.sla.firstResponseAchievedAt
                    ? `Achieved at ${formatDateTime(ticket.sla.firstResponseAchievedAt)}`
                    : `Due: ${formatDateTime(ticket.sla.firstResponseDueAt)}`}
                </span>
              </div>
            </div>

            {/* Resolution SLA */}
            <div className="p-3 rounded-lg border border-border bg-bg-subtle/50 space-y-1.5">
              <div className="flex items-center justify-between text-caption">
                <span className="font-medium text-text-secondary">Resolution</span>
                <SlaIndicator info={resolutionSla} size="sm" />
              </div>
              <div className="text-[12px] text-text-muted flex justify-between">
                <span>Target: {formatMinutes(ticket.sla.resolutionTargetMinutes)}</span>
                <span>Elapsed: {formatMinutes(ticket.sla.resolutionElapsedMinutes)}</span>
              </div>
              {ticket.status === 'WAITING_FOR_EMPLOYEE' && (
                <p className="text-[11px] text-amber-700 italic pt-0.5">
                  Clock paused while awaiting employee input.
                </p>
              )}
            </div>
          </div>

          {/* Ticket Metadata */}
          <div className="bg-bg-surface border border-border rounded-xl p-5 shadow-subtle space-y-4">
            <h4 className="text-caption font-semibold text-text-muted uppercase tracking-wider">
              Properties
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
                    <span className="text-text-muted italic">Unassigned</span>
                  )}
                </span>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-caption font-medium text-text-secondary">Created At</span>
                <span className="text-caption text-text-muted">{formatDateTime(ticket.createdAt)}</span>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-caption font-medium text-text-secondary">Updated At</span>
                <span className="text-caption text-text-muted">{formatDateTime(ticket.updatedAt)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODALS */}
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

      {/* Resume Processing Modal */}
      <Dialog
        isOpen={isResumeModalOpen}
        onClose={() => setIsResumeModalOpen(false)}
        title="Resume Processing"
        description={`Proactively resume processing ${ticket.ticketCode} back to IN_PROGRESS.`}
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={() => setIsResumeModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleResumeProcessing}>
              Resume Processing
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          <Textarea
            label="Reason for Resuming *"
            placeholder="Explain why processing is being resumed without employee reply..."
            value={resumeReason}
            onChange={(e) => setResumeReason(e.target.value)}
            rows={3}
            required
          />
        </div>
      </Dialog>

      {/* Adjust Priority Factors Modal */}
      <Dialog
        isOpen={isPriorityFactorsModalOpen}
        onClose={() => setIsPriorityFactorsModalOpen(false)}
        title="Update Priority Factors"
        description="Support Agents may adjust Impact and Urgency. System recalculates Priority according to company matrix."
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
            placeholder="Document why impact or urgency was adjusted..."
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
