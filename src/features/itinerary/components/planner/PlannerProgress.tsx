import React from "react";

interface PlannerProgressProps {
  step: number;
  totalSteps: number;
}

export const PlannerProgress: React.FC<PlannerProgressProps> = ({ step, totalSteps }) => {
  const percentage = Math.round((step / totalSteps) * 100);
  
  return (
    <div className="mb-8 md:mb-12 px-2">
      <div className="flex justify-between items-center mb-3">
        <span className="text-[9px] md:text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Bước {step} / {totalSteps}</span>
        <span className="text-[9px] md:text-[10px] font-bold text-hanoi-red uppercase tracking-widest">{percentage}% Hoàn tất</span>
      </div>
      <div className="h-1.5 w-full bg-white rounded-full overflow-hidden border border-zinc-100">
        <div 
          className="h-full bg-hanoi-red transition-all duration-500 ease-out" 
          style={{ width: `${percentage}%` }} 
        />
      </div>
    </div>
  );
};
