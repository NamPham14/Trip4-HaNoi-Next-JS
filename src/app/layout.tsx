


import QueryProvider from '@/shared/providers/query-provider'
import { LocationProvider } from '@/shared/providers/location-provider'
import { FcmTokenHandler } from '@/shared/providers/fcm-provider'
import { ChatWidget } from '@/features/chat/components/chat-widget'
import { GoogleOAuthProvider } from '@react-oauth/google'
import React from 'react'
import { Be_Vietnam_Pro } from 'next/font/google'
import { Toaster } from '@/shared/components/ui/sonner'
import { Metadata } from 'next'
import './globals.css'

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ['vietnamese'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-be-vietnam',
})

export const metadata: Metadata = {
  title: {
    default: 'Trip4Hanoi - Khám phá Hà Nội theo cách riêng của bạn',
    template: '%s | Trip4Hanoi',
  },
  description: 'Trip4Hanoi là nền tảng lên kế hoạch du lịch Hà Nội thông minh với sự hỗ trợ của AI. Khám phá địa điểm, sự kiện và lịch trình cá nhân hóa tại thủ đô.',
  keywords: ['Trip4Hanoi', 'du lịch Hà Nội', 'lên kế hoạch du lịch', 'Hà Nội travel', 'AI travel planner', 'khám phá Hà Nội'],
  authors: [{ name: 'Trip4Hanoi Team' }],
  creator: 'Trip4Hanoi',
  metadataBase: new URL('https://trip4hanoi.online'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Trip4Hanoi - Khám phá Hà Nội theo cách riêng của bạn',
    description: 'Nền tảng lên kế hoạch du lịch Hà Nội thông minh với AI.',
    url: 'https://trip4hanoi.online',
    siteName: 'Trip4Hanoi',
    locale: 'vi_VN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Trip4Hanoi - Khám phá Hà Nội theo cách riêng của bạn',
    description: 'Nền tảng lên kế hoạch du lịch Hà Nội thông minh với AI.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({children} :{children :React.ReactNode}) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "123456789-dummy.apps.googleusercontent.com";
  
  return (
    <html lang='vi' className={`${beVietnamPro.variable}`}>
      <body className="font-sans antialiased text-zinc-900">
        <GoogleOAuthProvider clientId={clientId}>
          <QueryProvider>
            <LocationProvider>
              <FcmTokenHandler />
              {children}
              <ChatWidget />
              <Toaster position="bottom-right" richColors />
            </LocationProvider>
          </QueryProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  )
}
