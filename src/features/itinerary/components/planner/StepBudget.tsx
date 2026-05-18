import React from "react";
import { Sparkles, Utensils, Wallet } from "lucide-react";
import { cn } from "@/shared/lib/utils";

interface StepBudgetProps {
  budget: number;
  onUpdate: (budget: number) => void;
}

export const StepBudget: React.FC<StepBudgetProps> = ({ budget, onUpdate }) => {
  const budgetOptions = [
    { label: "Tiết kiệm", val: 500000, desc: "Trải nghiệm dân dã, ẩm thực đường phố", icon: Wallet },
    { label: "Cân bằng", val: 2000000, desc: "Khách sạn chất lượng, nhà hàng ấm cúng", icon: Utensils },
    { label: "Sang trọng", val: 5000000, desc: "Dịch vụ cao cấp, trải nghiệm độc bản", icon: Sparkles },
  ];

  return (
    <div className="flex-1 animate-in fade-in slide-in-from-right-4 duration-500">
      <h2 className="text-xl md:text-2xl font-bold text-zinc-900 mb-6 md:mb-8">Ngân sách dự kiến</h2>
      
      <div className="space-y-3 md:space-y-4">
        {budgetOptions.map((b) => (
          <button
            key={b.val}
            onClick={() => onUpdate(b.val)}
            className={cn(
              "w-full p-4 md:p-6 rounded-2xl md:rounded-3xl text-left border-2 transition-all flex items-center gap-4 md:gap-6",
              budget === b.val 
                ? "bg-hanoi-red/5 border-hanoi-red shadow-lg shadow-hanoi-red/5" 
                : "bg-zinc-50 border-zinc-100 hover:border-hanoi-red/30"
            )}
          >
            <div className={cn(
              "w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center shrink-0",
              budget === b.val ? "bg-hanoi-red text-white" : "bg-white text-zinc-400"
            )}>
              <b.icon className="h-6 w-6 md:h-7 md:w-7" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-0.5 md:mb-1">
                <span className={cn("font-bold text-base md:text-lg", budget === b.val ? "text-hanoi-red" : "text-zinc-900")}>{b.label}</span>
                <span className="text-zinc-900 font-bold text-sm md:text-base">{b.val.toLocaleString()}đ</span>
              </div>
              <p className="text-[10px] md:text-xs text-zinc-500 font-medium line-clamp-1">{b.desc}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
