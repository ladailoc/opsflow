import React from 'react';
import { User, MessageSquare } from 'lucide-react';
import { Comment } from '@/mocks/comments';
import { formatDateTime } from '@/lib/utils';

export interface CommentItemProps {
  comment: Comment;
}

export function CommentItem({ comment }: CommentItemProps) {
  const isAgent = comment.authorRole === 'SUPPORT_AGENT';
  const isAdmin = comment.authorRole === 'ADMINISTRATOR';

  return (
    <div className="flex gap-3 p-3.5 rounded-lg border border-border bg-bg-surface text-text-primary shadow-subtle">
      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-medium text-caption shrink-0">
        {comment.authorName.slice(0, 2).toUpperCase()}
      </div>
      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-body-medium font-semibold text-text-primary">
              {comment.authorName}
            </span>
            <span className="text-[11px] px-1.5 py-0.2 rounded border bg-bg-subtle text-text-muted">
              {comment.authorRole === 'SUPPORT_AGENT'
                ? 'Support Agent'
                : comment.authorRole === 'ADMINISTRATOR'
                ? 'Admin'
                : 'Employee'}
            </span>
          </div>
          <span className="text-caption text-text-muted">{formatDateTime(comment.createdAt)}</span>
        </div>
        <p className="text-body text-text-secondary whitespace-pre-wrap leading-relaxed">
          {comment.content}
        </p>
      </div>
    </div>
  );
}
