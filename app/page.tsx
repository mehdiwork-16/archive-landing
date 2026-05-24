import { readdirSync } from 'fs'
import path from 'path'
import { HomeClient } from '@/components/HomeClient'

// Reads every image from /public automatically — just drop files in and redeploy
function getBackgroundSlides(): string[] {
  try {
    const dir = path.join(process.cwd(), 'public')
    return readdirSync(dir)
      .filter(f => /\.(jpe?g|png|webp|avif)$/i.test(f))
      .sort()
      .map(f => `/${f}`)
  } catch {
    return []
  }
}

export default function Home() {
  const slides = getBackgroundSlides()
  return <HomeClient slides={slides} />
}
