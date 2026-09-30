import React from 'react';
import { cn } from '@/lib/utils';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  error?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, helperText, error, id, disabled, rows = 4, ...props }, ref) => {
    const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1">
        {label && (
          <label htmlFor={textareaId} className="block text-label font-medium text-text-primary">
            {label}
          </label>
        )}
        <textarea
          id={textareaId}
          ref={ref}
          rows={rows}
          disabled={disabled}
          className={cn(
            'w-full p-2.5 rounded-md bg-bg-surface border text-body text-text-primary placeholder:text-text-muted transition-colors resize-y',
            'focus:outline-none focus:ring-2 focus:ring-primary-focus focus:border-primary',
            error ? 'border-red-500 focus:ring-red-300' : 'border-border hover:border-border-strong',
            disabled && 'bg-bg-subtle text-text-muted cursor-not-allowed border-border',
            className
          )}
          {...props}
        />
        {error ? (
          <p className="text-caption text-red-600 font-medium">{error}</p>
        ) : helperText ? (
          <p className="text-caption text-text-muted">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
