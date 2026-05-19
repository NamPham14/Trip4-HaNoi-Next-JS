/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { usePlaceDetail, useFavoriteStatus, useToggleFavorite, useDeleteReview } from "@/features/places/hooks/use-places";
import { Navbar } from "@/shared/components/navbar";
import { Info, Loader2, Heart } from "lucide-react";
import Link from "next/link";
import { Button } from "@/shared/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/shared/lib/utils";

import { ReviewModal } from "@/features/places/components/review-modal";
import { useUser } from "@/features/auth/hooks/use-auth";
import { ReportModal } from "@/features/posts/components/ReportModal";
import { DeleteConfirmDialog } from "@/shared/components/ui/delete-confirm-dialog";

// New Components
import { PlaceHero } from "@/features/places/components/place-detail/PlaceHero";
import { PlaceInfo } from "@/features/places/components/place-detail/PlaceInfo";
import { PlaceReviews } from "@/features/places/components/place-detail/PlaceReviews";
import { PlaceSidebar } from "@/features/places/components/place-detail/PlaceSidebar";
import { PlaceSkeleton } from "@/features/places/components/place-detail/PlaceSkeleton";

export default function PlaceDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { user, isAuthenticated } = useUser();

  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  // Report Modal State
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportTargetId, setReportTargetId] = useState<number | null>(null);

  const { data: place, isLoading, error } = usePlaceDetail(id);
  const { data: isFavoriteStatus } = useFavoriteStatus(id);
  const toggleFavoriteMutation = useToggleFavorite();

  // Review Delete State
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedReviewId, setSelectedReviewId] = useState<number | null>(null);
  const deleteReviewMutation = useDeleteReview();

  if (isLoading) {
    return <PlaceSkeleton />;
  }

  if (error || !place) {
    return (
      <div className="min-h-screen bg-hanoi-cream flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold text-zinc-900 mb-2">Không tìm thấy địa điểm</h2>
        <p className="text-zinc-500 mb-6">Có vẻ như địa điểm này không tồn tại hoặc đã bị gỡ bỏ.</p>
        <Link href="/explore">
          <Button className="bg-hanoi-red hover:bg-hanoi-red/90 font-bold">Quay lại khám phá</Button>
        </Link>
      </div>
    );
  }

  const handleToggleFavorite = async () => {
    if (!isAuthenticated) {
      toast.error("Vui lòng đăng nhập để lưu địa điểm yêu thích");
      return;
    }
    toggleFavoriteMutation.mutate(Number(id));
  };

  const handleReportReview = (reviewId: number) => {
    if (!isAuthenticated) {
      toast.error("Vui lòng đăng nhập để báo cáo vi phạm");
      return;
    }
    setReportTargetId(reviewId);
    setIsReportModalOpen(true);
  };

  const handleDeleteClick = (reviewId: number) => {
    setSelectedReviewId(reviewId);
    setIsDeleteOpen(true);
  };

  const confirmDeleteReview = async () => {
    if (selectedReviewId) {
      deleteReviewMutation.mutate(selectedReviewId, {
        onSuccess: () => {
          setIsDeleteOpen(false);
          setSelectedReviewId(null);
        }
      });
    }
  };

  const isDeleting = deleteReviewMutation.isPending;
  const isFavorite = !!isFavoriteStatus;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      <main className="flex-1 pb-32 lg:pb-20">
        <PlaceHero 
          place={place} 
          isFavorite={isFavorite} 
          isPending={toggleFavoriteMutation.isPending} 
          onToggleFavorite={handleToggleFavorite} 
        />

        <div className="container mx-auto px-4 mt-6 md:mt-12">
          {/* Mobile Quick Info (Price & Address) */}
          <div className="lg:hidden bg-zinc-50 border border-zinc-100 rounded-3xl p-5 mb-8 space-y-4">
            <div className="flex justify-between items-center">
              <div className="space-y-0.5">
                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Giá trung bình</p>
                <p className="text-xl font-black text-hanoi-red">
                  {place.priceAvg > 0 ? `${place.priceAvg.toLocaleString()}đ` : "Giá liên hệ"}
                </p>
              </div>
              <div className="w-12 h-12 bg-hanoi-red/10 rounded-2xl flex items-center justify-center text-hanoi-red">
                <Info className="h-6 w-6" />
              </div>
            </div>
            <div className="space-y-0.5 pt-3 border-t border-zinc-200/50">
              <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Địa chỉ</p>
              <p className="text-sm font-bold text-zinc-800 leading-snug">{place.address}</p>
            </div>
          </div>

          <div className="flex flex-col lg:grid lg:grid-cols-3 gap-8 md:gap-12">
            {/* Left Content */}
            <div className="lg:col-span-2 space-y-10 md:space-y-12">
              <PlaceInfo place={place} />
              
              <PlaceReviews 
                place={place}
                user={user}
                isAuthenticated={isAuthenticated}
                onWriteReview={() => {
                  if (!isAuthenticated) {
                    toast.error("Vui lòng đăng nhập để viết đánh giá");
                    return;
                  }
                  setIsReviewModalOpen(true);
                }}
                onDeleteReview={handleDeleteClick}
                onReportReview={handleReportReview}
              />
            </div>

            {/* Right Sidebar (Responsive) */}
            <PlaceSidebar place={place} isAuthenticated={isAuthenticated} />
          </div>
        </div>
      </main>

      <ReviewModal 
        isOpen={isReviewModalOpen} 
        onClose={() => setIsReviewModalOpen(false)} 
        placeId={Number(id)}
        placeName={place.name}
      />

      {reportTargetId && (
        <ReportModal
          isOpen={isReportModalOpen}
          onClose={() => setIsReportModalOpen(false)}
          targetId={reportTargetId}
          reportType="REVIEW"
        />
      )}

      <DeleteConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        title="Xóa đánh giá"
        description="Bạn có chắc chắn muốn xóa đánh giá này? Hành động này không thể hoàn tác."
        onConfirm={confirmDeleteReview}
        isLoading={isDeleting}
      />

      {/* Sticky Bottom Action Bar (Mobile Only) */}
      <div className="fixed bottom-0 left-0 right-0 z-[40] bg-white/80 backdrop-blur-xl border-t border-zinc-100 p-4 md:hidden flex items-center gap-3 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
        <button 
          onClick={handleToggleFavorite}
          disabled={toggleFavoriteMutation.isPending}
          className={cn(
            "p-3.5 rounded-2xl transition-all border shrink-0",
            isFavorite 
              ? "bg-hanoi-red border-hanoi-red text-white shadow-lg shadow-hanoi-red/20" 
              : "bg-zinc-50 border-zinc-100 text-zinc-400"
          )}
        >
          {toggleFavoriteMutation.isPending ? (
            <Loader2 className="h-6 w-6 animate-spin" />
          ) : (
            <Heart className={cn("h-6 w-6", isFavorite && "fill-current")} />
          )}
        </button>
        <Button 
          onClick={() => {
            if (!isAuthenticated) {
              toast.error("Vui lòng đăng nhập để sử dụng tính năng chỉ đường");
              return;
            }
            window.open(`https://www.google.com/maps/dir/?api=1&destination=${place.latitude},${place.longitude}`, '_blank');
          }}
          className="flex-1 bg-hanoi-red hover:bg-hanoi-red/90 h-14 rounded-2xl font-bold text-base shadow-lg shadow-hanoi-red/20 active:scale-[0.98] transition-all"
        >
          Chỉ đường đi ngay
        </Button>
      </div>
    </div>
  );
}
