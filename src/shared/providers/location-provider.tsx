'use client';

import React, { useEffect, useRef } from 'react';
import { useLocationStore } from '../store/location-store';
import axiosInstance from '../api/axios-instance';
import Cookies from 'js-cookie';
import { toast } from 'sonner';

/**
* Nhà cung cấp xử lý việc theo dõi GPS và cập nhật vị trí nền
*/
export const LocationProvider = ({ children }: { children: React.ReactNode }) => {
  const { isTrackingEnabled, setLocation, lat, lng } = useLocationStore();
  const lastTrackedRef = useRef<{ lat: number, lng: number, time: number } | null>(null);

  useEffect(() => {
    if (!isTrackingEnabled) return;

    if (!navigator.geolocation) {
      toast.error("Trình duyệt của bạn không hỗ trợ định vị GPS.");
      return;
    }

     /**
   * Logic gửi vị trí lên BE
   * Điều kiện: Đã đăng nhập AND (Chưa gửi bao giờ OR Di chuyển > 500m OR Sau 15 phút)
   */
  const handleBackgroundTracking = (currentLat: number, currentLng: number) => {
    const token = Cookies.get('access_token');
    if (!token) return;

    const now = Date.now();
    const FIFTEEN_MINUTES = 15 * 60 * 1000;
    const MIN_DISTANCE = 0.5; // 500m

    if (!lastTrackedRef.current) {
      trackLocationToBackend(currentLat, currentLng);
      lastTrackedRef.current = { lat: currentLat, lng: currentLng, time: now };
      return;
    }

    const dist = calculateDistance(
      lastTrackedRef.current.lat, 
      lastTrackedRef.current.lng, 
      currentLat, 
      currentLng
    );

    const timeDiff = now - lastTrackedRef.current.time;

    if (dist >= MIN_DISTANCE || timeDiff >= FIFTEEN_MINUTES) {
      trackLocationToBackend(currentLat, currentLng);
      lastTrackedRef.current = { lat: currentLat, lng: currentLng, time: now };
    }
  };

  
    //  Cấu hình theo dõi liên tục (WatchPosition)
    // Giúp cập nhật khoảng cách trên trang Explore ngay lập tức khi di chuyển
  const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        
        // Cập nhật Store (chỉ khi thay đổi đáng kể để tránh re-render liên tục)
        if (!lat || !lng || calculateDistance(lat, lng, latitude, longitude) > 0.01) {
          setLocation(latitude, longitude);
          
          // Kiểm tra và gửi lên Backend nếu thỏa mãn điều kiện
          handleBackgroundTracking(latitude, longitude);
        }
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          toast.warning("Vui lòng bật GPS để có trải nghiệm tìm kiếm tốt nhất xung quanh bạn.");
        }
        console.error('GPS Error:', error.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [isTrackingEnabled, setLocation, lat, lng]);

 

  return <>{children}</>;
};

/**
 * Công thức Haversine để tính khoảng cách giữa 2 tọa độ (đơn vị: km)
 */
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Bán kính Trái đất
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

/**
* Hàm hỗ trợ gọi API BE để theo dõi lịch sử
*/
async function trackLocationToBackend(lat: number, lng: number) {
  try {
    await axiosInstance.post('/locations/track', null, {
      params: { lat, lng }
    });
    console.log(`%c  Tracked to BE: ${lat}, ${lng}`, "color: green; font-weight: bold;");
  } catch (error) {
    console.warn(' Failed to track location to backend', error);
  }
}
