/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Check, Loader2 } from "lucide-react";
import { cn } from "@/shared/lib/utils";

interface StepInterestsProps {
  categories: any[];
  selectedCategories: string[];
  isLoading: boolean;
  onToggleCategory: (name: string) => void;
}

export const StepInterests: React.FC<StepInterestsProps> = ({ 
  categories, 
  selectedCategories, 
  isLoading, 
  onToggleCategory 
}) => {
  return (
    <div className="flex-1 animate-in fade-in slide-in-from-right-4 duration-500">
      <h2 className="text-xl md:text-2xl font-bold text-zinc-900 mb-1 md:mb-2">Bạn thích làm gì?</h2>
      <p className="text-xs md:text-sm text-zinc-500 mb-6 md:mb-8">Chọn các chủ đề bạn quan tâm để gợi ý chính xác nhất</p>

      {isLoading ? (
        <div className="flex justify-center py-12"><Loader2 className="animate-spin text-hanoi-red h-8 w-8" /></div>
      ) : (
        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-2 md:gap-3">
          {(categories || []).map((cat: any) => (
            <button
              key={cat.id}
              onClick={() => onToggleCategory(cat.name)}
              className={cn(
                "p-3 md:p-4 rounded-xl md:rounded-2xl text-left transition-all border-2 flex items-center gap-3",
                selectedCategories.includes(cat.name)
                  ? "bg-hanoi-red/5 border-hanoi-red text-hanoi-red"
                  : "bg-zinc-50 border-zinc-100 text-zinc-600 hover:border-hanoi-red/30"
              )}
            >
              <div className={cn(
                "w-4 h-4 md:w-5 md:h-5 rounded flex items-center justify-center border transition-all",
                selectedCategories.includes(cat.name) ? "bg-hanoi-red border-hanoi-red text-white" : "border-zinc-300"
              )}>
                {selectedCategories.includes(cat.name) && <Check className="h-3 w-3" />}
              </div>
              <span className="font-bold text-xs md:text-sm">{cat.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
