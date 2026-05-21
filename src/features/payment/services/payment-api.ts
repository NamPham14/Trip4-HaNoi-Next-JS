import axiosInstance from "@/shared/api/axios-instance";
import { CreatePaymentRequest, PaymentResponse } from "../types";

export const paymentApi = {
  createCheckoutLink: async (data: CreatePaymentRequest): Promise<PaymentResponse> => {
    const response = await axiosInstance.post('/payment/checkout', data);
    return response.data.data;
  }
};
