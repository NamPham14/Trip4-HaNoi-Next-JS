# 03 - ROADMAP TRIỂN KHAI FRONTEND

## PHASE 1: FOUNDATION (NỀN TẢNG)

- [ ] Refactor Folder Structure (`features/`, `shared/`).
- [ ] Config Axios Instance + Interceptors (Token handling).
- [ ] Config TanStack Query Client + Provider.
- [ ] Setup Global Theme (Tailwind + Shadcn).
- [ ] Build `LocationProvider` (Quản lý GPS toàn app).

## PHASE 2: AUTHENTICATION & ACCESS CONTROL

- [ ] Implement Login/Register logic.
- [ ] Handle JWT Storage (Cookies).
- [ ] Setup Middleware bảo vệ Route (`/admin`, `/profile`).
- [ ] Google Login Integration.

## PHASE 3: CORE DISCOVERY (PLACES & RECOMMENDATION)

- [ ] Trang Home: Gợi ý địa điểm (API Recommendations).
- [ ] Trang Explore: Search, Filter theo Category + Bán kính GPS.
- [ ] Trang Detail: Thông tin địa điểm, Sự kiện, Review.
- [ ] Social: Like, Save, Comment.

## PHASE 4: AI SMART PLANNER (LOCAL BUDDY)

- [ ] UI Chat Interface (Bong bóng chat, Loading).
- [ ] Logic Parse JSON từ AI Response.
- [ ] UI Timeline Itinerary (Sáng/Trưa/Chiều/Tối).
- [ ] Feature: Lưu lịch trình vào tài khoản.

## PHASE 5: ADMIN & OPTIMIZATION

- [ ] Admin Dashboard (Thống kê, Quản lý Data).
- [ ] SEO Optimization (Metadata cho Place/Event).
- [ ] Performance (Image optimization, Caching strategy).
