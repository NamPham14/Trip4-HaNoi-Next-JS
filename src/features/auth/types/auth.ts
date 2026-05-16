export interface User {
  id: number;
  username: string;
  email: string;
  avatar: string;
  roles: Role[];
  nationality: string;
  language: string;
  status: 'ACTIVE' | 'INACTIVE' | 'BANNED';
  isLocationTrackingEnabled: boolean;
  createdAt?: string;
}

export interface Role {
  name: string;
  description: string;
  permissions: Permission[];
}

export interface Permission {
  name: string;
  description: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}
