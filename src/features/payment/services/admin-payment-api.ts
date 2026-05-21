import axiosInstance from "@/shared/api/axios-instance";

export interface AdminPaymentOrder {
  id: number;
  orderCode: string;
  payosOrderCode: number | null;
  username: string;
  email: string;
  packageType: string;
  amount: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export const adminPaymentApi = {
  getOrders: async (params: { page: number; size: number; keyword?: string; status?: string }) => {
    const response = await axiosInstance.get('/payment/admin/orders', { params });
    return response.data.data;
  },
  updateStatus: async (id: number, status: string) => {
    const response = await axiosInstance.put(`/payment/admin/orders/${id}/status`, null, {
      params: { status }
    });
    return response.data;
  }
};
