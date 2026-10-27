import React from 'react';
import { cn } from '../../lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'secondary' | 'gold' | 'cyber' | 'success' | 'danger' | 'outline';
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'primary',
  children,
  ...props
}) => {
  const variants = {
    primary:
      'bg-[#f5b700]/15 text-[#ffd88a] border border-[#f5b700]/30 font-["JetBrains_Mono"]',
    gold:
      'bg-gradient-to-r from-[#ffd88a] via-[#fbbc0e] to-[#cabeff] text-[#0b0e16] font-bold font-["JetBrains_Mono"] shadow-[0_0_12px_rgba(245,183,0,0.3)]',
    cyber:
      'bg-[#4816cb] text-[#e6deff] border border-[#cabeff]/30 font-["JetBrains_Mono"] font-bold',
    secondary:
      'bg-[#1c1f28] text-[#d4c5ac] border border-white/5 font-["JetBrains_Mono"]',
    success:
      'bg-[#22c55e]/15 text-[#22c55e] border border-[#22c55e]/30 font-["JetBrains_Mono"]',
    danger:
      'bg-[#ffb4ab]/15 text-[#ffb4ab] border border-[#ffb4ab]/30 font-["JetBrains_Mono"]',
    outline:
      'border border-white/10 text-[#d4c5ac] font-["JetBrains_Mono"]',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wider uppercase',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
