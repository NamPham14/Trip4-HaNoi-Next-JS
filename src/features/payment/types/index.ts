export enum PlanType {
  FREE = 'FREE',
  PRO_1_MONTH = 'PRO_1_MONTH',
  PRO_3_MONTH = 'PRO_3_MONTH'
}

export interface CreatePaymentRequest {
  packageType: PlanType;
}

export interface PaymentResponse {
  orderCode: string;
  checkoutUrl: string;
  amount: number;
}
