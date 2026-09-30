'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { usePrototype } from '@/prototype/PrototypeProvider';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { CalculatedPriority } from '@/components/forms/CalculatedPriority';
import { PriorityMatrixHelp } from '@/components/forms/PriorityMatrixHelp';
import { ImpactLevel, UrgencyLevel, calculatePriority, PRIORITY_CONFIG } from '@/lib/priority';
import { ArrowLeft, Sparkles, AlertCircle } from 'lucide-react';

export default function CreateTicketPage() {
  const router = useRouter();
  const { state, dispatch, activeUser } = usePrototype();

  const [title, setTitle] = useState('');
  const [requestTypeId, setRequestTypeId] = useState(
    state.requestTypes.find((r) => r.status === 'ACTIVE')?.id || state.requestTypes[0]?.id || ''
  );
  const [description, setDescription] = useState('');
  const [impact, setImpact] = useState<ImpactLevel | null>(null);
  const [urgency, setUrgency] = useState<UrgencyLevel | null>(null);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMatrixHelpOpen, setIsMatrixHelpOpen] = useState(false);

  const calculatedPriority = impact && urgency ? calculatePriority(impact, urgency) : null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required';
    } else if (title.trim().length < 5) {
      newErrors.title = 'Title must be at least 5 characters long';
    }

    if (!requestTypeId) {
      newErrors.requestTypeId = 'Please select a request category';
    }

    if (!description.trim()) {
      newErrors.description = 'Please provide a detailed description of the problem';
    } else if (description.trim().length < 15) {
      newErrors.description = 'Description must be at least 15 characters to explain the issue clearly';
    }

    if (!impact) {
      newErrors.impact = 'Please select an impact level';
    }

    if (!urgency) {
      newErrors.urgency = 'Please select an urgency level';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    setTimeout(() => {
      dispatch({
        type: 'CREATE_TICKET',
        payload: {
          title: title.trim(),
          description: description.trim(),
          requestTypeId,
          impact: impact!,
          urgency: urgency!,
          creatorId: activeUser.id,
        },
      });

      setIsSubmitting(false);
      router.push('/employee/tickets');
    }, 400);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <PageHeader
        title="Create a ticket"
        description="Submit a request to the IT Support team."
        breadcrumbs={[
          { label: 'OpsFlow', href: '/' },
          { label: 'My Tickets', href: '/employee/tickets' },
          { label: 'Create a ticket' },
        ]}
        actions={
          <Link href="/employee/tickets">
            <Button variant="secondary" size="sm" leftIcon={<ArrowLeft className="w-3.5 h-3.5" />}>
              Back to My Tickets
            </Button>
          </Link>
        }
      />

      <form onSubmit={handleSubmit} className="space-y-6 bg-bg-surface border border-border rounded-xl p-6 shadow-subtle">
        {/* SECTION 1 – Request Details */}
        <div className="space-y-4">
          <div className="border-b border-border/80 pb-2">
            <h3 className="text-heading-2 font-semibold text-text-primary">
              1. Request Details
            </h3>
            <p className="text-caption text-text-muted">
              Summarize your issue so the support team can triage and reproduce it.
            </p>
          </div>

          <Input
            label="Title *"
            placeholder="e.g. Cannot connect to Da Nang office VPN gateway"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (errors.title) setErrors((prev) => ({ ...prev, title: '' }));
            }}
            error={errors.title}
            helperText="Provide a brief, specific summary of the problem."
            disabled={isSubmitting}
            required
          />

          <Select
            label="Request Type *"
            value={requestTypeId}
            onChange={(e) => {
              setRequestTypeId(e.target.value);
              if (errors.requestTypeId) setErrors((prev) => ({ ...prev, requestTypeId: '' }));
            }}
            options={state.requestTypes.map((r) => ({
              value: r.id,
              label: r.name,
              disabled: r.status === 'INACTIVE',
            }))}
            error={errors.requestTypeId}
            disabled={isSubmitting}
          />

          <Textarea
            label="Description *"
            placeholder="Describe what happened, what device or software is affected, steps to reproduce, or any error message..."
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
        </div>

        {/* SECTION 2 – Business Impact & Urgency */}
        <div className="space-y-4 pt-4 border-t border-border">
          <div className="border-b border-border/80 pb-2">
            <h3 className="text-heading-2 font-semibold text-text-primary">
              2. Business Impact & Urgency
            </h3>
            <p className="text-caption text-text-muted">
              These factors determine the SLA and processing priority according to company guidelines.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Impact */}
            <div className="space-y-2">
              <label className="block text-label font-medium text-text-primary">
                Impact (Who is affected?) *
              </label>
              <div className="space-y-2">
                {[
                  { level: 'HIGH', label: 'High', desc: 'Affects 50+ people or a company-wide service' },
                  { level: 'MEDIUM', label: 'Medium', desc: 'Affects 2–49 people' },
                  { level: 'LOW', label: 'Low', desc: 'Affects only me' },
                ].map((item) => (
                  <label
                    key={item.level}
                    className={`flex items-start gap-3 p-3 rounded-lg border text-caption cursor-pointer transition-all ${
                      impact === item.level
                        ? 'border-primary bg-blue-50/50 shadow-xs'
                        : 'border-border bg-bg-surface hover:bg-bg-subtle/80'
                    }`}
                  >
                    <input
                      type="radio"
                      name="impact"
                      value={item.level}
                      checked={impact === item.level}
                      onChange={() => {
                        setImpact(item.level as ImpactLevel);
                        if (errors.impact) setErrors((prev) => ({ ...prev, impact: '' }));
                      }}
                      className="mt-0.5 text-primary focus:ring-primary-focus cursor-pointer"
                      disabled={isSubmitting}
                    />
                    <div>
                      <span className="font-semibold block text-text-primary">{item.label}</span>
                      <span className="text-[12px] text-text-secondary">{item.desc}</span>
                    </div>
                  </label>
                ))}
              </div>
              {errors.impact && (
                <p className="text-caption text-red-600 font-medium">{errors.impact}</p>
              )}
            </div>

            {/* Urgency */}
            <div className="space-y-2">
              <label className="block text-label font-medium text-text-primary">
                Urgency (Time sensitivity) *
              </label>
              <div className="space-y-2">
                {[
                  { level: 'HIGH', label: 'High', desc: 'Work is blocked or needs immediate attention' },
                  { level: 'MEDIUM', label: 'Medium', desc: 'Work is affected but a workaround may exist' },
                  { level: 'LOW', label: 'Low', desc: 'Can wait / Planned request' },
                ].map((item) => (
                  <label
                    key={item.level}
                    className={`flex items-start gap-3 p-3 rounded-lg border text-caption cursor-pointer transition-all ${
                      urgency === item.level
                        ? 'border-primary bg-blue-50/50 shadow-xs'
                        : 'border-border bg-bg-surface hover:bg-bg-subtle/80'
                    }`}
                  >
                    <input
                      type="radio"
                      name="urgency"
                      value={item.level}
                      checked={urgency === item.level}
                      onChange={() => {
                        setUrgency(item.level as UrgencyLevel);
                        if (errors.urgency) setErrors((prev) => ({ ...prev, urgency: '' }));
                      }}
                      className="mt-0.5 text-primary focus:ring-primary-focus cursor-pointer"
                      disabled={isSubmitting}
                    />
                    <div>
                      <span className="font-semibold block text-text-primary">{item.label}</span>
                      <span className="text-[12px] text-text-secondary">{item.desc}</span>
                    </div>
                  </label>
                ))}
              </div>
              {errors.urgency && (
                <p className="text-caption text-red-600 font-medium">{errors.urgency}</p>
              )}
            </div>
          </div>
        </div>

        {/* SECTION 3 – Calculated Priority (READ-ONLY) */}
        <div className="space-y-3 pt-4 border-t border-border">
          <div className="border-b border-border/80 pb-2 flex items-center justify-between">
            <div>
              <h3 className="text-heading-2 font-semibold text-text-primary">
                3. Calculated Priority
              </h3>
              <p className="text-caption text-text-muted">
                Priority is calculated automatically from Impact and Urgency. It cannot be set directly.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsMatrixHelpOpen(true)}
              className="text-caption text-primary hover:underline font-medium inline-flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5" />
              View Matrix Guidelines
            </button>
          </div>

          {calculatedPriority ? (
            <CalculatedPriority
              impact={impact!}
              urgency={urgency!}
              onHelpClick={() => setIsMatrixHelpOpen(true)}
            />
          ) : (
            <div className="p-4 rounded-lg border border-dashed border-border bg-bg-subtle/50 text-center space-y-1">
              <p className="text-body font-medium text-text-secondary">
                Calculated Priority: <span className="font-bold text-text-primary">—</span>
              </p>
              <p className="text-caption text-text-muted">
                Select both Impact and Urgency above to calculate the SLA priority.
              </p>
            </div>
          )}
        </div>

        {/* ACTIONS */}
        <div className="flex items-center justify-between pt-5 border-t border-border">
          <Link href="/employee/tickets">
            <Button type="button" variant="secondary" size="md" disabled={isSubmitting}>
              Cancel
            </Button>
          </Link>
          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={isSubmitting}
          >
            Create Ticket
          </Button>
        </div>
      </form>

      {/* Priority Matrix Information Modal */}
      <PriorityMatrixHelp
        isOpen={isMatrixHelpOpen}
        onClose={() => setIsMatrixHelpOpen(false)}
      />
    </div>
  );
}
