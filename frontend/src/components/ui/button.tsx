import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary-focus focus:ring-offset-1 disabled:opacity-50 disabled:pointer-events-none select-none',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-text-inverse hover:bg-primary-hover active:bg-primary-700 shadow-subtle',
        secondary: 'bg-bg-surface text-text-primary border border-border hover:bg-bg-subtle active:bg-gray-100 shadow-subtle',
        tertiary: 'bg-transparent text-text-secondary hover:bg-bg-subtle hover:text-text-primary',
        danger: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 shadow-subtle',
        ghost: 'bg-transparent text-text-muted hover:text-text-primary hover:bg-bg-subtle',
      },
      size: {
        sm: 'h-8 px-2.5 text-caption gap-1.5',
        md: 'h-9 px-3.5 text-body gap-2',
        lg: 'h-10 px-4 text-body-medium gap-2',
        icon: 'h-8 w-8 p-0',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, isLoading, leftIcon, rightIcon, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      >
        {isLoading && <Loader2 className="w-4 h-4 animate-spin text-current" />}
        {!isLoading && leftIcon}
        <span>{children}</span>
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = 'Button';
