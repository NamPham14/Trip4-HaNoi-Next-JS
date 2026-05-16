import React from "react";
import { Search, Filter, X } from "lucide-react";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";

interface EventFilterBarProps {
  keyword: string;
  onKeywordChange: (value: string) => void;
  onClear: () => void;
}

export const EventFilterBar: React.FC<EventFilterBarProps> = ({ 
  keyword, 
  onKeywordChange,
  onClear
}) => {
  return (
    <div className="bg-white p-4 md:p-6 rounded-[32px] border border-zinc-100 shadow-sm flex flex-col md:flex-row gap-4 items-center">
      <div className="relative flex-1 w-full">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
        <Input 
          placeholder="Tìm kiếm sự kiện, lễ hội..." 
          value={keyword}
          onChange={(e) => onKeywordChange(e.target.value)}
          className="h-14 md:h-16 pl-12 pr-12 rounded-2xl border-zinc-100 bg-zinc-50/50 focus:bg-white focus:border-hanoi-red transition-all font-bold text-base w-full"
        />
        {keyword && (
          <button 
            onClick={onClear}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-zinc-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-zinc-400" />
          </button>
        )}
      </div>
      
      <Button className="w-full md:w-auto h-14 md:h-16 px-8 bg-zinc-900 text-white font-black rounded-2xl flex items-center gap-2 hover:bg-hanoi-red transition-all shadow-lg shadow-zinc-900/10">
        <Filter className="h-5 w-5" /> Tìm kiếm
      </Button>
    </div>
  );
};
