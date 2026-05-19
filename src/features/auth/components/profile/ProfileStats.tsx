import React from "react";
import Link from "next/link";

interface ProfileStatsProps {
  itinerariesCount: number;
  savedPlacesCount: number;
  reviewsCount: number;
}

export const ProfileStats = ({ itinerariesCount, savedPlacesCount, reviewsCount }: ProfileStatsProps) => {
  return (
    <div className="grid grid-cols-3 gap-4 md:gap-8 mt-10 md:mt-14 pt-8 md:pt-10 border-t border-zinc-100/80 px-5 md:px-12 pb-8">
      <Link href="/my-itineraries" className="text-center group transition-all active:scale-95">
        <p className="text-2xl md:text-4xl font-black text-zinc-900 group-hover:text-hanoi-red transition-colors">{itinerariesCount}</p>
        <p className="text-[10px] md:text-[11px] font-black text-zinc-400 uppercase tracking-[0.2em] mt-2">Lịch trình</p>
      </Link>
      <Link href="/saved-places" className="text-center group border-x border-zinc-100/80 transition-all active:scale-95">
        <p className="text-2xl md:text-4xl font-black text-zinc-900 group-hover:text-hanoi-red transition-colors">{savedPlacesCount}</p>
        <p className="text-[10px] md:text-[11px] font-black text-zinc-400 uppercase tracking-[0.2em] mt-2">Yêu thích</p>
      </Link>
      <div className="text-center group transition-all active:scale-95">
        <p className="text-2xl md:text-4xl font-black text-zinc-900 group-hover:text-hanoi-red transition-colors">{reviewsCount}</p>
        <p className="text-[10px] md:text-[11px] font-black text-zinc-400 uppercase tracking-[0.2em] mt-2">Đánh giá</p>
      </div>
    </div>
  );
};
