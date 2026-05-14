# 01 - TỔNG QUAN KIẾN TRÚC HỆ THỐNG TRIP4HANOI

## 1. Mô hình Tổng thể
Hệ thống Trip4Hanoi được thiết kế theo mô hình **Client-Server** hiện đại, tối ưu cho việc xử lý dữ liệu vị trí và tích hợp AI.

- **Backend:** Spring Boot (Java), MySQL, Redis, Gemini AI.
- **Frontend:** Next.js 15 (App Router), TypeScript, TanStack Query, Tailwind CSS.

## 2. Luồng Dữ liệu Cốt lõi (Flywheel Effect)
1. **Thu thập (Collect):** FE thu thập sở thích User và tọa độ GPS định kỳ.
2. **Xử lý (Process):** BE tính toán trọng số (Scoring) dựa trên: Gu người dùng + Vùng hoạt động + Sự kiện đang diễn ra.
3. **Gợi ý (Recommend):** BE trả về danh sách địa điểm tối ưu qua Redis Cache.
4. **Hành động (Action):** User Chat với AI để bóc tách danh sách gợi ý thành Lịch trình (Itinerary) chi tiết.

## 3. Nguyên tắc Thiết kế Frontend
- **Domain-Driven:** Chia code theo tính năng (features) thay vì loại file (components/hooks/services).
- **Server-First:** Tận dụng Next.js Server Components cho các trang tĩnh/SEO (Place detail, Blog).
- **Client-Interactive:** Dùng Client Components cho các tương tác phức tạp (Chat, Map, GPS tracking).
- **Type-Safe:** Sử dụng TypeScript chặt chẽ, đồng bộ hóa interface với Backend.
