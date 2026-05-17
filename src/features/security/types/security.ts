export interface Permission {
  id: number;
  name: string;
  description: string;
}

export interface Role {
  id: number;
  name: string;
  description: string;
  permissions: Permission[];
}

export interface PermissionRequest {
  name: string;
  description: string;
}

export interface RoleRequest {
  name: string;
  description: string;
  permissions: number[]; // Array of permission IDs
}
