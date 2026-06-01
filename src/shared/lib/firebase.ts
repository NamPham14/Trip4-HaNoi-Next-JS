/* eslint-disable @typescript-eslint/no-explicit-any */
// Firebase Cloud Messaging Configuration
import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app: FirebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const requestForToken = async (): Promise<string | null> => {
  try {
    // Kiểm tra xem trình duyệt có hỗ trợ messaging không (đặc biệt là yêu cầu HTTPS)
    const isSupported = typeof window !== 'undefined' && 'serviceWorker' in navigator && (await import('firebase/messaging')).isSupported();
    if (!isSupported) {
      console.warn("Firebase Messaging is not supported in this browser/environment.");
      return null;
    }

    const messaging = getMessaging(app);
    const status = await Notification.requestPermission();
    
    if (status === "granted") {
      const currentToken = await getToken(messaging, {
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
      });
      return currentToken || null;
    }
    return null;
  } catch (err) {
    console.error("An error occurred while retrieving token: ", err);
    return null;
  }
};

export const onMessageListener = (): Promise<any> => {
  return new Promise(async (resolve) => {
    try {
      const isSupported = typeof window !== 'undefined' && (await import('firebase/messaging')).isSupported();
      if (!isSupported) return;

      const messaging = getMessaging(app);
      onMessage(messaging, (payload: any) => {
        resolve(payload);
      });
    } catch (err) {
      console.error("Error in onMessageListener: ", err);
    }
  });
};
