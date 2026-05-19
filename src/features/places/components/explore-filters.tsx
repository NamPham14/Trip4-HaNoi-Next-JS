"use client";

import React from "react";
import { Search, MapPin, Filter, X } from "lucide-react";
import { useCategories } from "@/features/category/hooks/use-categories";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Skeleton } from "@/shared/components/ui/skeleton";

interface ExploreFiltersProps {
  filters: {
    keyword: string;
    categoryId: number | undefined;
    district: string;
    radius: number;
  };
  setFilters: React.Dispatch<React.SetStateAction<{
    keyword: string;
    categoryId: number | undefined;
    district: string;
    radius: number;
  }>>;
}

const HANOI_DISTRICTS = [
  "Ba Đình", "Hoàn Kiếm", "Tây Hồ", "Cầu Giấy", "Đống Đa", "Hai Bà Trưng", 
  "Thanh Xuân", "Hoàng Mai", "Long Biên", "Hà Đông", "Nam Từ Liêm", "Bắc Từ Liêm",
  "Gia Lâm", "Đông Anh", "Sóc Sơn", "Quốc Oai", "Thạch Thất", "Chương Mỹ",
  "Thanh Trì", "Mê Linh", "Hoài Đức", "Đan Phượng", "Sơn Tây", "Ba Vì",
  "Mỹ Đức", "Ứng Hòa", "Phú Xuyên", "Thường Tín", "Thanh Oai", "Phúc Thọ"
];

export const ExploreFilters = ({ filters, setFilters }: ExploreFiltersProps) => {
  const { data: categories, isLoading: isLoadingCategories } = useCategories();
  const [localKeyword, setLocalKeyword] = React.useState(filters.keyword);

 // Đồng bộ từ khóa cục bộ với các bộ lọc bên ngoài (ví dụ: khi xóa tất cả) - Mẫu: Điều chỉnh trạng thái trong quá trình hiển thị
  const [prevKeyword, setPrevKeyword] = React.useState(filters.keyword);
  if (filters.keyword !== prevKeyword) {
    setPrevKeyword(filters.keyword);
    setLocalKeyword(filters.keyword);
  }

  // Debounce logic
  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (localKeyword !== filters.keyword) {
        setFilters(prev => ({ ...prev, keyword: localKeyword }));
      }
    }, 500); // Wait 500ms after user stops typing
    return () => clearTimeout(timer);
  }, [localKeyword, setFilters, filters.keyword]);

  const handleClearFilters = () => {
    setLocalKeyword("");
    setFilters({
      keyword: "",
      categoryId: undefined,
      district: "",
      radius: 5,
    });
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-100 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <Filter className="h-5 w-5 text-hanoi-red" />
          Bộ lọc tìm kiếm
        </h2>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleClearFilters}
          className="text-zinc-500 text-xs font-bold hover:text-hanoi-red"
        >
          <X className="h-3 w-3 mr-1" />
          Xóa tất cả
        </Button>
      </div>

      {/* Keyword Search */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Từ khóa</label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <Input 
            placeholder="Tên quán, món ăn..." 
            className="pl-10 border-zinc-100 focus:border-hanoi-red"
            value={localKeyword}
            onChange={(e) => setLocalKeyword(e.target.value)}
          />
        </div>
      </div>

      {/* Category Selection */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Danh mục</label>
        <div className="flex flex-wrap gap-2">
          {isLoadingCategories ? (
            <>
              <Skeleton className="h-7 w-16 rounded-full" />
              <Skeleton className="h-7 w-20 rounded-full" />
              <Skeleton className="h-7 w-24 rounded-full" />
            </>
          ) : (
            categories?.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setFilters(prev => ({ 
                  ...prev, 
                  categoryId: prev.categoryId === cat.id ? undefined : cat.id 
                }))}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                  filters.categoryId === cat.id 
                    ? "bg-hanoi-red text-white" 
                    : "bg-zinc-50 text-zinc-600 hover:bg-zinc-100"
                }`}
              >
                {cat.name}
              </button>
            ))
          )}
        </div>
      </div>

      {/* District Selection */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Quận / Huyện</label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-hanoi-red" />
          <select 
            className="w-full pl-10 pr-4 py-2 bg-white border border-zinc-100 rounded-lg text-sm font-medium outline-none focus:border-hanoi-red appearance-none"
            value={filters.district}
            onChange={(e) => setFilters(prev => ({ ...prev, district: e.target.value }))}
          >
            <option value="">Tất cả Hà Nội</option>
            {HANOI_DISTRICTS.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Radius Slider */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Bán kính xung quanh</label>
          <span className="text-sm font-bold text-hanoi-red">{filters.radius} km</span>
        </div>
        <input 
          type="range" 
          min="1" 
          max="30" 
          value={filters.radius}
          onChange={(e) => setFilters(prev => ({ ...prev, radius: parseInt(e.target.value) }))}
          className="w-full accent-hanoi-red"
        />
        <div className="flex justify-between text-[10px] text-zinc-400 font-bold uppercase">
          <span>1km</span>
          <span>15km</span>
          <span>30km</span>
        </div>
      </div>
    </div>
  );
};
