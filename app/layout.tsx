import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/react'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
})

export const metadata: Metadata = {
  title: 'BOAT NET — o mundo náutico em 1 app',
  description: 'Catálogo, booking, pagamento e parceiros — tudo no mesmo lugar.',
  metadataBase: new URL('https://boatnet.app'),
  icons: {
    icon: '/brand/app-icon.png'
  },
  openGraph: {
    title: 'BOAT NET',
    description: 'Compre, alugue e viva o mundo náutico.',
    images: ['/placeholders/og.png']
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <body className="noise font-sans">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
