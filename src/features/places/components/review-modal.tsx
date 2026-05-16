"use client";

import React, { useState } from "react";
import { Star } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Textarea } from "@/shared/components/ui/textarea";
import { useSubmitReview } from "../hooks/use-places";
import { cn } from "@/shared/lib/utils";

interface ReviewModalProps {
  placeId: number;
  placeName: string;
  isOpen: boolean;
  onClose: () => void;
}

export const ReviewModal = ({ placeId, placeName, isOpen, onClose }: ReviewModalProps) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [hoveredRating, setHoveredRating] = useState(0);
  
  const submitReview = useSubmitReview();

  const handleSubmit = async () => {
    if (rating === 0) return;
    
    await submitReview.mutateAsync({
      placeId,
      rating,
      comment
    });
    
    onClose();
    setRating(0);
    setComment("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] rounded-3xl bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Đánh giá {placeName}</DialogTitle>
          <DialogDescription>
            Chia sẻ trải nghiệm của bạn về địa điểm này với mọi người.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col items-center gap-6 py-4">
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className="transition-transform active:scale-90"
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                onClick={() => setRating(star)}
              >
                <Star
                  className={cn(
                    "h-10 w-10 transition-colors",
                    (hoveredRating || rating) >= star
                      ? "text-amber-400 fill-current"
                      : "text-zinc-200"
                  )}
                />
              </button>
            ))}
          </div>
          
          <Textarea
            placeholder="Bạn thấy địa điểm này thế nào? (Không bắt buộc)"
            className="min-h-[120px] rounded-2xl border-zinc-200 focus:ring-hanoi-red"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>
        
        <DialogFooter>
          <Button
            variant="ghost"
            onClick={onClose}
            className="rounded-xl font-bold"
          >
            Hủy
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={rating === 0 || submitReview.isPending}
            className="bg-hanoi-red hover:bg-hanoi-red/90 rounded-xl font-bold px-8"
          >
            {submitReview.isPending ? "Đang gửi..." : "Gửi đánh giá"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
