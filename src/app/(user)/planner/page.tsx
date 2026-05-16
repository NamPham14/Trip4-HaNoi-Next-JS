/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/shared/components/navbar";
import { Button } from "@/shared/components/ui/button";
import { 
  Sparkles, 
  ArrowRight, 
  Check, 
  ChevronLeft,
  Loader2,
  Wallet,
  Utensils,
  Clock,
  MapPin
} from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { categoryService } from "@/features/category/services/category-api";
import { itineraryService } from "@/features/itinerary/services/itinerary-api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function PlannerPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const [formData, setFormData] = useState({
    days: 1,
    people: 1,
    budget: 1000000,
    selectedCategories: [] as string[]
  });

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      try {
        const data = await categoryService.getAllCategories();
        // Đảm bảo data luôn là mảng để tránh lỗi .map()
        if (data && Array.isArray(data)) {
          setCategories(data);
        } else {
          console.error("Categories data is not an array:", data);
          setCategories([]);
        }
      } catch (error) {
        console.error("Failed to fetch categories", error);
        setCategories([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const toggleCategory = (name: string) => {
    setFormData(prev => ({
      ...prev,
      selectedCategories: prev.selectedCategories.includes(name)
        ? prev.selectedCategories.filter(c => c !== name)
        : [...prev.selectedCategories, name]
    }));
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
      const dateStr = now.toLocaleDateString('vi-VN');
      
      const result = await itineraryService.createItinerary({
        title: `Chuyến đi Hà Nội (${dateStr} ${timeStr})`,
        budget: formData.budget,
        days: formData.days,
        numberOfPeople: formData.people,
        categoryNames: formData.selectedCategories
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

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  return (
    <div className="min-h-screen bg-hanoi-cream/30">
      <Navbar />

      <main className="container mx-auto py-8 md:py-12 px-4 max-w-4xl">
        <div className="text-center mb-8 md:mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-hanoi-gold/20 text-hanoi-red text-[10px] md:text-xs font-bold mb-4">
            <Sparkles className="h-3.5 w-3.5 md:h-4 md:w-4" />
            Smart Planner
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-3 md:mb-4 tracking-tight">Lên lịch trình du lịch</h1>
          <p className="text-sm md:text-base text-zinc-500 font-medium px-4">Chỉ vài bước đơn giản, chúng tôi sẽ thiết kế chuyến đi hoàn hảo cho bạn</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8 md:mb-12 px-2">
          <div className="flex justify-between items-center mb-3">
            <span className="text-[9px] md:text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Bước {step} / 3</span>
            <span className="text-[9px] md:text-[10px] font-bold text-hanoi-red uppercase tracking-widest">{Math.round((step / 3) * 100)}% Hoàn tất</span>
          </div>
          <div className="h-1.5 w-full bg-white rounded-full overflow-hidden border border-zinc-100">
            <div 
              className="h-full bg-hanoi-red transition-all duration-500 ease-out" 
              style={{ width: `${(step / 3) * 100}%` }} 
            />
          </div>
        </div>

        <div className="bg-white rounded-[32px] md:rounded-[40px] shadow-2xl shadow-hanoi-red/5 p-6 md:p-12 border border-zinc-100 min-h-[450px] md:min-h-[500px] flex flex-col">
          
          {step === 1 && (
            <div className="flex-1 animate-in fade-in slide-in-from-right-4 duration-500">
              <h2 className="text-xl md:text-2xl font-bold text-zinc-900 mb-6 md:mb-8">Thông tin cơ bản</h2>
              
              <div className="space-y-6 md:space-y-8">
                <div>
                  <label className="text-[10px] md:text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3 md:mb-4 block">Thời gian (Ngày)</label>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 md:gap-3">
                    {[1, 2, 3, 4, 5].map((d) => (
                      <button
                        key={d}
                        onClick={() => setFormData({ ...formData, days: d })}
                        className={cn(
                          "py-3 md:py-4 rounded-xl md:rounded-2xl font-bold text-base md:text-lg transition-all border-2",
                          formData.days === d 
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
                        onClick={() => setFormData({ ...formData, people: Math.max(1, formData.people - 1) })}
                        className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white border border-zinc-200 flex items-center justify-center font-bold text-lg md:text-xl hover:border-hanoi-red transition-all"
                      >-</button>
                      <span className="text-xl md:text-2xl font-bold w-6 text-center">{formData.people}</span>
                      <button 
                        onClick={() => setFormData({ ...formData, people: formData.people + 1 })}
                        className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white border border-zinc-200 flex items-center justify-center font-bold text-lg md:text-xl hover:border-hanoi-red transition-all"
                      >+</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
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
                      onClick={() => toggleCategory(cat.name)}
                      className={cn(
                        "p-3 md:p-4 rounded-xl md:rounded-2xl text-left transition-all border-2 flex items-center gap-3",
                        formData.selectedCategories.includes(cat.name)
                          ? "bg-hanoi-red/5 border-hanoi-red text-hanoi-red"
                          : "bg-zinc-50 border-zinc-100 text-zinc-600 hover:border-hanoi-red/30"
                      )}
                    >
                      <div className={cn(
                        "w-4 h-4 md:w-5 md:h-5 rounded flex items-center justify-center border transition-all",
                        formData.selectedCategories.includes(cat.name) ? "bg-hanoi-red border-hanoi-red text-white" : "border-zinc-300"
                      )}>
                        {formData.selectedCategories.includes(cat.name) && <Check className="h-3 w-3" />}
                      </div>
                      <span className="font-bold text-xs md:text-sm">{cat.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="flex-1 animate-in fade-in slide-in-from-right-4 duration-500">
              <h2 className="text-xl md:text-2xl font-bold text-zinc-900 mb-6 md:mb-8">Ngân sách dự kiến</h2>
              
              <div className="space-y-3 md:space-y-4">
                {[
                  { label: "Tiết kiệm", val: 500000, desc: "Trải nghiệm dân dã, ẩm thực đường phố", icon: Wallet },
                  { label: "Cân bằng", val: 2000000, desc: "Khách sạn chất lượng, nhà hàng ấm cúng", icon: Utensils },
                  { label: "Sang trọng", val: 5000000, desc: "Dịch vụ cao cấp, trải nghiệm độc bản", icon: Sparkles },
                ].map((b) => (
                  <button
                    key={b.val}
                    onClick={() => setFormData({ ...formData, budget: b.val })}
                    className={cn(
                      "w-full p-4 md:p-6 rounded-2xl md:rounded-3xl text-left border-2 transition-all flex items-center gap-4 md:gap-6",
                      formData.budget === b.val 
                        ? "bg-hanoi-red/5 border-hanoi-red shadow-lg shadow-hanoi-red/5" 
                        : "bg-zinc-50 border-zinc-100 hover:border-hanoi-red/30"
                    )}
                  >
                    <div className={cn(
                      "w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center shrink-0",
                      formData.budget === b.val ? "bg-hanoi-red text-white" : "bg-white text-zinc-400"
                    )}>
                      <b.icon className="h-6 w-6 md:h-7 md:w-7" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5 md:mb-1">
                        <span className={cn("font-bold text-base md:text-lg", formData.budget === b.val ? "text-hanoi-red" : "text-zinc-900")}>{b.label}</span>
                        <span className="text-zinc-900 font-bold text-sm md:text-base">{b.val.toLocaleString()}đ</span>
                      </div>
                      <p className="text-[10px] md:text-xs text-zinc-500 font-medium line-clamp-1">{b.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="mt-8 md:mt-12 flex flex-col-reverse sm:flex-row items-center justify-between gap-3 md:gap-4">
            {step > 1 ? (
              <Button 
                variant="ghost" 
                onClick={prevStep}
                className="w-full sm:w-auto px-8 py-6 md:py-7 rounded-xl md:rounded-2xl font-bold text-zinc-500 hover:text-hanoi-red hover:bg-hanoi-red/5 order-2 sm:order-1"
              >
                <ChevronLeft className="h-5 w-5 mr-2" /> Quay lại
              </Button>
            ) : (
              <div className="hidden sm:block" />
            )}

            <Button 
              onClick={step < 3 ? nextStep : handleGenerate}
              disabled={isGenerating}
              className="w-full sm:w-auto px-10 py-6 md:py-7 bg-hanoi-red hover:bg-[#6D1616] text-white rounded-xl md:rounded-2xl font-bold flex items-center justify-center gap-2 shadow-xl shadow-hanoi-red/20 order-1 sm:order-2"
            >
              {step < 3 ? (
                <>Tiếp tục <ArrowRight className="h-5 w-5" /></>
              ) : (
                isGenerating ? (
                  <>Đang tạo... <Loader2 className="h-5 w-5 animate-spin" /></>
                ) : (
                  <>Tạo ngay <Sparkles className="h-5 w-5" /></>
                )
              )}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
