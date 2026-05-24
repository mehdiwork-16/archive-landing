import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin — Archive',
  robots: { index: false, follow: false }, // never index the admin
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
