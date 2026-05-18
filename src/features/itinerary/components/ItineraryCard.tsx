import React from "react";
import { Itinerary } from "../types/itinerary";
import { Calendar, Users, Wallet, ArrowRight } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import Link from "next/link";

interface ItineraryCardProps {
  itinerary: Itinerary;
}

export const ItineraryCard: React.FC<ItineraryCardProps> = ({ itinerary }) => {
  // Placeholder images based on itinerary days or just random high-quality Hanoi pics
  const images = [
    "https://images.unsplash.com/photo-1555921015-5532091f6026?q=80&w=800",
    "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=800",
    "https://images.unsplash.com/photo-1562307534-a03738d2a81a?q=80&w=800",
    "https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=800"
  ];
  const placeholderImage = images[itinerary.id % images.length];
  const image = itinerary.coverImage || placeholderImage;

  return (
    <div className="group relative aspect-[4/5] rounded-[40px] overflow-hidden cursor-pointer shadow-2xl">
      <img 
        src={image} 
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
        alt={itinerary.title} 
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
      
      <div className="absolute bottom-0 p-6 md:p-8 w-full">
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="bg-hanoi-gold/20 backdrop-blur-md border border-hanoi-gold/30 text-hanoi-gold text-[10px] font-black px-3 py-1 rounded-full uppercase flex items-center gap-1">
            <Calendar size={10} /> {itinerary.days} ngày
          </span>
          <span className="bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase flex items-center gap-1">
            <Users size={10} /> {itinerary.numberOfPeople} người
          </span>
          <span className="bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase flex items-center gap-1">
            <Wallet size={10} /> {itinerary.budget?.toLocaleString()}đ
          </span>
        </div>
        
        <h3 className="text-xl md:text-2xl font-black text-white mb-6 leading-tight group-hover:text-hanoi-gold transition-colors line-clamp-2">
          {itinerary.title}
        </h3>
        
        <Link href={`/itinerary-detail/${itinerary.id}`}>
          <Button className="w-full bg-white text-zinc-900 font-black rounded-2xl opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300">
            Khám phá lịch trình <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
};
