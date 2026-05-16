import React from 'react';
import { MapPin, MessageCircle, Camera, Send } from 'lucide-react';
import Link from 'next/link';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-white pt-20 pb-10">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-20 text-left">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-hanoi-red rounded-lg flex items-center justify-center text-white">
                <MapPin size={18} />
              </div>
              <span className="text-2xl font-bold">Trip4Hanoi</span>
            </div>
            <p className="text-slate-400 mb-6 leading-relaxed">
              Hanoi&apos;s most advanced AI travel companion. Creating unforgettable journeys through the heart of Vietnam.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-hanoi-red transition-colors">
                <MessageCircle size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-hanoi-red transition-colors">
                <Camera size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-hanoi-red transition-colors">
                <Send size={18} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6">Quick Links</h4>
            <ul className="space-y-4 text-slate-400">
              <li><Link href="/explore" className="hover:text-white transition-colors">Khám phá</Link></li>
              <li><Link href="/planner" className="hover:text-white transition-colors">Lên lịch trình</Link></li>
              <li><Link href="/events" className="hover:text-white transition-colors">Sự kiện</Link></li>
              <li><a href="#" className="hover:text-white transition-colors">Blog Du lịch</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6">Hỗ trợ</h4>
            <ul className="space-y-4 text-slate-400">
              <li><a href="#" className="hover:text-white transition-colors">Liên hệ</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Câu hỏi thường gặp</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Chính sách bảo mật</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Điều khoản dịch vụ</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6">Đăng ký bản tin</h4>
            <p className="text-slate-400 mb-6">Nhận thông tin về những viên ngọc ẩn giấu của Hà Nội mỗi tuần.</p>
            <form className="flex gap-2">
              <input type="email" placeholder="Email của bạn" className="bg-white/10 border border-white/20 px-4 py-2 rounded-xl focus:outline-none focus:border-hanoi-red w-full text-white" />
              <button type="submit" className="bg-hanoi-red px-4 py-2 rounded-xl font-bold hover:bg-hanoi-red/90 transition-colors">Gửi</button>
            </form>
          </div>
        </div>
        
        <div className="border-t border-white/10 pt-10 flex flex-col md:flex-row justify-between items-center gap-6 text-slate-500 text-sm">
          <p>© 2026 Trip4Hanoi. All rights reserved.</p>
          <p>Handcrafted with ❤️ for Vietnam.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
