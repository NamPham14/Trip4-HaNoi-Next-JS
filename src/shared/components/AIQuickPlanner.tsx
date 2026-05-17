"use client";

import React, { useState } from "react";
import { 
  Sparkles, 
  Calendar, 
  Users, 
  Wallet, 
  Coffee,
  Camera,
  Utensils,
  History,
  Moon,
  Search,
  Loader2,
  ChevronDown
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { itineraryService } from "@/features/itinerary/services/itinerary-api";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";

export const AIQuickPlanner = () => {
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  
  const [days, setDays] = useState(1);
  const [people, setPeople] = useState(2);
  const [budget, setBudget] = useState(2000000);

  const interests = [
    { name: "Ẩm thực", icon: Utensils },
    { name: "Văn hóa", icon: History },
    { name: "Về đêm", icon: Moon },
    { name: "Cà phê", icon: Coffee },
    { name: "Nghệ thuật", icon: Camera },
  ];

  const budgetOptions = [
    { label: "Tiết kiệm (500k)", value: 500000 },
    { label: "Trung bình (2tr)", value: 2000000 },
    { label: "Cao cấp (5tr+)", value: 5000000 },
  ];

  const dayOptions = [
    { label: "1 ngày", value: 1 },
    { label: "2 ngày", value: 2 },
    { label: "3 ngày", value: 3 },
    { label: "5 ngày", value: 5 },
  ];

  const peopleOptions = [
    { label: "1 người", value: 1 },
    { label: "2 người", value: 2 },
    { label: "3-5 người", value: 4 },
    { label: "Gia đình", value: 6 },
  ];

  const toggleInterest = (name: string) => {
    setSelectedCategories(prev => 
      prev.includes(name) ? prev.filter(i => i !== name) : [...prev, name]
    );
  };

  const handleGenerate = async () => {
    if (selectedCategories.length === 0) {
      toast.error("Vui lòng chọn ít nhất 1 sở thích/trải nghiệm!");
      return;
    }

    setIsGenerating(true);
    try {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
      const dateStr = now.toLocaleDateString('vi-VN');
      
      const result = await itineraryService.createItinerary({
        title: `Chuyến đi Hà Nội (${dateStr} ${timeStr})`,
        budget: budget,
        days: days,
        numberOfPeople: people,
        categoryNames: selectedCategories
      });
      
      toast.success("Đã tạo lịch trình thành công!");
      router.push(`/itinerary-detail/${result.id}`);
    } catch (error) {
      console.error("Failed to generate itinerary", error);
      toast.error("Lỗi khi tạo lịch trình. Vui lòng thử lại!");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white/10 backdrop-blur-2xl rounded-[40px] border border-white/20 p-6 md:p-8 shadow-2xl relative overflow-hidden group">
      {/* Decorative Blur */}
      <div className="absolute -top-24 -left-24 w-48 h-48 bg-hanoi-red/20 blur-[80px] rounded-full group-hover:bg-hanoi-red/30 transition-colors duration-700" />
      <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-hanoi-gold/20 blur-[80px] rounded-full group-hover:bg-hanoi-gold/30 transition-colors duration-700" />

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-hanoi-red/20 p-2.5 rounded-2xl">
            <Sparkles className="h-6 w-6 text-hanoi-red animate-pulse" />
          </div>
          <div className="text-left">
            <h3 className="text-xl md:text-2xl font-black text-white tracking-tight">Lên lịch trình bằng AI</h3>
            <p className="text-sm font-medium text-white/70">Thiết kế hành trình thông minh dựa trên sở thích</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Destination (Read Only) */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-3xl transition-all shadow-sm flex flex-col items-start text-left">
            <span className="text-[10px] font-black text-hanoi-gold uppercase tracking-widest block mb-1">Điểm đến</span>
            <div className="flex items-center gap-2 text-white/90">
              <Search className="h-4 w-4 text-hanoi-gold" />
              <span className="text-sm font-bold">Hà Nội</span>
            </div>
          </div>

          {/* Days Custom Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-3xl hover:border-hanoi-gold/50 transition-all shadow-sm flex flex-col items-start text-left group/btn outline-none">
                <span className="text-[10px] font-black text-hanoi-gold uppercase tracking-widest block mb-1">Thời gian</span>
                <div className="flex items-center justify-between w-full text-white">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-hanoi-gold" />
                    <span className="text-sm font-bold">{dayOptions.find(o => o.value === days)?.label}</span>
                  </div>
                  <ChevronDown className="h-4 w-4 text-hanoi-gold/50 group-hover/btn:text-hanoi-gold transition-colors" />
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-hanoi-cream/95 backdrop-blur-xl border-hanoi-gold/20 rounded-2xl p-2 min-w-[160px] shadow-2xl">
              {dayOptions.map((opt) => (
                <DropdownMenuItem 
                  key={opt.value}
                  onClick={() => setDays(opt.value)}
                  className={cn(
                    "rounded-xl px-4 py-2 text-sm font-bold cursor-pointer transition-colors",
                    days === opt.value ? "bg-hanoi-red text-white" : "text-zinc-700 hover:bg-hanoi-gold/30"
                  )}
                >
                  {opt.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Budget Custom Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-3xl hover:border-hanoi-gold/50 transition-all shadow-sm flex flex-col items-start text-left group/btn outline-none">
                <span className="text-[10px] font-black text-hanoi-gold uppercase tracking-widest block mb-1">Ngân sách</span>
                <div className="flex items-center justify-between w-full text-white">
                  <div className="flex items-center gap-2">
                    <Wallet className="h-4 w-4 text-hanoi-gold" />
                    <span className="text-sm font-bold">{budgetOptions.find(o => o.value === budget)?.label.split(' ')[0]}</span>
                  </div>
                  <ChevronDown className="h-4 w-4 text-hanoi-gold/50 group-hover/btn:text-hanoi-gold transition-colors" />
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-hanoi-cream/95 backdrop-blur-xl border-hanoi-gold/20 rounded-2xl p-2 min-w-[180px] shadow-2xl">
              {budgetOptions.map((opt) => (
                <DropdownMenuItem 
                  key={opt.value}
                  onClick={() => setBudget(opt.value)}
                  className={cn(
                    "rounded-xl px-4 py-2 text-sm font-bold cursor-pointer transition-colors",
                    budget === opt.value ? "bg-hanoi-red text-white" : "text-zinc-700 hover:bg-hanoi-gold/30"
                  )}
                >
                  {opt.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* People Custom Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-3xl hover:border-hanoi-gold/50 transition-all shadow-sm flex flex-col items-start text-left group/btn outline-none">
                <span className="text-[10px] font-black text-hanoi-gold uppercase tracking-widest block mb-1">Số người</span>
                <div className="flex items-center justify-between w-full text-white">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-hanoi-gold" />
                    <span className="text-sm font-bold">{peopleOptions.find(o => o.value === people)?.label}</span>
                  </div>
                  <ChevronDown className="h-4 w-4 text-hanoi-gold/50 group-hover/btn:text-hanoi-gold transition-colors" />
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-hanoi-cream/95 backdrop-blur-xl border-hanoi-gold/20 rounded-2xl p-2 min-w-[160px] shadow-2xl">
              {peopleOptions.map((opt) => (
                <DropdownMenuItem 
                  key={opt.value}
                  onClick={() => setPeople(opt.value)}
                  className={cn(
                    "rounded-xl px-4 py-2 text-sm font-bold cursor-pointer transition-colors",
                    people === opt.value ? "bg-hanoi-red text-white" : "text-zinc-700 hover:bg-hanoi-gold/30"
                  )}
                >
                  {opt.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Interests Selector */}
        <div className="mb-8 text-left">
          <span className="text-[10px] font-black text-white/50 uppercase tracking-widest block mb-4">Bạn muốn trải nghiệm gì?</span>
          <div className="flex flex-wrap gap-2">
            {interests.map((interest) => (
              <button
                key={interest.name}
                onClick={() => toggleInterest(interest.name)}
                className={cn(
                  "flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-bold transition-all duration-300 border backdrop-blur-sm",
                  selectedCategories.includes(interest.name)
                    ? "bg-hanoi-red text-white border-hanoi-red shadow-lg shadow-hanoi-red/20 scale-105"
                    : "bg-white/10 text-white/90 border-white/20 hover:border-white/40 hover:bg-white/20"
                )}
              >
                <interest.icon className={cn(
                  "h-4 w-4",
                  selectedCategories.includes(interest.name) ? "text-white" : "text-hanoi-gold"
                )} />
                {interest.name}
              </button>
            ))}
          </div>
        </div>

        <Button 
          onClick={handleGenerate}
          disabled={isGenerating}
          className="w-full h-16 bg-hanoi-red hover:bg-[#6D1616] text-white font-black rounded-3xl text-lg shadow-2xl shadow-hanoi-red/30 transition-all active:scale-[0.98] flex items-center justify-center gap-3 border border-hanoi-red/50 hover:border-hanoi-red"
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              AI Đang Phân Tích Dữ Liệu...
            </>
          ) : (
            <>
              <Sparkles className="h-5 w-5 fill-current animate-pulse" />
              Bắt Đầu Hành Trình
            </>
          )}
        </Button>
      </div>
    </div>
  );
};


