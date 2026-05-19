"use client";

import React, { useState } from "react";
import Image from "next/image";
import { MessageSquare, Star, Trash2, Flag } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { PlaceDetailResponse } from "../../types/place";
import { User } from "@/features/auth/types/auth";

interface PlaceReviewsProps {
  place: PlaceDetailResponse;
  user: User | null;
  isAuthenticated: boolean;
  onWriteReview: () => void;
  onDeleteReview: (reviewId: number) => void;
  onReportReview: (reviewId: number) => void;
}

export const PlaceReviews = ({
  place,
  user,
  isAuthenticated,
  onWriteReview,
  onDeleteReview,
  onReportReview,
}: PlaceReviewsProps) => {
  const [showAllReviews, setShowAllReviews] = useState(false);

  return (
    <section className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <MessageSquare className="h-6 w-6 text-hanoi-red" />
          Đánh giá từ cộng đồng
        </h2>
        <Button 
          onClick={onWriteReview}
          variant="outline" 
          className="font-bold border-hanoi-red text-hanoi-red hover:bg-hanoi-red hover:text-white transition-all"
        >
          Viết đánh giá
        </Button>
      </div>
      
      {place.reviews && place.reviews.length > 0 ? (
        <div className="space-y-6">
          {(() => {
            // Sort reviews by date (newest first)
            const sortedReviews = [...place.reviews].sort((a, b) => {
              const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
              const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
              return dateB - dateA;
            });
            
            const displayedReviews = showAllReviews ? sortedReviews : sortedReviews.slice(0, 3);
            
            return (
              <>
                {displayedReviews.map((review) => (
                  <div key={review.id} className="flex gap-4 p-6 bg-zinc-50 rounded-2xl border border-zinc-100 group relative">
                    <div className="h-12 w-12 rounded-full bg-hanoi-red/10 flex items-center justify-center text-hanoi-red font-bold shrink-0">
                      {review.userName?.charAt(0) || "U"}
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex justify-between items-center">
                        <h4 className="font-bold text-zinc-900">{review.userName || "Người dùng"}</h4>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-zinc-400 font-medium">
                            {review.createdAt ? new Date(review.createdAt).toLocaleDateString('vi-VN') : "Gần đây"}
                          </span>
                          {/* Action Buttons (Delete/Report) */}
                          <div className="flex items-center opacity-50 group-hover:opacity-100 transition-all">
                            {user?.id === review.userId ? (
                              <button 
                                onClick={() => onDeleteReview(review.id)}
                                className="p-1 text-zinc-400 hover:text-red-500 transition-colors"
                                title="Xóa đánh giá"
                              >
                                <Trash2 size={12} />
                              </button>
                            ) : (
                              <button 
                                onClick={() => onReportReview(review.id)}
                                className="p-1 text-zinc-400 hover:text-orange-500 transition-colors"
                                title="Báo cáo vi phạm"
                              >
                                <Flag size={12} />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-0.5 mb-1">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-3 w-3 ${i < review.rating ? "text-amber-400 fill-current" : "text-zinc-200"}`} 
                          />
                        ))}
                      </div>
                      <p className="text-zinc-600 leading-relaxed">{review.comment}</p>
                      {review.imageUrl && (
                        <div className="relative h-24 w-24 rounded-lg overflow-hidden mt-3">
                          <Image src={review.imageUrl} alt="Review" fill className="object-cover" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                
                {place.reviews.length > 3 && (
                  <div className="flex justify-center pt-4">
                    <Button 
                      variant="ghost" 
                      onClick={() => setShowAllReviews(!showAllReviews)}
                      className="font-bold text-zinc-500 hover:text-hanoi-red transition-colors"
                    >
                      {showAllReviews 
                        ? "Thu gọn đánh giá" 
                        : `Xem thêm ${place.reviews.length - 3} đánh giá`
                      }
                    </Button>
                  </div>
                )}
              </>
            );
          })()}
        </div>
      ) : (
        <div className="text-center py-12 bg-zinc-50 rounded-3xl border border-dashed border-zinc-200">
          <p className="text-zinc-400 font-medium">Chưa có đánh giá nào. Hãy là người đầu tiên!</p>
        </div>
      )}
    </section>
  );
};
