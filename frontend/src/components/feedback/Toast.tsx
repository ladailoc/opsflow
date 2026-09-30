'use client';

import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import { usePrototype } from '@/prototype/PrototypeProvider';
import { cn } from '@/lib/utils';

export function ToastContainer() {
  const { state, dispatch } = usePrototype();
  const toast = state.toast;

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        dispatch({ type: 'DISMISS_TOAST' });
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast, dispatch]);

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />,
    warning: <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />,
    error: <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />,
    info: <Info className="w-4 h-4 text-blue-600 shrink-0" />,
  };

  const borders = {
    success: 'border-emerald-200 bg-emerald-50/90 text-emerald-950',
    warning: 'border-amber-200 bg-amber-50/90 text-amber-950',
    error: 'border-red-200 bg-red-50/90 text-red-950',
    info: 'border-blue-200 bg-blue-50/90 text-blue-950',
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm w-full animate-in fade-in slide-in-from-bottom-2">
      <div
        className={cn(
          'flex items-start gap-3 p-3.5 rounded-lg border shadow-lg backdrop-blur-sm',
          borders[toast.type]
        )}
      >
        {icons[toast.type]}
        <div className="flex-1 space-y-0.5">
          <p className="text-caption font-semibold leading-tight">{toast.title}</p>
          <p className="text-caption text-text-secondary leading-tight">{toast.message}</p>
        </div>
        <button
          onClick={() => dispatch({ type: 'DISMISS_TOAST' })}
          className="text-text-muted hover:text-text-primary p-0.5 rounded transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
