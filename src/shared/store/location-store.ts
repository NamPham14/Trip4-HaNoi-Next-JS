import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface LocationState {
  lat: number | null;
  lng: number | null;
  isTrackingEnabled: boolean;
  lastUpdated: number | null;
  setLocation: (lat: number, lng: number) => void;
  setTrackingEnabled: (enabled: boolean) => void;
}

/**
* Lưu trữ tọa độ GPS của người dùng trên toàn cầu
*/
export const useLocationStore = create<LocationState>()(
  persist(
    (set) => ({
      lat: null,
      lng: null,
      isTrackingEnabled: true,
      lastUpdated: null,
      setLocation: (lat, lng) => set({ lat, lng, lastUpdated: Date.now() }),
      setTrackingEnabled: (enabled) => set({ isTrackingEnabled: enabled }),
    }),
    {
      name: 'location-storage',
    }
  )
);
