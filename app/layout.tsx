import type { Metadata } from 'next'
import { Cormorant_Garamond, DM_Sans, Syne, Bebas_Neue } from 'next/font/google'
import { CustomCursor } from '@/components/Cursor'
import './globals.css'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400'],
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-body',
  display: 'swap',
})

const syne = Syne({
  subsets: ['latin'],
  weight: ['700', '800'],
  variable: '--font-digits',
  display: 'swap',
})

const bebasNeue = Bebas_Neue({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-poster',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'M — New Collection Dropping Soon',
  description:
    'The next chapter drops July 30, 2026. Join the waitlist for exclusive early access.',
  keywords: ['streetwear', 'limited edition', 'collection drop', 'coming soon'],
  openGraph: {
    title: 'M — New Collection Dropping Soon',
    description: 'The next chapter drops soon. Join the waitlist.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'M — New Collection Dropping Soon',
    description: 'The next chapter drops soon.',
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${dmSans.variable} ${syne.variable} ${bebasNeue.variable}`}
    >
      <body className="bg-[#0a0a0a] text-white antialiased">
        {children}
        <CustomCursor />
      </body>
    </html>
  )
}
