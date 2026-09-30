import React from 'react';
import { Lock } from 'lucide-react';
import { Comment } from '@/mocks/comments';
import { formatDateTime } from '@/lib/utils';

export interface InternalNoteItemProps {
  comment: Comment;
}

export function InternalNoteItem({ comment }: InternalNoteItemProps) {
  return (
    <div className="flex gap-3 p-3.5 rounded-lg border border-[#FDE68A] bg-[#FFFDF5] text-text-primary shadow-subtle relative overflow-hidden">
      <div className="absolute top-0 right-0 w-24 h-24 bg-amber-200/20 rounded-full blur-xl pointer-events-none" />
      <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-medium text-caption shrink-0 border border-amber-300">
        <Lock className="w-3.5 h-3.5" />
      </div>
      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-body-medium font-semibold text-amber-950">
              {comment.authorName}
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full border border-amber-300 bg-amber-100 text-amber-900 font-medium">
              <Lock className="w-2.5 h-2.5" />
              Internal note · Staff only
            </span>
          </div>
          <span className="text-caption text-amber-800/70">{formatDateTime(comment.createdAt)}</span>
        </div>
        <p className="text-body text-amber-950/90 whitespace-pre-wrap leading-relaxed">
          {comment.content}
        </p>
      </div>
    </div>
  );
}
