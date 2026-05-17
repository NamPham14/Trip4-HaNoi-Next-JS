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

export const WeatherWidget = () => {
  const { data: weather, isLoading } = useWeather();

  if (isLoading) {
    return (
      <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-hanoi-gold/10 border border-hanoi-gold/20 rounded-full animate-pulse min-w-[80px] h-10">
        <div className="h-4 w-4 bg-hanoi-gold/30 rounded-full" />
        <div className="flex flex-col gap-1">
          <div className="h-2 w-8 bg-hanoi-gold/30 rounded-full" />
          <div className="h-3 w-6 bg-hanoi-gold/30 rounded-full" />
        </div>
      </div>
    );
  }

  const temp = weather?.temp ? Math.round(weather.temp) : 25;
  const condition = weather?.condition || "Clear";
  const iconCode = weather?.iconCode || "01d";
  const isNight = iconCode.endsWith('n');

  // Phương pháp render icon trực tiếp để tránh lỗi "Created during render"
  const renderWeatherIcon = () => {
    const iconClass = cn(
      "h-4 w-4 transition-transform group-hover:scale-110 duration-500",
      isNight ? "text-indigo-400" : (condition === 'Clear' ? "text-orange-500" : "text-zinc-500")
    );

    if (isNight && condition === 'Clear') return <Moon className={iconClass} />;
    
    switch (condition) {
      case 'Rain':
        return <CloudRain className={iconClass} />;
      case 'Drizzle':
        return <CloudDrizzle className={iconClass} />;
      case 'Thunderstorm':
        return <CloudLightning className={iconClass} />;
      case 'Snow':
        return <CloudSnow className={iconClass} />;
      case 'Clouds':
        return <Cloud className={iconClass} />;
      case 'Clear':
      default:
        return <Sun className={iconClass} />;
    }
  };

  return (
    <div 
      className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-hanoi-gold/30 border border-hanoi-gold/50 rounded-full backdrop-blur-sm transition-all hover:bg-hanoi-gold/40 cursor-default group"
      title={weather?.description || "Thời tiết Hà Nội"}
    >
      <div className="relative">
        {renderWeatherIcon()}
        {!isNight && condition === 'Clear' && (
          <div className="absolute inset-0 bg-orange-400 blur-md opacity-20 animate-pulse" />
        )}
      </div>
      <div className="flex flex-col leading-none">
        <span className="text-[10px] font-black text-hanoi-red/60 uppercase tracking-tighter">Hà Nội</span>
        <span className="text-xs font-bold text-hanoi-red">{temp}°C</span>
      </div>
    </div>
  );
};
