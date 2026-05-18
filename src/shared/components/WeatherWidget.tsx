"use client";

import React from "react";
import { 
  Cloud, 
  Sun, 
  CloudRain, 
  Moon, 
  CloudLightning, 
  CloudDrizzle,
  CloudSnow
} from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { useWeather } from "@/features/weather/hooks/use-weather";

export const WeatherWidget = ({ variant = "compact" }: { variant?: "compact" | "full" }) => {
  const { data: weather, isLoading } = useWeather();

  if (isLoading) {
    return (
      <div className={cn(
        "flex items-center gap-2 bg-hanoi-gold/10 border border-hanoi-gold/20 rounded-full animate-pulse",
        variant === "compact" ? "px-3 py-1.5 min-w-[60px] xs:min-w-[80px] h-9 xs:h-10" : "px-6 py-4 w-full h-20"
      )}>
        <div className={cn("bg-hanoi-gold/30 rounded-full", variant === "compact" ? "h-4 w-4" : "h-8 w-8")} />
        <div className="flex flex-col gap-1">
          <div className={cn("bg-hanoi-gold/30 rounded-full", variant === "compact" ? "h-2 w-8" : "h-3 w-16")} />
          <div className={cn("bg-hanoi-gold/30 rounded-full", variant === "compact" ? "h-3 w-6" : "h-4 w-12")} />
        </div>
      </div>
    );
  }

  const temp = weather?.temp ? Math.round(weather.temp) : 25;
  const condition = weather?.condition || "Clear";
  const iconCode = weather?.iconCode || "01d";
  const isNight = iconCode.endsWith('n');

  const renderWeatherIcon = (sizeClass?: string) => {
    const iconClass = cn(
      sizeClass || (variant === "compact" ? "h-4 w-4" : "h-8 w-8"),
      "transition-transform group-hover:scale-110 duration-500",
      isNight ? "text-indigo-400" : (condition === 'Clear' ? "text-orange-500" : "text-zinc-500")
    );

    if (isNight && condition === 'Clear') return <Moon className={iconClass} />;
    
    switch (condition) {
      case 'Rain': return <CloudRain className={iconClass} />;
      case 'Drizzle': return <CloudDrizzle className={iconClass} />;
      case 'Thunderstorm': return <CloudLightning className={iconClass} />;
      case 'Snow': return <CloudSnow className={iconClass} />;
      case 'Clouds': return <Cloud className={iconClass} />;
      case 'Clear':
      default: return <Sun className={iconClass} />;
    }
  };

  if (variant === "full") {
    return (
      <div className="w-full bg-white/50 border border-hanoi-gold/20 rounded-3xl p-4 flex items-center justify-between group transition-all hover:bg-white/80">
        <div className="flex items-center gap-3">
          <div className="relative bg-hanoi-gold/20 p-2.5 rounded-xl">
            {renderWeatherIcon("h-7 w-7")}
            {!isNight && condition === 'Clear' && (
              <div className="absolute inset-0 bg-orange-400 blur-lg opacity-20 animate-pulse" />
            )}
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] font-black text-hanoi-red/40 uppercase tracking-[0.2em]">Thời tiết Hà Nội</span>
            <span className="text-base font-black text-zinc-900 leading-tight">{weather?.description || "Trời quang"}</span>
          </div>
        </div>
        <div className="text-right leading-none">
          <span className="text-2xl font-black text-hanoi-red">{temp}°C</span>
          <div className="flex items-center justify-end gap-1 mt-0.5">
            <span className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest">Cảm giác {Math.round(weather?.feelsLike || temp)}°C</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="flex items-center gap-1.5 xs:gap-2 px-2 xs:px-3 py-1 xs:py-1.5 bg-hanoi-gold/30 border border-hanoi-gold/50 rounded-full backdrop-blur-sm transition-all hover:bg-hanoi-gold/40 cursor-default group"
      title={weather?.description || "Thời tiết Hà Nội"}
    >
      <div className="relative">
        {renderWeatherIcon()}
        {!isNight && condition === 'Clear' && (
          <div className="absolute inset-0 bg-orange-400 blur-md opacity-20 animate-pulse" />
        )}
      </div>
      <div className="flex flex-col leading-none">
        <span className="hidden xs:block text-[8px] xs:text-[10px] font-black text-hanoi-red/60 uppercase tracking-tighter">Hà Nội</span>
        <span className="text-[10px] xs:text-xs font-bold text-hanoi-red">{temp}°C</span>
      </div>
    </div>
  );
};
