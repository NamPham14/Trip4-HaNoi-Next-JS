/**
 * Standard API Response structure from Backend
 */
export interface ApiResponse<T> {
  status: number;
  code: number;
  data: T;
  message: string;
}

/**
 * Standard Pagination structure
 */
export interface PageResponse<T> {
  pageNumber: number;
  totalPages: number;
  pageSize: number;
  totalElements: number;
  data: T[];
}

/**
 * Common Error codes from Backend (based on ErrorCode.java)
 */
export enum ApiErrorCode {
  SUCCESS = 1000,
  UNCATEGORIZED_EXCEPTION = 9999,
  USER_EXISTED = 1001,
  USER_NOT_EXISTED = 1005,
  UNAUTHENTICATED = 1006,
  UNAUTHORIZED = 1007,
  // ... add more as needed
}
