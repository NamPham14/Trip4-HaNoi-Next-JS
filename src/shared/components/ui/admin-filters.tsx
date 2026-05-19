"use client";

import React from 'react';
import { Search, Filter, RotateCcw } from 'lucide-react';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Button } from '@/shared/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/shared/components/ui/select';

export interface FilterOption {
  label: string;
  value: string;
  icon?: React.ReactNode;
}

interface AdminFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  
  statusValue?: string;
  onStatusChange?: (value: string) => void;
  statusOptions?: FilterOption[];
  statusLabel?: string;
  
  onReset: () => void;
  totalElements?: number;
  unitName?: string;
}

export const AdminFilters: React.FC<AdminFiltersProps> = ({
  searchTerm,
  onSearchChange,
  searchPlaceholder = "Tìm kiếm...",
  statusValue,
  onStatusChange,
  statusOptions = [],
  statusLabel = "Trạng thái",
  onReset,
  totalElements,
  unitName = "mục"
}) => {
  return (
    <div className="bg-white p-6 rounded-2xl border-2 border-gray-100 shadow-sm mb-8 space-y-4">
      <div className="flex flex-col md:flex-row gap-4 items-end">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Label className="mb-2 block text-xs font-black uppercase tracking-widest text-gray-400 ml-1">
            Tìm kiếm
          </Label>
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <Input 
              className="pl-11 h-12 bg-gray-50/50 border-gray-200 focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all font-bold text-gray-900 rounded-xl" 
              placeholder={searchPlaceholder} 
              value={searchTerm} 
              onChange={(e) => onSearchChange(e.target.value)} 
            />
          </div>
        </div>
        
        {/* Status Filter */}
        {onStatusChange && (
          <div className="w-full md:w-[280px]">
            <Label className="mb-2 block text-xs font-black uppercase tracking-widest text-gray-400 ml-1">
              {statusLabel}
            </Label>
            <Select value={statusValue} onValueChange={onStatusChange}>
              <SelectTrigger className="h-12 border-2 border-gray-200 bg-gray-100 font-black text-gray-800 hover:border-primary/50 hover:bg-gray-200 transition-all shadow-sm rounded-xl">
                <div className="flex items-center gap-2">
                  <Filter size={16} className="text-gray-500" />
                  <SelectValue placeholder="Chọn bộ lọc" />
                </div>
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-2 border-gray-100 shadow-2xl p-1 bg-white">
                <SelectItem value="all" className="rounded-xl focus:bg-primary/5 focus:text-primary transition-colors cursor-pointer py-3">
                  <div className="flex items-center gap-2 font-black">
                    <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                    Tất cả
                  </div>
                </SelectItem>
                {statusOptions.map((opt) => (
                  <SelectItem 
                    key={opt.value} 
                    value={opt.value} 
                    className="rounded-xl focus:bg-primary/5 focus:text-primary transition-colors cursor-pointer py-3"
                  >
                    <div className="flex items-center gap-2 font-black">
                      {opt.icon || <div className="w-2 h-2 rounded-full bg-primary"></div>}
                      {opt.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Reset Button */}
        <Button 
          variant="outline" 
          className="h-12 px-5 border-2 border-gray-100 text-gray-400 hover:text-hanoi-red hover:border-hanoi-red/30 hover:bg-red-50 transition-all rounded-xl font-black group"
          onClick={onReset}
        >
          <RotateCcw size={18} className="mr-2 group-hover:rotate-[-45deg] transition-transform" />
          ĐẶT LẠI
        </Button>
      </div>

      {/* Info Badge */}
      {totalElements !== undefined && (
        <div className="flex items-center gap-2.5 text-[11px] font-black text-gray-400 bg-gray-50 w-fit px-4 py-1.5 rounded-full border border-gray-100 uppercase tracking-widest">
          <div className="w-1.5 h-1.5 rounded-full bg-hanoi-red animate-pulse"></div>
          Hệ thống có <span className="text-gray-900 mx-1">{totalElements}</span> {unitName}
        </div>
      )}
    </div>
  );
};
