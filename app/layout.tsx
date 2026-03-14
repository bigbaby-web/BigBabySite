import type { Metadata, Viewport } from 'next'
import { Space_Grotesk, Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { AuthProvider } from '@/contexts/auth-context'
import { PlayerProvider } from '@/contexts/player-context'
import { ClientLayout } from '@/components/client-layout'
import { GlobalPlayer } from '@/components/global-player'
import './globals.css'

const spaceGrotesk = Space_Grotesk({ 
  subsets: ["latin"],
  variable: '--font-sans'
});
const inter = Inter({ 
  subsets: ["latin", "cyrillic"],
  variable: '--font-body'
});

export const metadata: Metadata = {
  title: 'Big Baby | AI Music Producer',
  description: 'Продюсер из будущего: Сочиняю музыку вместе с ИИ',
}

export const viewport: Viewport = {
  themeColor: '#e6f0fa',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru">
      <body className={`${spaceGrotesk.variable} ${inter.variable} font-sans antialiased`}>
        <AuthProvider>
          <PlayerProvider>
            <ClientLayout>
              {children}
            </ClientLayout>
            <GlobalPlayer />
          </PlayerProvider>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}