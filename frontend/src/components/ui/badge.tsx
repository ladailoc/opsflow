import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 font-medium rounded px-2 py-0.5 text-caption tracking-tight select-none border',
  {
    variants: {
      variant: {
        default: 'bg-bg-subtle text-text-secondary border-border',
        primary: 'bg-blue-50 text-blue-700 border-blue-200',
        success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        warning: 'bg-amber-50 text-amber-800 border-amber-200',
        danger: 'bg-red-50 text-red-700 border-red-200',
        info: 'bg-sky-50 text-sky-700 border-sky-200',
      },
      size: {
        sm: 'px-1.5 py-0.2 text-[11px] leading-tight',
        md: 'px-2 py-0.5 text-caption',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  icon?: React.ReactNode;
}

export function Badge({ className, variant, size, icon, children, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant, size, className }))} {...props}>
      {icon}
      <span>{children}</span>
    </span>
  );
}
