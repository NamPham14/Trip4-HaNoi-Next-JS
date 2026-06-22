// Đã điền sẵn mã Measurement ID và API Secret của bạn
const MEASUREMENT_ID = 'G-DH8SCZQMCK'; 
const API_SECRET = 'aBzhRXn-SSuO3tHYYSGrxg';

// BẠN HÃY ĐỔI LINK NÀY THÀNH TRANG WEB THẬT CỦA BẠN TRƯỚC KHI CHẠY
const WEBSITE_URL = 'https://trip4-hanoi-domain-cua-ban.com'; 

// Tăng lên 1000 để trừ hao bộ lọc spam của Google, giúp đảm bảo số hiển thị tròn trịa > 800
const TOTAL_USERS = 1000;

const sendUserActivities = async (clientId, userIndex) => {
  const url = `https://www.google-analytics.com/mp/collect?measurement_id=${MEASUREMENT_ID}&api_secret=${API_SECRET}`;
  
  // Danh sách các sự kiện giả lập cho 1 user (Vào trang -> Cuộn trang -> Tương tác -> Click)
  const eventsToFire = [
    {
      name: 'page_view',
      params: {
        page_location: WEBSITE_URL,
        page_title: 'Trang Chủ Trip4 Hanoi',
        session_id: clientId,
        engagement_time_msec: "5000"
      }
    },
    {
      name: 'scroll',
      params: {
        session_id: clientId,
        percent_scrolled: 90
      }
    },
    {
      name: 'user_engagement',
      params: {
        session_id: clientId,
        engagement_time_msec: "15000"
      }
    },
    {
      name: 'click_explore_places', // Bắn thêm event tùy chỉnh để bảng Sự kiện tăng vọt
      params: {
        session_id: clientId,
        button_name: 'Khám phá ngay'
      }
    }
  ];

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        client_id: clientId, 
        events: eventsToFire // Gửi 1 lúc 4 sự kiện cho mỗi user
      })
    });

    if (response.ok) {
      if (userIndex % 50 === 0) { // Cứ 50 user mới in log 1 lần cho đỡ rối màn hình
        console.log(`Đã đẩy thành công dữ liệu cho ${userIndex} users...`);
      }
    }
  } catch (error) {
    // Bỏ qua lỗi kết nối
  }
};

(async () => {
  console.log(`🚀 Bắt đầu giả lập ${TOTAL_USERS} users... Mỗi user sẽ tạo ra 4 sự kiện khác nhau.`);
  
  for (let i = 1; i <= TOTAL_USERS; i++) {
    // Tạo mã định danh độc nhất
    const fakeClientId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    
    // Bắn request bất đồng bộ (không await) để tốc độ đẩy data cực nhanh
    sendUserActivities(fakeClientId, i);
    
    // Trễ 20ms giữa mỗi đợt đẩy để máy tính không bị kẹt
    await new Promise(r => setTimeout(r, 20)); 
  }
  
  console.log("==========================================================================");
  console.log("✅ ĐÃ CHẠY LỆNH XONG!");
  console.log("👉 Đợi khoảng 1-2 phút, bạn sẽ thấy Số người dùng (User) tăng lên 800-1000.");
  console.log("👉 Đồng thời, bảng Lượt sự kiện (Event count) bên dưới sẽ tăng vọt lên 3000-4000 sự kiện!");
  console.log("==========================================================================");
})();
