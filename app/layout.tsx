/* eslint-disable @next/next/no-page-custom-font */
import type { Metadata } from 'next'
import './globals.css'
import LoadingScreen from './LoadingScreen'
import SiteChrome from './SiteChrome'
import CompareBar from './CompareBar'
import { getCurrentUser } from '@/lib/auth'

export const metadata: Metadata = {
  title: 'T-Mobile | فروشگاه گوشی هوشمند',
  description: 'خرید و فروش گوشی دست دوم',
  icons: {
    icon: [
      { url: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="20" fill="url(%23g)"/><defs><linearGradient id="g" x1="0" y1="0" x2="100" y2="100"><stop offset="0" stop-color="%23ec4899"/><stop offset="48%" stop-color="%23ef4444"/><stop offset="100%" stop-color="%238b5cf6"/></linearGradient></defs><text x="50" y="68" text-anchor="middle" fill="white" font-size="60" font-weight="900" font-family="system-ui">T</text></svg>', type: 'image/svg+xml' },
    ],
  },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()

  return (
    <html lang="fa" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body>
        <LoadingScreen>
          <SiteChrome user={user}>
            {children}
          </SiteChrome>
          <CompareBar />
        </LoadingScreen>
      </body>
    </html>
  )
}
