/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/shared/components/navbar";
import { Button } from "@/shared/components/ui/button";
import { 
  Sparkles, 
  ArrowRight, 
  ChevronLeft,
  Loader2
} from "lucide-react";
import { categoryService } from "@/features/category/services/category-api";
import { itineraryService } from "@/features/itinerary/services/itinerary-api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { StepBasicInfo } from "@/features/itinerary/components/planner/StepBasicInfo";
import { StepInterests } from "@/features/itinerary/components/planner/StepInterests";
import { StepBudget } from "@/features/itinerary/components/planner/StepBudget";
import { PlannerProgress } from "@/features/itinerary/components/planner/PlannerProgress";

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
        if (data && Array.isArray(data.data)) {
          setCategories(data.data);
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

        <PlannerProgress step={step} totalSteps={3} />

        <div className="bg-white rounded-[32px] md:rounded-[40px] shadow-2xl shadow-hanoi-red/5 p-6 md:p-12 border border-zinc-100 min-h-[450px] md:min-h-[500px] flex flex-col">
          
          {step === 1 && (
            <StepBasicInfo 
              days={formData.days} 
              people={formData.people} 
              onUpdate={(data) => setFormData(prev => ({ ...prev, ...data }))} 
            />
          )}

          {step === 2 && (
            <StepInterests 
              categories={categories}
              selectedCategories={formData.selectedCategories}
              isLoading={isLoading}
              onToggleCategory={toggleCategory}
            />
          )}

          {step === 3 && (
            <StepBudget 
              budget={formData.budget}
              onUpdate={(budget) => setFormData(prev => ({ ...prev, budget }))}
            />
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
