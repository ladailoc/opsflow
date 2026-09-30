'use client';

import React, { useState } from 'react';
import { AlertCircle, RefreshCw, FileText, Copy, Check } from 'lucide-react';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { usePrototype } from '@/prototype/PrototypeProvider';

export function ConflictDialog() {
  const { state, dispatch } = usePrototype();
  const modal = state.conflictModal;
  const [copied, setCopied] = useState(false);

  if (!modal) return null;

  const handleReload = () => {
    dispatch({ type: 'CLOSE_CONFLICT_MODAL' });
  };

  const handleCopyDraft = () => {
    if (!modal.draftData) return;
    const textToCopy = `Title: ${modal.draftData.title || ''}\nDescription: ${modal.draftData.description || ''}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog
      isOpen={!!modal}
      onClose={() => dispatch({ type: 'CLOSE_CONFLICT_MODAL' })}
      title={
        <div className="flex items-center gap-2 text-amber-700">
          <AlertCircle className="w-5 h-5 shrink-0 text-amber-600" />
          <span>{modal.title}</span>
        </div>
      }
      footer={
        <div className="flex items-center justify-end gap-2 w-full">
          {modal.draftData && (
            <Button
              variant="secondary"
              size="md"
              leftIcon={copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              onClick={handleCopyDraft}
            >
              {copied ? 'Draft Copied!' : 'Copy Draft'}
            </Button>
          )}
          <Button
            variant="primary"
            size="md"
            leftIcon={<RefreshCw className="w-4 h-4" />}
            onClick={handleReload}
          >
            Reload Ticket
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <div>
          <p className="text-body-medium font-semibold text-text-primary leading-snug">
            {modal.message}
          </p>
          {modal.supportingMessage && (
            <p className="text-body text-text-secondary mt-1">
              {modal.supportingMessage}
            </p>
          )}
        </div>

        {modal.draftData && (
          <div className="p-3.5 bg-bg-subtle border border-border rounded-lg space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-caption font-semibold text-text-secondary">
                <FileText className="w-4 h-4 text-primary" />
                <span>Your Draft Content (Preserved)</span>
              </div>
              <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-medium">
                Not Discarded
              </span>
            </div>
            <div className="text-caption text-text-secondary space-y-1.5 font-mono text-[12px] bg-bg-surface p-2.5 rounded border border-border">
              {modal.draftData.title && (
                <div>
                  <strong className="text-text-primary font-sans">Title:</strong> {modal.draftData.title}
                </div>
              )}
              {modal.draftData.description && (
                <div>
                  <strong className="text-text-primary font-sans">Description:</strong> {modal.draftData.description}
                </div>
              )}
            </div>
            <p className="text-[12px] text-text-muted">
              Your draft changes are preserved. You can copy this text and post it as a Public Comment once the ticket is reloaded.
            </p>
          </div>
        )}

        <div className="p-3 rounded-lg bg-blue-50/80 border border-blue-200 text-caption text-blue-900 leading-relaxed">
          <strong>Concurrency Protection:</strong> OpsFlow prevents silent overwrites when another team member or agent updates the ticket while you are viewing or editing it.
        </div>
      </div>
    </Dialog>
  );
}
