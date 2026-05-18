import { Role } from "@/features/security/types/security";

export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'NONE';

export interface UserManagement {
  id: number;
  username: string;
  email: string;
  avatar: string;
  roles: Role[];
  nationality: string;
  language: string;
  status: UserStatus;
  isLocationTrackingEnabled: boolean;
  createdAt: string;
  provider: string;
}

export interface UserUpdateAdminRequest {
  id: number;
  username?: string;
  email?: string;
  avatar?: string;
  nationality?: string;
  language?: string;
  status?: UserStatus;
  roles?: number[]; // Array of role IDs
  isLocationTrackingEnabled?: boolean;
}
