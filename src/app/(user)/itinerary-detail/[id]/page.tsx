"use client";

import React, { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { Navbar } from "@/shared/components/navbar";
import { itineraryService } from "@/features/itinerary/services/itinerary-api";
import { Itinerary, ItineraryPlace } from "@/features/itinerary/types/itinerary";
import { MapPin, Clock, Users, Wallet, ArrowLeft, Info, Calendar, Map as MapIcon, List, Loader2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import Link from "next/link";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { cn } from "@/shared/lib/utils";

import { useLocationStore } from "@/shared/store/location-store";

// Component Bản đồ bền bỉ
const ItineraryMap = ({ places }: { places: ItineraryPlace[] }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const layerGroupRef = useRef<any>(null);
  const userMarkerRef = useRef<any>(null);
  const [isLeafletReady, setIsLeafletReady] = useState(false);
  const { lat: userLat, lng: userLng } = useLocationStore();

  // Effect 1: Load Leaflet script and CSS
  useEffect(() => {
    if (typeof window === "undefined") return;

    const checkLeaflet = () => {
      if ((window as any).L) {
        setIsLeafletReady(true);
        return true;
      }
      return false;
    };

    if (checkLeaflet()) return;

    // Load CSS
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement("link");
      link.id = 'leaflet-css';
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }

    // Load JS
    if (!document.getElementById('leaflet-js')) {
      const script = document.createElement("script");
      script.id = 'leaflet-js';
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      script.async = true;
      script.onload = () => {
        const interval = setInterval(() => {
          if ((window as any).L) {
            clearInterval(interval);
            setIsLeafletReady(true);
          }
        }, 100);
      };
      document.head.appendChild(script);
    } else {
      const interval = setInterval(() => {
        if ((window as any).L) {
          clearInterval(interval);
          setIsLeafletReady(true);
        }
      }, 100);
    }
  }, []);

  // Effect 2: Initialize Map
  useEffect(() => {
    if (!isLeafletReady || !mapContainerRef.current || mapRef.current) return;

    const L = (window as any).L;
    if (!L) return;

    try {
      mapContainerRef.current.innerHTML = "";
      
      const map = L.map(mapContainerRef.current, {
        zoomControl: true,
        scrollWheelZoom: true
      }).setView([21.0285, 105.8542], 13);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; OpenStreetMap'
      }).addTo(map);

      const layerGroup = L.featureGroup().addTo(map);
      layerGroupRef.current = layerGroup;
      mapRef.current = map;
    } catch (error) {
      console.error("Error initializing Leaflet map:", error);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        layerGroupRef.current = null;
        userMarkerRef.current = null;
      }
    };
  }, [isLeafletReady]);

  // Effect: Update User Location (Blue Dot)
  useEffect(() => {
    const L = (window as any).L;
    if (!isLeafletReady || !mapRef.current || !L || !userLat || !userLng) return;

    if (userMarkerRef.current) {
      userMarkerRef.current.setLatLng([userLat, userLng]);
    } else {
      const userIcon = L.divIcon({
        className: 'user-location-icon',
        html: `<div style="width: 20px; height: 20px; background-color: #3B82F6; border: 3px solid white; border-radius: 50%; box-shadow: 0 0 10px rgba(59, 130, 246, 0.5); position: relative;"><div style="position: absolute; width: 100%; height: 100%; border-radius: 50%; background-color: #3B82F6; opacity: 0.3; animation: pulse 2s infinite;"></div></div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10]
      });

      // Add custom style for pulse animation if not exists
      if (!document.getElementById('map-animations')) {
        const style = document.createElement('style');
        style.id = 'map-animations';
        style.innerHTML = `@keyframes pulse { 0% { transform: scale(1); opacity: 0.6; } 100% { transform: scale(3); opacity: 0; } }`;
        document.head.appendChild(style);
      }

      userMarkerRef.current = L.marker([userLat, userLng], { icon: userIcon, zIndexOffset: 1000 })
        .addTo(mapRef.current)
        .bindPopup("<p style='font-weight: bold; font-size: 12px; margin: 0;'>Vị trí của bạn</p>");
    }
  }, [userLat, userLng, isLeafletReady]);

  // Effect 3: Update markers and ROAD-BASED routing
  useEffect(() => {
    const L = (window as any).L;
    if (!isLeafletReady || !mapRef.current || !layerGroupRef.current || !L) return;

    const layerGroup = layerGroupRef.current;
    layerGroup.clearLayers();

    if (places && places.length > 0) {
      const latlngs: [number, number][] = [];

      places.forEach((place, idx) => {
        if (!place.latitude || !place.longitude) return;
        
        const pos: [number, number] = [place.latitude, place.longitude];
        latlngs.push(pos);

        const gMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${place.latitude},${place.longitude}`;

        const marker = L.marker(pos, {
          icon: L.divIcon({
            className: 'custom-div-icon',
            html: `<div style="width: 30px; height: 30px; background-color: #8B1D1D; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.2); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 11px;">${idx + 1}</div>`,
            iconSize: [30, 30],
            iconAnchor: [15, 30]
          })
        }).bindPopup(`
          <div style="padding: 5px; min-width: 150px;">
            <p style="font-weight: bold; margin: 0; font-size: 13px; color: #18181b;">${place.placeName}</p>
            <p style="margin: 3px 0 8px; font-size: 11px; color: #71717a;">${place.session}</p>
            <a href="${gMapsUrl}" target="_blank" rel="noopener noreferrer" style="display: block; width: 100%; text-align: center; background-color: #8B1D1D; color: white; padding: 6px; border-radius: 8px; font-size: 10px; font-weight: bold; text-decoration: none;">
              Chỉ đường bằng Google Maps
            </a>
          </div>
        `);
        
        layerGroup.addLayer(marker);
      });

      // Lấy lộ trình thực tế từ OSRM (Open Source Routing Machine)
      if (latlngs.length > 1) {
        const coordinates = latlngs.map(p => `${p[1]},${p[0]}`).join(';');
        const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${coordinates}?overview=full&geometries=geojson`;

        fetch(osrmUrl)
          .then(res => res.json())
          .then(data => {
            if (data.code === 'Ok' && data.routes && data.routes[0]) {
              const roadLatLngs = data.routes[0].geometry.coordinates.map((c: any) => [c[1], c[0]]);
              const polyline = L.polyline(roadLatLngs, { 
                color: '#8B1D1D', 
                weight: 4, 
                opacity: 0.6,
                lineCap: 'round',
                lineJoin: 'round'
              });
              layerGroup.addLayer(polyline);
            } else {
              // Fallback to straight lines if OSRM fails
              const polyline = L.polyline(latlngs, { color: '#8B1D1D', weight: 3, opacity: 0.5, dashArray: '5, 8' });
              layerGroup.addLayer(polyline);
            }
          })
          .catch(() => {
            const polyline = L.polyline(latlngs, { color: '#8B1D1D', weight: 3, opacity: 0.5, dashArray: '5, 8' });
            layerGroup.addLayer(polyline);
          });
      }

      try {
        const bounds = layerGroup.getBounds();
        if (bounds.isValid()) {
          mapRef.current.fitBounds(bounds, { padding: [50, 50] });
        }
      } catch (e) {}
    }
  }, [places, isLeafletReady, mapRef.current]);

  return <div ref={mapContainerRef} className="h-full w-full z-0 bg-zinc-100" style={{ minHeight: '400px' }} />;
};

export default function ItineraryDetailPage() {
  const { id } = useParams();
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const data = await itineraryService.getItineraryDetail(Number(id));
        setItinerary(data);
      } catch (error) {
        console.error("Failed to fetch itinerary detail", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  const allPlaces = itinerary?.itineraryDays.flatMap(day => day.places) || [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-hanoi-cream/30">
        <Navbar />
        <div className="container mx-auto py-10 px-4 text-center">
          <Loader2 className="h-10 w-10 animate-spin text-hanoi-red mx-auto mb-4" />
          <p className="text-zinc-500 font-medium">Đ đang tải lịch trình...</p>
        </div>
      </div>
    );
  }

  if (!itinerary) {
    return (
      <div className="min-h-screen bg-hanoi-cream/30">
        <Navbar />
        <div className="container mx-auto py-20 text-center">
          <h1 className="text-2xl font-bold">Không tìm thấy lịch trình</h1>
          <Link href="/my-itineraries" className="mt-4 inline-block text-hanoi-red font-bold underline">Quay lại danh sách</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-hanoi-cream/30">
      <Navbar />

      <main className="container mx-auto py-8 md:py-10 px-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <Link href="/my-itineraries" className="inline-flex items-center gap-2 text-zinc-500 font-bold hover:text-hanoi-red transition-colors group">
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Quay lại danh sách
          </Link>

          <div className="flex bg-white p-1 rounded-xl border border-zinc-100 shadow-sm">
            <button 
              onClick={() => setViewMode('list')}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all",
                viewMode === 'list' ? "bg-hanoi-red text-white shadow-md" : "text-zinc-500 hover:bg-zinc-50"
              )}
            >
              <List className="h-4 w-4" /> Danh sách
            </button>
            <button 
              onClick={() => setViewMode('map')}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all",
                viewMode === 'map' ? "bg-hanoi-red text-white shadow-md" : "text-zinc-500 hover:bg-zinc-50"
              )}
            >
              <MapIcon className="h-4 w-4" /> Bản đồ lộ trình
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className={cn(
            "lg:col-span-7 space-y-8",
            viewMode === 'map' && "hidden lg:block"
          )}>
            <div className="bg-white rounded-[32px] shadow-xl overflow-hidden border border-zinc-100">
              <div className="bg-zinc-900 text-white p-6 md:p-10">
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge className="bg-hanoi-gold text-hanoi-red border-none font-bold text-[10px] py-1 px-3">
                    {itinerary.days} NGÀY
                  </Badge>
                  <Badge variant="outline" className="text-white border-white/20 font-bold text-[10px] py-1 px-3">
                    {itinerary.numberOfPeople} NGƯỜI
                  </Badge>
                </div>
                <h1 className="text-2xl md:text-3xl font-bold mb-6 tracking-tight">{itinerary.title}</h1>
                
                <div className="grid grid-cols-2 gap-4 max-w-md">
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-sm">
                    <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest mb-1">Dự tính chi phí</p>
                    <p className="font-bold text-lg text-hanoi-gold">{itinerary.budget.toLocaleString()}đ</p>
                  </div>
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-sm">
                    <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest mb-1">Loại chuyến đi</p>
                    <p className="font-bold text-sm text-white">Khám phá Thủ đô</p>
                  </div>
                </div>
              </div>

              <div className="p-6 md:p-8">
                <div className="space-y-12">
                  {itinerary.itineraryDays.map((day) => (
                    <div key={day.dayNumber}>
                      <div className="flex items-center gap-4 mb-8">
                        <div className="h-10 w-10 rounded-full bg-hanoi-red text-white flex items-center justify-center font-bold text-lg shadow-lg shadow-hanoi-red/20">
                          {day.dayNumber}
                        </div>
                        <h3 className="text-xl font-bold text-zinc-900">Ngày {day.dayNumber}</h3>
                        <div className="h-px flex-1 bg-zinc-100" />
                      </div>

                      <div className="ml-5 border-l-2 border-dashed border-zinc-100 pl-10 space-y-8">
                        {day.places.map((place, idx) => (
                          <div key={place.id} className="relative group">
                            <div className="absolute -left-[51px] top-1 w-5 h-5 rounded-full bg-white border-4 border-hanoi-red group-hover:scale-125 transition-transform" />
                            
                            <div className="bg-zinc-50 rounded-2xl p-5 border border-zinc-100 hover:bg-white hover:shadow-xl hover:border-hanoi-gold/30 transition-all duration-300">
                              <div className="flex gap-5">
                                {place.imageUrl && (
                                  <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0 border border-zinc-200 shadow-sm">
                                    <img src={place.imageUrl} alt={place.placeName} className="w-full h-full object-cover" />
                                  </div>
                                )}
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-2">
                                    <Badge variant="secondary" className="bg-hanoi-red/10 text-hanoi-red border-none font-bold text-[10px] px-2 py-0">
                                      {place.session}
                                    </Badge>
                                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1">
                                      <Clock className="h-3 w-3" /> 2-3h
                                    </span>
                                  </div>
                                  <h4 className="font-bold text-zinc-900 text-base mb-1 truncate">{place.placeName}</h4>
                                  <p className="text-[12px] text-zinc-500 flex items-center gap-1.5 line-clamp-1">
                                    <MapPin className="h-3.5 w-3.5 text-hanoi-red" /> {place.address}
                                  </p>
                                  <div className="mt-4 pt-3 border-t border-zinc-200/50 flex items-center justify-between">
                                    <span className="text-xs font-bold text-zinc-900">
                                      Chi phí: <span className="text-hanoi-red">{place.estimatedCost.toLocaleString()}đ</span>
                                    </span>
                                    <Link href={`/places/${place.placeId}`}>
                                      <Button variant="ghost" size="sm" className="h-7 text-[10px] font-bold text-hanoi-red hover:bg-hanoi-red/5">
                                        Chi tiết <Info className="ml-1 h-3 w-3" />
                                      </Button>
                                    </Link>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className={cn(
            "lg:col-span-5",
            viewMode === 'list' && "hidden lg:block"
          )}>
            <div className="sticky top-24 h-[60vh] lg:h-[80vh] bg-white rounded-[32px] shadow-2xl shadow-hanoi-red/5 border border-zinc-100 overflow-hidden">
              <div className="absolute top-6 left-6 z-10 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl border border-zinc-200 shadow-sm flex items-center gap-3">
                <div className="w-8 h-8 bg-hanoi-red rounded-xl flex items-center justify-center text-white">
                  <MapIcon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Góc nhìn</p>
                  <p className="text-xs font-bold text-zinc-900">Bản đồ lộ trình</p>
                </div>
              </div>
              <ItineraryMap places={allPlaces} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
