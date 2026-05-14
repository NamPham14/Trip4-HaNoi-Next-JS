# 02 - PHÂN TÍCH BACKEND CHO FRONTEND INTEGRATION

## 1. Hệ thống API Cốt lõi
Backend cung cấp các Endpoint chính mà Frontend cần tập trung xử lý:

| Module | API Endpoint | Lưu ý cho Frontend |
| :--- | :--- | :--- |
| **Auth** | `/api/auth/*` | Handle JWT, Refresh Token, Google Login, OTP qua Mail. |
| **Location** | `/api/locations/track` | Gửi GPS ngầm 15 phút/lần. |
| **Places** | `/api/places` | Gửi kèm `userLat`, `userLng` để nhận `distance`. |
| **Recommend** | `/api/recommendations` | Dữ liệu đã cache Redis, ưu tiên hiển thị trang Home. |
| **AI Chat** | `/api/chat` | Nhận về JSON chuỗi. Cần JSON.parse ở FE. |
| **Itinerary** | `/api/itineraries` | Lưu/Tải lịch trình đa ngày. |

## 2. Cấu trúc Response Chuẩn
Toàn bộ API trả về format:
```json
{
  "code": 1000,
  "result": { ... },
  "message": "Success"
}
```
=> FE cần viết Generic Type cho `APIResponse<T>`.

## 3. Các Logic Đặc thù cần Handle ở FE
- **Haversine Formula:** BE đã tính, FE chỉ cần hiển thị làm tròn 1 chữ số thập phân.
- **Privacy:** User có thể tắt Tracking. FE phải kiểm tra trường `isLocationTrackingEnabled` trước khi kích hoạt `watchPosition`.
- **AI Protocol:** AI trả về object có `timeline` và `suggestedPlaceIds`. FE phải thực hiện "Hydration" (lấy ID đó đi fetch data Place thật) để hiển thị Card.
