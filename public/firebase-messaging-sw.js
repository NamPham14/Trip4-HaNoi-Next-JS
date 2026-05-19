importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js");

const firebaseConfig = {
  apiKey: "AIzaSyBpFk0gMfL0m1Oz-kXJ3tMP1CmfBrA58sw",
  authDomain: "trip4hanoi-1a2ba.firebaseapp.com",
  projectId: "trip4hanoi-1a2ba",
  storageBucket: "trip4hanoi-1a2ba.firebasestorage.app",
  messagingSenderId: "353548572749",
  appId: "1:353548572749:web:e52056590596c2e4dd2404",
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("[firebase-messaging-sw.js] Received background message ", payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/favicon.ico",
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
//Đây là phần cực kỳ quan trọng giúp trình duyệt có thể nhận và hiển thị thông báo ngay cả khi người dùng không mở trang web của bạn.