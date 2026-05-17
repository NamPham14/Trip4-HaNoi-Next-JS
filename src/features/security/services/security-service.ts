import axiosInstance from "@/shared/api/axios-instance";
import { ApiResponse, PageResponse } from "@/shared/types/api";
import { Permission, PermissionRequest, Role, RoleRequest } from "../types/security";

export const securityService = {
  // --- PERMISSIONS ---
  getPermissions: async (params: { keyword?: string; page?: number; size?: number; sort?: string }) => {
    const response = await axiosInstance.get<ApiResponse<PageResponse<Permission>>>('/permissions', {
      params: {
        keyword: params.keyword,
        page: params.page || 1,
        size: params.size || 10,
        sort: params.sort
      }
    });
    return response.data.data;
  },

  createPermission: async (data: PermissionRequest) => {
    const response = await axiosInstance.post<ApiResponse<Permission>>('/permissions', data);
    return response.data;
  },

  updatePermission: async (id: number, data: PermissionRequest) => {
    const response = await axiosInstance.put<ApiResponse<Permission>>(`/permissions/${id}`, { ...data, id });
    return response.data;
  },

  deletePermission: async (id: number) => {
    const response = await axiosInstance.delete<ApiResponse<void>>(`/permissions/${id}`);
    return response.data;
  },

  // --- ROLES ---
  getRoles: async (params: { keyword?: string; page?: number; size?: number; sort?: string }) => {
    const response = await axiosInstance.get<ApiResponse<PageResponse<Role>>>('/roles', {
      params: {
        keyword: params.keyword,
        page: params.page || 1,
        size: params.size || 10,
        sort: params.sort
      }
    });
    return response.data.data;
  },

  getRolesList: async () => {
    const response = await axiosInstance.get<ApiResponse<Role[]>>('/roles/all');
    return response.data.data;
  },

  createRole: async (data: RoleRequest) => {
    const response = await axiosInstance.post<ApiResponse<Role>>('/roles', data);
    return response.data;
  },

  updateRole: async (id: number, data: RoleRequest) => {
    const response = await axiosInstance.put<ApiResponse<Role>>(`/roles/${id}`, { ...data, id });
    return response.data;
  },

  deleteRole: async (id: number) => {
    const response = await axiosInstance.delete<ApiResponse<void>>(`/roles/${id}`);
    return response.data;
  }
};
