import type { Metadata, Viewport } from 'next'
import { Poppins, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { AuthGate } from '@/components/auth-gate'
import './globals.css'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
})

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
})

export const metadata: Metadata = {
  title: 'AyitiSafe - AI-Powered Security Solutions for Haiti',
  description: 'Solisyon sekirite avèk entèlijans atifisyèl pou Ayiti. Real-time alerts, safe routes, and incident reporting.',
  generator: 'v0.app',
  keywords: ['Haiti', 'security', 'safety', 'alerts', 'AI', 'Port-au-Prince'],
  icons: {
    icon: [
      {
        url: '/icon%20logo.jpg',
        type: 'image/jpeg',
      },
    ],
    apple: '/icon%20logo.jpg',
    shortcut: '/icon%20logo.jpg',
  },
  openGraph: {
    title: 'AyitiSafe - AI-Powered Security Solutions for Haiti',
    description: 'Solisyon sekirite avèk entèlijans atifisyèl pou Ayiti.',
    images: [{ url: '/LOGO.jpg', width: 1280, height: 640, alt: 'AyitiSafe Logo' }],
  },
}

export const viewport: Viewport = {
  themeColor: '#1B2A4A',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ht" suppressHydrationWarning>
      <body className={`${poppins.variable} ${geistMono.variable} font-sans antialiased`}>
        <AuthGate>{children}</AuthGate>
        <Analytics />
      </body>
    </html>
  )
}
