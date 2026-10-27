import React from 'react';
import { cn } from '../../lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'gold' | 'cyber';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-["Sora"] font-bold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#f5b700]/50 disabled:opacity-40 disabled:pointer-events-none active:scale-[0.98] select-none cursor-pointer';

    const variants = {
      primary:
        'bg-[#f5b700] text-[#0b0e16] hover:bg-[#ffd88a] shadow-[0_8px_24px_-6px_rgba(245,183,0,0.4)] hover:-translate-y-0.5',
      gold:
        'bg-gradient-to-r from-[#ffd88a] via-[#fbbc0e] to-[#cabeff] text-[#0b0e16] shadow-[0_12px_32px_-8px_rgba(245,183,0,0.4)] hover:-translate-y-0.5 hover:brightness-105',
      cyber:
        'bg-[#4816cb] text-[#e6deff] hover:bg-[#7c5cff] shadow-[0_8px_24px_-6px_rgba(72,22,203,0.4)] hover:-translate-y-0.5',
      secondary:
        'bg-[#1c1f28] text-[#e0e2ed] hover:bg-[#272a32] border border-white/10 hover:border-[#ffd88a]/40 shadow-sm',
      outline:
        'border border-white/10 bg-transparent text-[#e0e2ed] hover:bg-[#1c1f28] hover:border-[#f5b700] hover:text-[#ffd88a]',
      ghost:
        'bg-transparent text-[#d4c5ac] hover:text-[#ffd88a] hover:bg-white/5',
      danger:
        'bg-[#93000a] text-[#ffdad6] border border-[#ffb4ab]/20 hover:bg-[#690005]',
    };

    const sizes = {
      sm: 'text-xs px-3 py-1.5 rounded-none gap-1.5 font-["JetBrains_Mono"]',
      md: 'text-sm px-4 py-2.5 rounded-none gap-2',
      lg: 'text-base px-6 py-3.5 rounded-none gap-2.5',
      icon: 'p-2 rounded-none h-10 w-10',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              ></path>
            </svg>
            <span>Processing...</span>
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
