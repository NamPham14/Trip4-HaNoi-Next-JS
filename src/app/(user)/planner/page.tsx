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
import { useUser } from "@/features/auth/hooks/use-auth";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { Label } from "@/shared/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Checkbox } from "@/shared/components/ui/checkbox";

export default function PlannerPage() {
  const router = useRouter();
  const { user, isAdmin } = useUser();
  const [step, setStep] = useState(1);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    days: 1,
    people: 1,
    budget: 1000000,
    selectedCategories: [] as string[],
    // Admin only fields
    description: "",
    coverImage: "",
    isSample: false,
    status: "DRAFT"
  });

  // Pattern: Adjusting state during render - Avoid cascading renders for isAdmin mode
  const [prevIsAdmin, setPrevIsAdmin] = useState<boolean | undefined>(isAdmin);
  if (isAdmin !== prevIsAdmin) {
    setPrevIsAdmin(isAdmin);
    if (isAdmin) {
      setFormData(prev => ({ ...prev, isSample: true }));
    }
  }

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
        title: formData.title || `Chuyến đi Hà Nội (${dateStr} ${timeStr})`,
        budget: formData.budget,
        days: formData.days,
        numberOfPeople: formData.people,
        categoryNames: formData.selectedCategories,
        // Admin fields
        description: formData.description,
        coverImage: formData.coverImage,
        isSample: formData.isSample,
        status: formData.status
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
            Smart Planner {isAdmin && "(Admin Mode)"}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-3 md:mb-4 tracking-tight">Lên lịch trình du lịch</h1>
          <p className="text-sm md:text-base text-zinc-500 font-medium px-4">Chỉ vài bước đơn giản, chúng tôi sẽ thiết kế chuyến đi hoàn hảo cho bạn</p>
        </div>

        <PlannerProgress step={step} totalSteps={isAdmin ? 4 : 3} />

        <div className="bg-white rounded-[32px] md:rounded-[40px] shadow-2xl shadow-hanoi-red/5 p-6 md:p-12 border border-zinc-100 min-h-[450px] md:min-h-[500px] flex flex-col">
          
          {step === 1 && (
            <div className="space-y-6">
              {isAdmin && (
                <div className="space-y-2 mb-4 p-4 bg-hanoi-cream/50 rounded-2xl border border-hanoi-gold/20">
                  <Label className="text-hanoi-red font-bold">Cấu hình Admin</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="itinerary-title">Tên lịch trình</Label>
                      <Input 
                        id="itinerary-title"
                        placeholder="VD: Tour Phố Cổ 1 ngày..."
                        value={formData.title}
                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      />
                    </div>
                    <div className="flex items-center space-x-2 pt-8">
                      <Checkbox 
                        id="is-sample" 
                        checked={formData.isSample} 
                        onCheckedChange={(val) => setFormData(prev => ({ ...prev, isSample: !!val }))}
                      />
                      <Label htmlFor="is-sample">Lịch trình mẫu (Sample)</Label>
                    </div>
                  </div>
                </div>
              )}
              <StepBasicInfo 
                days={formData.days} 
                people={formData.people} 
                onUpdate={(data) => setFormData(prev => ({ ...prev, ...data }))} 
              />
            </div>
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

          {step === 4 && isAdmin && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-2xl font-bold text-zinc-900 mb-6">Nội dung quảng bá</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="description">Mô tả lịch trình (Description)</Label>
                  <Textarea 
                    id="description"
                    placeholder="Viết một đoạn ngắn giới thiệu lịch trình này..."
                    className="min-h-[120px] rounded-2xl"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cover-image">Link ảnh minh họa (Cover Image URL)</Label>
                  <Input 
                    id="cover-image"
                    placeholder="https://images.unsplash.com/..."
                    className="rounded-xl"
                    value={formData.coverImage}
                    onChange={(e) => setFormData(prev => ({ ...prev, coverImage: e.target.value }))}
                  />
                  {formData.coverImage && (
                    <div className="mt-2 rounded-2xl overflow-hidden h-40 border">
                      <img src={formData.coverImage} className="w-full h-full object-cover" alt="Preview" />
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Trạng thái hiển thị</Label>
                  <Select value={formData.status} onValueChange={(val) => setFormData(prev => ({ ...prev, status: val }))}>
                    <SelectTrigger className="h-12 rounded-xl">
                      <SelectValue placeholder="Chọn trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DRAFT">Bản nháp (Draft)</SelectItem>
                      <SelectItem value="PUBLISHED">Công khai (Published)</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-zinc-500">
                    * Bản nháp sẽ không hiển thị cho người dùng bình thường.
                  </p>
                </div>
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
              onClick={(step < 3 || (isAdmin && step < 4)) ? nextStep : handleGenerate}
              disabled={isGenerating}
              className="w-full sm:w-auto px-10 py-6 md:py-7 bg-hanoi-red hover:bg-[#6D1616] text-white rounded-xl md:rounded-2xl font-bold flex items-center justify-center gap-2 shadow-xl shadow-hanoi-red/20 order-1 sm:order-2"
            >
              {(step < 3 || (isAdmin && step < 4)) ? (
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
