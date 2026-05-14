# 04 - HƯỚNG DẪN TRIỂN KHAI CHI TIẾT (IMPLEMENTATION GUIDES)

## 1. Feature-Sliced Design (FSD)
Mỗi folder trong `src/features` nên có cấu trúc:
```text
features/place/
├── components/     # PlaceCard, PlaceList
├── hooks/          # usePlaceQuery, usePlaceDetail
├── services/       # placeApi.ts
└── types/          # place.d.ts
```

## 2. TanStack Query Keys Convention
Sử dụng Factory Pattern để quản lý Query Keys:
```typescript
const placeKeys = {
  all: ['places'] as const,
  lists: () => [...placeKeys.all, 'list'] as const,
  list: (filters: string) => [...placeKeys.lists(), { filters }] as const,
  details: () => [...placeKeys.all, 'detail'] as const,
  detail: (id: string) => [...placeKeys.details(), id] as const,
};
```

## 3. Quản lý State (Zustand)
Chỉ dùng Global State cho những dữ liệu cực kỳ cần thiết:
- `auth-store`: Lưu thông tin User đã login.
- `location-store`: Lưu tọa độ `lat`, `lng` hiện tại.
- `ui-store`: Sidebar toggle, Modals.

## 4. CSS & UI
- Dùng **Tailwind CSS** làm chính.
- Các UI components nhỏ (Button, Input, Card) lấy từ **shadcn/ui**.
- Animation: Dùng **framer-motion** cho các hiệu ứng mở Card, Timeline.

## 5. Security Checklist
- [ ] Không lưu nhạy cảm (API Key) ở client-side `.env`.
- [ ] Token lưu ở HTTP-only Cookie (nếu có thể) hoặc Secure Cookie.
- [ ] Luôn validate input ở FE trước khi gửi lên BE để giảm tải cho server.
