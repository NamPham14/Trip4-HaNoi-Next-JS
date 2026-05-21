


import QueryProvider from '@/shared/providers/query-provider'
import { LocationProvider } from '@/shared/providers/location-provider'
import { FcmTokenHandler } from '@/shared/providers/fcm-provider'
import { ChatWidget } from '@/features/chat/components/chat-widget'
import { GoogleOAuthProvider } from '@react-oauth/google'
import React from 'react'
import { Be_Vietnam_Pro } from 'next/font/google'
import { Toaster } from '@/shared/components/ui/sonner'
import './globals.css'

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ['vietnamese'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-be-vietnam',
})

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
