import { PricingSection } from "@/features/payment/components/pricing-section";
import { Navbar } from "@/shared/components/navbar";
import Footer from "@/shared/components/Footer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bảng giá - Trip4Hanoi Pro",
  description: "Nâng cấp gói PRO để trải nghiệm Chat AI không giới hạn và nhiều tính năng đặc biệt.",
};

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="pt-20">
        <PricingSection />
      </main>
      <Footer />
    </div>
  );
}
