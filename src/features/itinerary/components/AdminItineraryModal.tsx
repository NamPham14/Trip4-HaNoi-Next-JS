/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { Label } from "@/shared/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Itinerary } from "../types/itinerary";
import { categoryService } from "@/features/category/services/category-api";
import { Loader2, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { itineraryService } from "../services/itinerary-api";
import { useQuery } from "@tanstack/react-query";

interface AdminItineraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  itinerary: Itinerary | null; // null means Create mode
  onSuccess: () => void;
}

// Định nghĩa kiểu dữ liệu cho Form để tránh lỗi TypeScript
type ItineraryStatusType = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

interface FormDataState {
  title: string;
  days: number;
  people: number;
  budget: number;
  selectedCategories: string[];
  description: string;
  coverImage: string;
  status: ItineraryStatusType;
  isSample: boolean;
}

export function AdminItineraryModal({
  isOpen,
  onClose,
  itinerary,
  onSuccess
}: AdminItineraryModalProps) {
  const [loading, setLoading] = useState(false);

  // 1. Dùng useQuery để lấy danh mục (Tự động quản lý state, tránh lỗi cascading render)
  const { data: categoriesRes, isLoading: fetchingCategories } = useQuery({
    queryKey: ["categories", "all"],
    queryFn: () => categoryService.getAllCategories({ size: 100 }),
    enabled: isOpen, // Chỉ fetch khi modal mở
  });
  
  const categories = categoriesRes?.data || [];

  // 2. KHỞI TẠO STATE TRỰC TIẾP TỪ PROPS
  // Component cha có 'key' nên state này sẽ được reset hoàn toàn mỗi khi đóng/mở
  const [formData, setFormData] = useState<FormDataState>({
    title: itinerary?.title || "",
    days: itinerary?.days || 1,
    people: itinerary?.numberOfPeople || 1,
    budget: itinerary?.budget || 1000000,
    selectedCategories: [], 
    description: itinerary?.description || "",
    coverImage: itinerary?.coverImage || "",
    status: (itinerary?.status as ItineraryStatusType) || "DRAFT",
    isSample: itinerary?.isSample ?? true
  });

  const handleSubmit = async () => {
    if (!formData.title) {
      toast.error("Vui lòng nhập tiêu đề");
      return;
    }

    setLoading(true);
    try {
      if (itinerary) {
        await itineraryService.updateItinerary(itinerary.id, {
          title: formData.title,
          description: formData.description,
          coverImage: formData.coverImage,
          status: formData.status,
          isSample: formData.isSample
        });
        toast.success("Cập nhật lịch trình thành công");
      } else {
        await itineraryService.createItinerary({
          title: formData.title,
          days: formData.days,
          numberOfPeople: formData.people,
          budget: formData.budget,
          categoryNames: formData.selectedCategories,
          description: formData.description,
          coverImage: formData.coverImage,
          isSample: formData.isSample,
          status: formData.status
        });
        toast.success("Đã tạo và gợi ý lịch trình thành công");
      }
      onSuccess();
      onClose();
    } catch (error) {
      toast.error("Thao tác thất bại");
    } finally {
      setLoading(false);
    }
  };

  const toggleCategory = (name: string) => {
    setFormData(prev => ({
      ...prev,
      selectedCategories: prev.selectedCategories.includes(name)
        ? prev.selectedCategories.filter(c => c !== name)
        : [...prev.selectedCategories, name]
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto rounded-[32px] border-none shadow-2xl bg-white p-0">
        <div className="p-6 md:p-8">
          <DialogHeader className="mb-6">
            <DialogTitle className="text-2xl font-bold text-zinc-900">
              {itinerary ? "Chỉnh sửa lịch trình" : "Tạo lịch trình mẫu mới"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="font-bold text-zinc-700">Tiêu đề</Label>
                <Input 
                  id="title" 
                  value={formData.title} 
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  placeholder="VD: Khám phá Hà Nội 2 ngày 1 đêm"
                  className="rounded-xl h-11 border-zinc-200 focus:border-hanoi-red/50 focus:ring-hanoi-red/5"
                />
              </div>
              <div className="space-y-2">
                <Label className="font-bold text-zinc-700">Trạng thái</Label>
                <Select 
                  value={formData.status} 
                  onValueChange={(val: ItineraryStatusType) => setFormData({...formData, status: val})}
                >
                  <SelectTrigger className="w-full rounded-xl h-11 bg-white border-zinc-200">
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
              
                  <SelectContent position="popper" className="z-[200] bg-white border border-zinc-200 shadow-[0_10px_50px_rgba(0,0,0,0.2)] rounded-2xl min-w-[200px] p-1 animate-in fade-in zoom-in-95 duration-200">
                    <SelectItem value="DRAFT" className="rounded-lg focus:bg-zinc-50 cursor-pointer py-3 px-4 font-bold text-zinc-700 transition-colors">Bản nháp (Draft)</SelectItem>
                    <SelectItem value="PUBLISHED" className="rounded-lg focus:bg-zinc-50 cursor-pointer py-3 px-4 font-bold text-zinc-700 transition-colors">Công khai (Published)</SelectItem>
                    <SelectItem value="ARCHIVED" className="rounded-lg focus:bg-zinc-50 cursor-pointer py-3 px-4 font-bold text-zinc-700 transition-colors">Lưu trữ (Archived)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {!itinerary && (
              <>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="font-bold text-zinc-700">Số ngày</Label>
                    <Input 
                      type="number" 
                      min={1} 
                      value={formData.days} 
                      onChange={e => setFormData({...formData, days: parseInt(e.target.value)})}
                      className="rounded-xl h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-bold text-zinc-700">Số người</Label>
                    <Input 
                      type="number" 
                      min={1} 
                      value={formData.people} 
                      onChange={e => setFormData({...formData, people: parseInt(e.target.value)})}
                      className="rounded-xl h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-bold text-zinc-700">Ngân sách (VNĐ)</Label>
                    <Input 
                      type="number" 
                      step={100000} 
                      value={formData.budget} 
                      onChange={e => setFormData({...formData, budget: parseInt(e.target.value)})}
                      className="rounded-xl h-11"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="font-bold text-zinc-700">Sở thích / Chủ đề</Label>
                  <div className="flex flex-wrap gap-2 p-3 bg-zinc-50 rounded-2xl border border-zinc-100 min-h-[60px]">
                    {fetchingCategories ? (
                      <div className="w-full flex justify-center py-2"><Loader2 className="animate-spin h-5 w-5 text-zinc-400" /></div>
                    ) : 
                      categories.map((cat: any) => (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => toggleCategory(cat.name)}
                          className={`px-3 py-1.5 rounded-full text-[11px] font-bold border transition-all ${
                            formData.selectedCategories.includes(cat.name)
                              ? "bg-hanoi-red text-white border-hanoi-red shadow-md"
                              : "bg-white text-zinc-500 border-zinc-200 hover:border-hanoi-red/50 hover:text-hanoi-red"
                          }`}
                        >
                          {cat.name}
                        </button>
                      ))
                    }
                  </div>
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label htmlFor="description" className="font-bold text-zinc-700">Mô tả ngắn</Label>
              <Textarea 
                id="description" 
                value={formData.description} 
                onChange={e => setFormData({...formData, description: e.target.value})}
                placeholder="Một đoạn mô tả hấp dẫn về lịch trình này..."
                className="rounded-xl min-h-[100px] border-zinc-200 focus:border-hanoi-red/50 focus:ring-hanoi-red/5 resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cover" className="font-bold text-zinc-700">Link ảnh bìa (URL)</Label>
              <div className="flex gap-3">
                <Input 
                  id="cover" 
                  value={formData.coverImage} 
                  onChange={e => setFormData({...formData, coverImage: e.target.value})}
                  placeholder="https://images.unsplash.com/..."
                  className="rounded-xl h-11 border-zinc-200"
                />
                <div className="w-11 h-11 shrink-0 bg-zinc-100 rounded-xl border border-zinc-200 flex items-center justify-center overflow-hidden shadow-inner">
                  {formData.coverImage ? <img src={formData.coverImage} className="w-full h-full object-cover" alt="Preview" /> : <ImageIcon className="text-zinc-400 h-5 w-5" />}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-4 bg-hanoi-cream/30 rounded-2xl border border-hanoi-gold/10">
              <Checkbox 
                id="sample-check" 
                checked={formData.isSample} 
                onCheckedChange={val => setFormData({...formData, isSample: !!val})}
                className="border-zinc-300 data-[state=checked]:bg-hanoi-red data-[state=checked]:border-hanoi-red"
              />
              <Label htmlFor="sample-check" className="text-sm font-bold text-zinc-700 cursor-pointer">Đặt làm Lịch trình mẫu (System Sample)</Label>
            </div>
          </div>

          <DialogFooter className="mt-8 gap-3 sm:gap-2">
            <Button type="button" variant="outline" onClick={onClose} className="rounded-xl h-12 px-8 border-zinc-200 text-zinc-600 hover:bg-zinc-50 font-bold">Hủy</Button>
            <Button 
              type="button"
              onClick={handleSubmit} 
              disabled={loading}
              className="bg-hanoi-red hover:bg-[#6D1616] text-white rounded-xl h-12 shadow-lg shadow-hanoi-red/20 px-10 font-bold transition-all active:scale-95 flex-1 sm:flex-none"
            >
              {loading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null}
              {itinerary ? "Lưu thay đổi" : "Tạo và Gợi ý ngay"}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
