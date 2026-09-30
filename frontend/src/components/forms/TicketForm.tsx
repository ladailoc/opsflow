'use client';

import React, { useState } from 'react';
import { ImpactLevel, UrgencyLevel, IMPACT_DESCRIPTIONS, URGENCY_DESCRIPTIONS } from '@/lib/priority';
import { RequestType } from '@/mocks/request-types';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { CalculatedPriority } from './CalculatedPriority';
import { PriorityMatrixHelp } from './PriorityMatrixHelp';

export interface TicketFormData {
  title: string;
  description: string;
  requestTypeId: string;
  impact: ImpactLevel;
  urgency: UrgencyLevel;
}

export interface TicketFormProps {
  initialData?: Partial<TicketFormData>;
  requestTypes: RequestType[];
  onSubmit: (data: TicketFormData) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
  submitLabel?: string;
  isEdit?: boolean;
}

export function TicketForm({
  initialData,
  requestTypes,
  onSubmit,
  onCancel,
  isSubmitting = false,
  submitLabel = 'Submit Ticket',
  isEdit = false,
}: TicketFormProps) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [requestTypeId, setRequestTypeId] = useState(
    initialData?.requestTypeId || requestTypes[0]?.id || ''
  );
  const [impact, setImpact] = useState<ImpactLevel>(initialData?.impact || 'MEDIUM');
  const [urgency, setUrgency] = useState<UrgencyLevel>(initialData?.urgency || 'MEDIUM');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required';
    } else if (title.trim().length < 5) {
      newErrors.title = 'Title must be at least 5 characters';
    }

    if (!description.trim()) {
      newErrors.description = 'Description is required';
    } else if (description.trim().length < 10) {
      newErrors.description = 'Please describe the issue in more detail (min 10 chars)';
    }

    if (!requestTypeId) {
      newErrors.requestTypeId = 'Please select a request category';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    onSubmit({
      title: title.trim(),
      description: description.trim(),
      requestTypeId,
      impact,
      urgency,
    });
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-5 bg-bg-surface p-6 rounded-lg border border-border shadow-subtle max-w-3xl">
        <div className="space-y-1 pb-2 border-b border-border">
          <h3 className="text-heading-2 text-text-primary">
            {isEdit ? 'Edit Ticket Information' : 'Create IT Support Request'}
          </h3>
          <p className="text-caption text-text-secondary">
            {isEdit
              ? 'You can update information while the ticket is in status NEW. Priority will be automatically recalculated.'
              : 'Submit a new issue or request to the IT Operations team. Priority is calculated automatically.'}
          </p>
        </div>

        {/* Title */}
        <Input
          label="Title / Summary *"
          placeholder="e.g. Cannot connect to DA NANG VPN cluster from workstation"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (errors.title) setErrors((prev) => ({ ...prev, title: '' }));
          }}
          error={errors.title}
          disabled={isSubmitting}
          required
        />

        {/* Request Type */}
        <Select
          label="Request Type *"
          value={requestTypeId}
          onChange={(e) => {
            setRequestTypeId(e.target.value);
            if (errors.requestTypeId) setErrors((prev) => ({ ...prev, requestTypeId: '' }));
          }}
          options={requestTypes.map((r) => ({
            value: r.id,
            label: r.name,
            disabled: r.status === 'INACTIVE',
          }))}
          error={errors.requestTypeId}
          disabled={isSubmitting}
        />

        {/* Description */}
        <Textarea
          label="Detailed Description *"
          placeholder="Provide specific details, error messages, room/desk number, affected device..."
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
            if (errors.description) setErrors((prev) => ({ ...prev, description: '' }));
          }}
          error={errors.description}
          rows={5}
          disabled={isSubmitting}
          required
        />

        {/* Impact & Urgency Grids */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {/* Impact */}
          <div className="space-y-1.5">
            <label className="block text-label font-medium text-text-primary">
              Impact (Scope of disruption) *
            </label>
            <div className="space-y-2">
              {(['HIGH', 'MEDIUM', 'LOW'] as ImpactLevel[]).map((lvl) => (
                <label
                  key={lvl}
                  className={`flex items-start gap-2.5 p-2.5 rounded-md border text-caption cursor-pointer transition-colors ${
                    impact === lvl
                      ? 'border-primary bg-blue-50/40 text-text-primary'
                      : 'border-border bg-bg-surface hover:bg-bg-subtle text-text-secondary'
                  }`}
                >
                  <input
                    type="radio"
                    name="impact"
                    value={lvl}
                    checked={impact === lvl}
                    onChange={() => setImpact(lvl)}
                    className="mt-0.5 text-primary focus:ring-primary-focus"
                    disabled={isSubmitting}
                  />
                  <div>
                    <span className="font-semibold block text-text-primary">{lvl}</span>
                    <span className="text-[12px] text-text-muted">{IMPACT_DESCRIPTIONS[lvl]}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Urgency */}
          <div className="space-y-1.5">
            <label className="block text-label font-medium text-text-primary">
              Urgency (Time sensitivity) *
            </label>
            <div className="space-y-2">
              {(['HIGH', 'MEDIUM', 'LOW'] as UrgencyLevel[]).map((lvl) => (
                <label
                  key={lvl}
                  className={`flex items-start gap-2.5 p-2.5 rounded-md border text-caption cursor-pointer transition-colors ${
                    urgency === lvl
                      ? 'border-primary bg-blue-50/40 text-text-primary'
                      : 'border-border bg-bg-surface hover:bg-bg-subtle text-text-secondary'
                  }`}
                >
                  <input
                    type="radio"
                    name="urgency"
                    value={lvl}
                    checked={urgency === lvl}
                    onChange={() => setUrgency(lvl)}
                    className="mt-0.5 text-primary focus:ring-primary-focus"
                    disabled={isSubmitting}
                  />
                  <div>
                    <span className="font-semibold block text-text-primary">{lvl}</span>
                    <span className="text-[12px] text-text-muted">{URGENCY_DESCRIPTIONS[lvl]}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Calculated Priority Preview (Read-Only) */}
        <CalculatedPriority
          impact={impact}
          urgency={urgency}
          onHelpClick={() => setIsHelpOpen(true)}
        />

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
          {onCancel && (
            <Button type="button" variant="secondary" onClick={onCancel} disabled={isSubmitting}>
              Cancel
            </Button>
          )}
          <Button type="submit" variant="primary" isLoading={isSubmitting}>
            {submitLabel}
          </Button>
        </div>
      </form>

      {/* Priority Matrix Reference Modal */}
      <PriorityMatrixHelp isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </>
  );
}
