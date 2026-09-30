import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  if (!items || items.length === 0) return null;

  return (
    <nav className="flex items-center gap-1.5 text-caption text-text-muted mb-2 select-none">
      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;
        return (
          <React.Fragment key={idx}>
            {idx > 0 && <ChevronRight className="w-3.5 h-3.5 text-text-muted/60" />}
            {item.href && !isLast ? (
              <Link href={item.href} className="hover:text-text-primary transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className={cn(isLast && 'text-text-secondary font-medium')}>{item.label}</span>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}

export interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode;
  badge?: React.ReactNode;
}

export function PageHeader({ title, description, breadcrumbs, actions, badge }: PageHeaderProps) {
  return (
    <div className="pb-5 mb-6 border-b border-border/80 flex items-start justify-between gap-4 flex-wrap">
      <div className="space-y-1">
        {breadcrumbs && <Breadcrumbs items={breadcrumbs} />}
        <div className="flex items-center gap-3">
          <h1 className="text-page-title text-text-primary tracking-tight font-semibold">{title}</h1>
          {badge}
        </div>
        {description && <p className="text-body text-text-secondary">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-2.5 shrink-0 pt-1">{actions}</div>}
    </div>
  );
}
