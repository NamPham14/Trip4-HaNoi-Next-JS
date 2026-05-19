"use client";

import React from "react";
import Script from "next/script";
import { Loader2 } from "lucide-react";
import { useLocationStore } from "@/shared/store/location-store";

interface PlaceMapProps {
  lat: number;
  lng: number;
  name: string;
}

export const PlaceMap = ({ lat, lng, name }: PlaceMapProps) => {
  const mapContainerRef = React.useRef<HTMLDivElement>(null);
  const mapRef = React.useRef<any>(null);
  const [isLeafletReady, setIsLeafletReady] = React.useState(false);
  const [isMapLoaded, setIsMapLoaded] = React.useState(false);
  const { lat: userLat, lng: userLng } = useLocationStore();

  // Robust check for Leaflet availability
  React.useEffect(() => {
    const checkL = () => {
      if ((window as any).L) {
        setIsLeafletReady(true);
        return true;
      }
      return false;
    };

    if (!checkL()) {
      const interval = setInterval(() => {
        if (checkL()) clearInterval(interval);
      }, 100);
      return () => clearInterval(interval);
    }
  }, []);

  // Safety timeout: Hide loading after 3.5s no matter what
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsMapLoaded(true);
    }, 3500);
    return () => clearTimeout(timer);
  }, []);

  React.useEffect(() => {
    if (!isLeafletReady || !mapContainerRef.current || mapRef.current) return;
    const L = (window as any).L;
    if (!L) return;

    try {
      const map = L.map(mapContainerRef.current, {
        zoomControl: false,
        scrollWheelZoom: false,
        dragging: true,
        touchZoom: true,
        zoomAnimation: true,
        fadeAnimation: false
      }).setView([lat, lng], 15);

      const tiles = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; OpenStreetMap'
      });

      // Hide spinner as soon as tiles start arriving or map is ready
      tiles.on('load', () => setIsMapLoaded(true));
      map.whenReady(() => {
        // Fallback: if tiles are taking too long but map structure is there
        setTimeout(() => setIsMapLoaded(true), 1000);
      });

      tiles.addTo(map);

      const customIcon = L.divIcon({
        className: 'custom-marker',
        html: `<div style="width: 30px; height: 30px; background-color: #8B1D1D; border-radius: 50%; border: 3px solid white; display: flex; align-items: center; justify-content: center; color: white; box-shadow: 0 4px 10px rgba(0,0,0,0.3);"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg></div>`,
        iconSize: [30, 30],
        iconAnchor: [15, 30]
      });

      L.marker([lat, lng], { icon: customIcon }).addTo(map).bindPopup(`<strong>${name}</strong>`);
      
      if (userLat && userLng) {
        const fetchRoute = async () => {
          try {
            const response = await fetch(
              `https://router.project-osrm.org/route/v1/driving/${userLng},${userLat};${lng},${lat}?overview=full&geometries=geojson`
            );
            const data = await response.json();
            
            if (data.routes && data.routes[0]) {
              const route = data.routes[0].geometry;
              L.geoJSON(route, {
                style: {
                  color: '#8B1D1D',
                  weight: 5,
                  opacity: 0.6,
                  dashArray: '5, 10'
                }
              }).addTo(map);
              
              const userIcon = L.divIcon({
                className: 'user-marker',
                html: `<div style="width: 16px; height: 16px; background-color: #3B82F6; border: 2px solid white; border-radius: 50%; box-shadow: 0 0 8px rgba(59, 130, 246, 0.5);"></div>`,
                iconSize: [16, 16],
                iconAnchor: [8, 8]
              });
              
              L.marker([userLat, userLng], { icon: userIcon }).addTo(map);
              const bounds = L.latLngBounds([lat, lng], [userLat, userLng]);
              map.fitBounds(bounds, { padding: [30, 30], animate: true });
            }
          } catch (e) {}
        };
        fetchRoute();
      }

      mapRef.current = map;
    } catch (e) {}

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [isLeafletReady, lat, lng, userLat, userLng, name]);

  return (
    <div className="relative h-full w-full bg-zinc-100 overflow-hidden">
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <Script 
        src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
        onLoad={() => setIsLeafletReady(true)}
        strategy="afterInteractive"
      />
      
      {!isMapLoaded && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-zinc-100">
          <Loader2 className="h-5 w-5 text-hanoi-red animate-spin mb-2" />
          <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Đang tải bản đồ...</p>
        </div>
      )}
      
      <div ref={mapContainerRef} className="h-full w-full z-10" />
    </div>
  );
};
