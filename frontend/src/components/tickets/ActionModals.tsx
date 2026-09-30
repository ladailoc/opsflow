'use client';

import React, { useState } from 'react';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { User } from '@/mocks/users';
import { CalculatedPriority } from '@/components/forms/CalculatedPriority';
import { ImpactLevel, UrgencyLevel } from '@/lib/priority';

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticketCode: string;
}

// 1. Waiting for Employee Question Modal
export function WaitingQuestionModal({
  isOpen,
  onClose,
  onSubmit,
  ticketCode,
}: BaseModalProps & { onSubmit: (question: string) => void }) {
  const [question, setQuestion] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!question.trim()) {
      setError('Please provide the question or required information.');
      return;
    }
    onSubmit(question.trim());
    setQuestion('');
    setError('');
    onClose();
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Request Employee Information"
      description={`Move ${ticketCode} to Waiting for Employee. Resolution SLA will pause.`}
      footer={
        <>
          <Button variant="secondary" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={handleSubmit}>
            Send Question & Pause SLA
          </Button>
        </>
      }
    >
      <div className="space-y-3">
        <Textarea
          label="Question for Requester (Public Comment)"
          placeholder="e.g. Please provide your department budget code or verify error code..."
          value={question}
          onChange={(e) => {
            setQuestion(e.target.value);
            if (error) setError('');
          }}
          error={error}
          rows={3}
          required
        />
        <p className="text-caption text-text-muted">
          This question will be posted as a Public Comment. When the requester replies, the ticket automatically returns to IN_PROGRESS.
        </p>
      </div>
    </Dialog>
  );
}

// 2. Resolve Ticket Modal
export function ResolveSolutionModal({
  isOpen,
  onClose,
  onSubmit,
  ticketCode,
}: BaseModalProps & { onSubmit: (solution: string) => void }) {
  const [solution, setSolution] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!solution.trim()) {
      setError('A public solution description is required to resolve this ticket.');
      return;
    }
    onSubmit(solution.trim());
    setSolution('');
    setError('');
    onClose();
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Resolve Ticket"
      description={`Provide the public solution summary for ${ticketCode}.`}
      footer={
        <>
          <Button variant="secondary" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={handleSubmit}>
            Confirm Resolution
          </Button>
        </>
      }
    >
      <div className="space-y-3">
        <Textarea
          label="Public Resolution Details"
          placeholder="Describe how the problem was resolved so the requester can verify..."
          value={solution}
          onChange={(e) => {
            setSolution(e.target.value);
            if (error) setError('');
          }}
          error={error}
          rows={4}
          required
        />
        <p className="text-caption text-text-muted">
          The requester will receive this resolution and can either Confirm & Close or Reopen if the problem persists.
        </p>
      </div>
    </Dialog>
  );
}

// 3. Cancel Ticket Modal
export function CancelTicketModal({
  isOpen,
  onClose,
  onSubmit,
  ticketCode,
}: BaseModalProps & { onSubmit: (reason: string) => void }) {
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!reason.trim()) {
      setError('Please provide a mandatory cancellation reason.');
      return;
    }
    onSubmit(reason.trim());
    setReason('');
    setError('');
    onClose();
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Cancel Ticket"
      description={`Are you sure you want to cancel ${ticketCode}? Cancellation is a terminal state.`}
      footer={
        <>
          <Button variant="secondary" size="sm" onClick={onClose}>
            Keep Ticket
          </Button>
          <Button variant="danger" size="sm" onClick={handleSubmit}>
            Cancel Ticket
          </Button>
        </>
      }
    >
      <div className="space-y-3">
        <Textarea
          label="Cancellation Reason"
          placeholder="e.g. Issue resolved independently, duplicate of IT-2026-00120..."
          value={reason}
          onChange={(e) => {
            setReason(e.target.value);
            if (error) setError('');
          }}
          error={error}
          rows={3}
          required
        />
      </div>
    </Dialog>
  );
}

// 4. Reopen Ticket Modal
export function ReopenTicketModal({
  isOpen,
  onClose,
  onSubmit,
  ticketCode,
}: BaseModalProps & { onSubmit: (reason: string) => void }) {
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!reason.trim()) {
      setError('Please describe why this issue is not fully resolved.');
      return;
    }
    onSubmit(reason.trim());
    setReason('');
    setError('');
    onClose();
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Reopen Ticket"
      description={`Reopen ${ticketCode} to IN_PROGRESS. Resolution SLA will resume.`}
      footer={
        <>
          <Button variant="secondary" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={handleSubmit}>
            Reopen Ticket
          </Button>
        </>
      }
    >
      <div className="space-y-3">
        <Textarea
          label="Reason for Reopening"
          placeholder="Explain what is still not working or why the previous solution was incomplete..."
          value={reason}
          onChange={(e) => {
            setReason(e.target.value);
            if (error) setError('');
          }}
          error={error}
          rows={3}
          required
        />
      </div>
    </Dialog>
  );
}

// 5. Admin Reassign Modal
export function ReassignModal({
  isOpen,
  onClose,
  onSubmit,
  ticketCode,
  activeAgents,
  currentAssigneeId,
}: BaseModalProps & {
  onSubmit: (newAgentId: string, reason: string) => void;
  activeAgents: User[];
  currentAssigneeId?: string | null;
}) {
  const [selectedAgent, setSelectedAgent] = useState(
    activeAgents.find((a) => a.id !== currentAssigneeId)?.id || activeAgents[0]?.id || ''
  );
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!selectedAgent) {
      setError('Please select an active Support Agent.');
      return;
    }
    if (!reason.trim()) {
      setError('Please state the reason for reassignment.');
      return;
    }
    onSubmit(selectedAgent, reason.trim());
    setReason('');
    setError('');
    onClose();
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Reassign Ticket"
      description={`Transfer primary responsibility of ${ticketCode} to another active agent.`}
      footer={
        <>
          <Button variant="secondary" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={handleSubmit}>
            Reassign
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <Select
          label="New Assignee"
          value={selectedAgent}
          onChange={(e) => setSelectedAgent(e.target.value)}
          options={activeAgents.map((a) => ({
            value: a.id,
            label: `${a.name} (${a.department})`,
          }))}
        />
        <Textarea
          label="Reassignment Reason"
          placeholder="e.g. Reassigned to specialist in hardware network switches..."
          value={reason}
          onChange={(e) => {
            setReason(e.target.value);
            if (error) setError('');
          }}
          error={error}
          rows={3}
          required
        />
        <p className="text-caption text-text-muted">
          Reassignment retains the current ticket status and accumulated SLA duration.
        </p>
      </div>
    </Dialog>
  );
}

// 6. Assign Ticket Modal (Active Support Agents only)
export function AssignTicketModal({
  isOpen,
  onClose,
  onSubmit,
  ticketCode,
  activeAgents,
}: BaseModalProps & {
  onSubmit: (agentId: string) => void;
  activeAgents: User[];
}) {
  const [selectedAgent, setSelectedAgent] = useState(activeAgents[0]?.id || '');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!selectedAgent) {
      setError('Please select an active Support Agent.');
      return;
    }
    onSubmit(selectedAgent);
    setError('');
    onClose();
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Assign Ticket"
      description={`Assign primary responsibility for ${ticketCode} to an active support agent.`}
      footer={
        <>
          <Button variant="secondary" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={handleSubmit}>
            Assign Ticket
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <Select
          label="Assignee (Active Support Agents Only) *"
          value={selectedAgent}
          onChange={(e) => {
            setSelectedAgent(e.target.value);
            if (error) setError('');
          }}
          options={activeAgents.map((a) => ({
            value: a.id,
            label: `${a.name} (${a.department})`,
          }))}
          error={error}
        />
        <p className="text-caption text-text-muted">
          Only currently active Support Agents are eligible for ticket assignment.
        </p>
      </div>
    </Dialog>
  );
}

// 7. Update Impact & Urgency Modal (No direct Priority edit)
export function UpdateImpactUrgencyModal({
  isOpen,
  onClose,
  onSubmit,
  ticketCode,
  initialImpact,
  initialUrgency,
}: BaseModalProps & {
  onSubmit: (impact: ImpactLevel, urgency: UrgencyLevel, reason: string) => void;
  initialImpact: ImpactLevel;
  initialUrgency: UrgencyLevel;
}) {
  const [impact, setImpact] = useState<ImpactLevel>(initialImpact);
  const [urgency, setUrgency] = useState<UrgencyLevel>(initialUrgency);
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!reason.trim()) {
      setError('Please provide an adjustment reason.');
      return;
    }
    onSubmit(impact, urgency, reason.trim());
    setReason('');
    setError('');
    onClose();
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Update Impact & Urgency"
      description={`Adjust severity factors for ${ticketCode}. Priority is automatically calculated by the matrix.`}
      maxWidth="lg"
      footer={
        <>
          <Button variant="secondary" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={handleSubmit}>
            Update Factors
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Impact Level *"
            value={impact}
            onChange={(e) => setImpact(e.target.value as ImpactLevel)}
            options={[
              { value: 'HIGH', label: 'HIGH (50+ users affected)' },
              { value: 'MEDIUM', label: 'MEDIUM (2–49 users)' },
              { value: 'LOW', label: 'LOW (Single user)' },
            ]}
          />
          <Select
            label="Urgency Level *"
            value={urgency}
            onChange={(e) => setUrgency(e.target.value as UrgencyLevel)}
            options={[
              { value: 'HIGH', label: 'HIGH (Work blocked)' },
              { value: 'MEDIUM', label: 'MEDIUM (Hindered)' },
              { value: 'LOW', label: 'LOW (Can wait)' },
            ]}
          />
        </div>

        <CalculatedPriority impact={impact} urgency={urgency} />

        <Textarea
          label="Adjustment Reason *"
          placeholder="Document the operational rationale for adjusting impact or urgency..."
          value={reason}
          onChange={(e) => {
            setReason(e.target.value);
            if (error) setError('');
          }}
          error={error}
          rows={3}
          required
        />
      </div>
    </Dialog>
  );
}

// 8. Admin Close Modal (with Reason)
export function AdminCloseModal({
  isOpen,
  onClose,
  onSubmit,
  ticketCode,
}: BaseModalProps & { onSubmit: (reason: string) => void }) {
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!reason.trim()) {
      setError('Administrative close requires a mandatory reason.');
      return;
    }
    onSubmit(reason.trim());
    setReason('');
    setError('');
    onClose();
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Admin Close Ticket"
      description={`Permanently close ${ticketCode} as Administrator. Closed tickets cannot be reopened.`}
      footer={
        <>
          <Button variant="secondary" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="danger" size="sm" onClick={handleSubmit}>
            Close Ticket
          </Button>
        </>
      }
    >
      <div className="space-y-3">
        <Textarea
          label="Close Reason *"
          placeholder="Document administrative sign-off reason or verification notes..."
          value={reason}
          onChange={(e) => {
            setReason(e.target.value);
            if (error) setError('');
          }}
          error={error}
          rows={3}
          required
        />
      </div>
    </Dialog>
  );
}

// 9. Employee Confirm & Close Modal
export function ConfirmCloseModal({
  isOpen,
  onClose,
  onConfirm,
  ticketCode,
}: BaseModalProps & { onConfirm: () => void }) {
  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Confirm & Close Ticket"
      description={`Are you satisfied with the resolution for ${ticketCode}?`}
      footer={
        <>
          <Button variant="secondary" size="sm" onClick={onClose}>
            Not Yet
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            Confirm & Close
          </Button>
        </>
      }
    >
      <div className="space-y-3">
        <p className="text-body text-text-secondary leading-relaxed">
          Closing this ticket confirms that your request has been resolved to your satisfaction. Once closed, this ticket moves to permanent archive status.
        </p>
      </div>
    </Dialog>
  );
}

