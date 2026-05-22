import type { Metadata } from 'next'
import { Cormorant_Garamond, DM_Sans, Syne } from 'next/font/google'
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

export const metadata: Metadata = {
  title: 'ARCHIVE — New Collection Dropping Soon',
  description:
    'The next chapter drops October 2026. Join the waitlist for exclusive early access.',
  keywords: ['streetwear', 'limited edition', 'archive', 'fashion drop', 'collection'],
  openGraph: {
    title: 'ARCHIVE — New Collection Dropping Soon',
    description: 'The next chapter drops soon. Join the waitlist.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ARCHIVE — New Collection Dropping Soon',
    description: 'The next chapter drops soon.',
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${dmSans.variable} ${syne.variable}`}
    >
      <body className="bg-white text-black antialiased">
        {children}
        <CustomCursor />
      </body>
    </html>
  )
}
