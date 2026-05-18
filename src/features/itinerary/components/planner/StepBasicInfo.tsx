import React from "react";
import { cn } from "@/shared/lib/utils";

interface StepBasicInfoProps {
  days: number;
  people: number;
  onUpdate: (data: Partial<{ days: number; people: number }>) => void;
}

export const StepBasicInfo: React.FC<StepBasicInfoProps> = ({ days, people, onUpdate }) => {
  return (
    <div className="flex-1 animate-in fade-in slide-in-from-right-4 duration-500">
      <h2 className="text-xl md:text-2xl font-bold text-zinc-900 mb-6 md:mb-8">Thông tin cơ bản</h2>
      
      <div className="space-y-6 md:space-y-8">
        <div>
          <label className="text-[10px] md:text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3 md:mb-4 block">Thời gian (Ngày)</label>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 md:gap-3">
            {[1, 2, 3, 4, 5].map((d) => (
              <button
                key={d}
                onClick={() => onUpdate({ days: d })}
                className={cn(
                  "py-3 md:py-4 rounded-xl md:rounded-2xl font-bold text-base md:text-lg transition-all border-2",
                  days === d 
                    ? "bg-hanoi-red text-white border-hanoi-red shadow-lg shadow-hanoi-red/20" 
                    : "bg-zinc-50 border-zinc-100 text-zinc-500 hover:border-hanoi-red/30"
                )}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-[10px] md:text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3 md:mb-4 block">Số lượng người</label>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 md:gap-6 bg-zinc-50 p-4 md:p-6 rounded-2xl md:rounded-3xl border border-zinc-100">
            <div className="flex-1">
              <p className="font-bold text-zinc-900 text-sm md:text-base">Số thành viên</p>
              <p className="text-[10px] md:text-xs text-zinc-400 font-medium italic">Cho gia đình hoặc nhóm bạn</p>
            </div>
            <div className="flex items-center justify-between sm:justify-start gap-4">
              <button 
                onClick={() => onUpdate({ people: Math.max(1, people - 1) })}
                className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white border border-zinc-200 flex items-center justify-center font-bold text-lg md:text-xl hover:border-hanoi-red transition-all"
              >-</button>
              <span className="text-xl md:text-2xl font-bold w-6 text-center">{people}</span>
              <button 
                onClick={() => onUpdate({ people: people + 1 })}
                className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white border border-zinc-200 flex items-center justify-center font-bold text-lg md:text-xl hover:border-hanoi-red transition-all"
              >+</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
