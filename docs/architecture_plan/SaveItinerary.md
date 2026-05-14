Tôi đã hoàn thành việc triển khai tính năng Lưu lịch trình AI vào tài khoản (Save Itinerary) cho ứng dụng của bạn. Đây là một sự bổ sung quan trọng để biến AI từ một công cụ chat đơn thuần thành một "Trợ lý du lịch" thực thụ.

  Các công việc đã thực hiện:

   1. Backend (Spring Boot):
       * Tạo SaveAIItineraryRequest DTO để tiếp nhận dữ liệu lịch trình từ AI.
       * Thêm phương thức saveAIItinerary vào ItineraryService để xử lý việc tạo lịch trình mới và lưu các địa điểm tương ứng trong một Transaction.
       * Tự động tính toán tổng ngân sách dựa trên các địa điểm AI gợi ý.
       * Thêm endpoint POST /api/itineraries/save-ai để Frontend gọi.

   2. Frontend (Next.js):
       * Feature Itinerary: Tạo cấu trúc thư mục mới để quản lý các API và Hook liên quan đến lịch trình.
       * Nút "Lưu lịch trình": Đã tích hợp trực tiếp vào cửa sổ chat AI. Khi AI đưa ra lịch trình, một nút "Lưu lịch trình này" sẽ xuất hiện kèm hiệu ứng Loading khi đang xử lý.
       * Trang "Lịch trình của tôi" (/my-itineraries):
           * Giao diện danh sách các lịch trình đã lưu dưới dạng Card hiện đại.
           * Cho phép xóa lịch trình không cần thiết.
           * Đã thêm link vào Navbar (cả Desktop và Mobile) để người dùng dễ dàng truy cập.
       * Trang "Chi tiết lịch trình" (/itinerary-detail/[id]):
           * Hiển thị toàn bộ Timeline của chuyến đi đã lưu.
           * Hiển thị thông tin ngân sách, số người, và danh sách các địa điểm chi tiết.
           * Có link để xem chi tiết từng địa điểm trong lịch trình.