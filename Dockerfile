# Stage 1: Build Image
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package.json và package-lock.json trước để tận dụng Docker cache
COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps

# Copy toàn bộ source code
COPY . .

# Build ứng dụng Next.js
RUN npm run build

# Stage 2: Production Image
FROM node:20-alpine AS runner

WORKDIR /app

# Đặt biến môi trường
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Copy các file cấu hình và thư mục cần thiết từ Stage 1
COPY --from=builder /app/next.config.ts ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

# Copy thư mục standalone và static (Tính năng tối ưu dung lượng của Next.js)
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Port mặc định Next.js chạy
EXPOSE 3000

# Khởi chạy ứng dụng
CMD ["node", "server.js"]
