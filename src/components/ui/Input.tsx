import React from 'react';
import { cn } from '../../lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, icon, ...props }, ref) => {
    return (
      <div className="w-full relative">
        <div className="relative flex items-center">
          {icon && (
            <div className="absolute left-3.5 pointer-events-none text-[#9c8f78]">
              {icon}
            </div>
          )}
          <input
            type={type}
            className={cn(
              'flex h-11 w-full rounded-none border border-white/10 bg-[#1c1f28] px-4 py-2 font-["Manrope"] text-sm text-[#e0e2ed] placeholder:text-[#9c8f78] focus:outline-none focus:ring-2 focus:ring-[#f5b700]/40 focus:border-[#f5b700] transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-40',
              icon && 'pl-10',
              error && 'border-[#ffb4ab] focus:ring-[#ffb4ab]/40 focus:border-[#ffb4ab]',
              className
            )}
            ref={ref}
            {...props}
          />
        </div>
        {error && (
          <p className="mt-1 font-['JetBrains_Mono'] text-xs text-[#ffb4ab]">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
