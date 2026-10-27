import React from 'react';

export const ProductSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col rounded-2xl bg-[#14171f] border border-white/5 overflow-hidden skeleton-shimmer">
      <div className="aspect-square w-full bg-[#0b0e16]" />
      <div className="p-5 flex flex-col gap-3">
        <div className="flex justify-between">
          <div className="h-3 w-16 bg-[#1c1f28] rounded" />
          <div className="h-3 w-12 bg-[#1c1f28] rounded" />
        </div>
        <div className="h-4 w-5/6 bg-[#1c1f28] rounded" />
        <div className="h-4 w-3/5 bg-[#1c1f28] rounded" />
        <div className="h-3 w-20 bg-[#1c1f28] rounded mt-1" />
        <div className="mt-4 pt-3 border-t border-white/5 flex justify-between items-center">
          <div className="h-5 w-24 bg-[#1c1f28] rounded" />
          <div className="h-9 w-9 bg-[#1c1f28] rounded-xl" />
        </div>
      </div>
    </div>
  );
};
