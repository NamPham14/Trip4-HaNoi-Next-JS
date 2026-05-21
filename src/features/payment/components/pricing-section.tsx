/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React, { useState } from 'react';
import { Check, Sparkles, Zap, ShieldCheck, Crown } from 'lucide-react';
import { paymentApi } from '../services/payment-api';
import { PlanType } from '../types';
import { toast } from 'sonner';
import { cn } from '@/shared/lib/utils';

const PRICING_PLANS = [
  {
    id: PlanType.PRO_1_MONTH,
    name: 'Gói 1 Tháng',
    price: '150.000',
    description: 'Trải nghiệm đầy đủ tính năng AI trong 30 ngày',
    features: [
      'Chat AI không giới hạn lượt dùng',
      'Phản hồi từ AI nhanh và chi tiết hơn',
      'Hỗ trợ lập kế hoạch chuyến đi chuyên sâu',
      'Lưu trữ không giới hạn hành trình AI'
    ],
    buttonText: 'Nâng cấp ngay',
    popular: false,
    icon: <Zap className="w-6 h-6 text-blue-500" />
  },
  {
    id: PlanType.PRO_3_MONTH,
    name: 'Gói 3 Tháng',
    price: '400.000',
    description: 'Tiết kiệm hơn với gói dài hạn cho người đam mê du lịch',
    features: [
      'Tất cả tính năng của gói 1 tháng',
      'Tiết kiệm hơn so với mua lẻ từng tháng',
      'Ưu tiên trải nghiệm các tính năng mới',
      'Hỗ trợ khách hàng ưu tiên (24/7)'
    ],
    buttonText: 'Tiết kiệm ngay',
    popular: true,
    icon: <Sparkles className="w-6 h-6 text-orange-500" />
  },
  {
    id: 'SUPER_VIP',
    name: 'Gói Siêu VIP',
    price: '?.???.???',
    description: 'Đặc quyền tối thượng dành riêng cho VIP',
    features: [
      'Tất cả đặc quyền của gói Pro',
      'Trợ lý du lịch cá nhân 1-1 (Người thật)',
      'Đặt chỗ nhà hàng/khách sạn ưu tiên',
      'Tour guide bản địa riêng theo yêu cầu'
    ],
    buttonText: 'Đang phát triển',
    popular: false,
    isComingSoon: true,
    icon: <Crown className="w-6 h-6 text-yellow-500" />
  }
];

export const PricingSection = () => {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleSubscribe = async (packageType: string) => {
    if (packageType === 'SUPER_VIP') return;
    
    setLoadingId(packageType);
    try {
      const res = await paymentApi.createCheckoutLink({ packageType: packageType as PlanType });
      if (res.checkoutUrl) {
        window.location.assign(res.checkoutUrl);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi khởi tạo thanh toán');
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl font-bold text-zinc-900 mb-4">
            Nâng tầm hành trình của bạn với <span className="text-hanoi-red">Trip4Hanoi Pro</span>
          </h2>
          <p className="text-lg text-zinc-600">
            Mở khóa toàn bộ sức mạnh của trí tuệ nhân tạo để lên kế hoạch cho những chuyến khám phá Thủ đô hoàn hảo nhất.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {PRICING_PLANS.map((plan) => (
            <div
              key={plan.id}
              className={cn(
                "relative bg-white rounded-3xl p-8 transition-all duration-300 border-2 flex flex-col",
                plan.popular 
                  ? "border-orange-500 shadow-2xl scale-105 z-10 pt-12" 
                  : "border-zinc-100 shadow-xl hover:border-zinc-200",
                plan.isComingSoon && "opacity-80 grayscale-[0.5] pt-12"
              )}
            >
              {plan.popular && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-orange-500 text-white px-6 py-1 rounded-full text-[10px] font-bold shadow-lg flex items-center gap-2 whitespace-nowrap">
                  <ShieldCheck className="w-3 h-3" />
                  ĐƯỢC CHỌN NHIỀU NHẤT
                </div>
              )}

              {plan.isComingSoon && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-zinc-800 text-white px-6 py-1 rounded-full text-[10px] font-bold shadow-lg whitespace-nowrap">
                  SẮP RA MẮT
                </div>
              )}

              <div className="flex items-center gap-3 mb-6">
                <div className={cn(
                  "p-3 rounded-2xl",
                  plan.id === PlanType.PRO_3_MONTH ? "bg-orange-50" : 
                  plan.id === 'SUPER_VIP' ? "bg-yellow-50" : "bg-blue-50"
                )}>
                  {plan.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-zinc-900">{plan.name}</h3>
                  <p className="text-sm text-zinc-500">{plan.description}</p>
                </div>
              </div>

              <div className="mb-8">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-zinc-900">{plan.price}</span>
                  <span className="text-xl font-semibold text-zinc-500">VNĐ</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8 flex-1">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3 text-zinc-600 text-sm">
                    <div className="mt-1 bg-green-100 rounded-full p-0.5 shrink-0">
                      <Check className="w-4 h-4 text-green-600" />
                    </div>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSubscribe(plan.id)}
                disabled={loadingId !== null || plan.isComingSoon}
                className={cn(
                  "w-full py-4 rounded-2xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-2",
                  plan.id === PlanType.PRO_3_MONTH
                    ? "bg-orange-500 text-white hover:bg-orange-600 shadow-lg shadow-orange-200"
                    : plan.isComingSoon
                    ? "bg-zinc-200 text-zinc-500 cursor-not-allowed"
                    : "bg-zinc-900 text-white hover:bg-zinc-800"
                )}
              >
                {loadingId === plan.id ? (
                  <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  plan.buttonText
                )}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center text-zinc-500 max-w-2xl mx-auto">
          <p className="text-sm">
            Bằng cách thanh toán, bạn đồng ý với Điều khoản dịch vụ và Chính sách bảo mật của Trip4Hanoi. 
            Gói cước sẽ không tự động gia hạn, bạn có thể chủ động mua thêm khi hết hạn.
          </p>
        </div>
      </div>
    </section>
  );
};
