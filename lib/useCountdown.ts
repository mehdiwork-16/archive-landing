'use client'

import { useState, useEffect } from 'react'

export interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

function calc(target: Date): TimeLeft {
  const diff = target.getTime() - Date.now()
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff / 3_600_000) % 24),
    minutes: Math.floor((diff / 60_000) % 60),
    seconds: Math.floor((diff / 1_000) % 60),
  }
}

export function useCountdown(target: Date): TimeLeft {
  // Start with zeros to avoid SSR/client hydration mismatch
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    setTimeLeft(calc(target))
    const id = setInterval(() => setTimeLeft(calc(target)), 1000)
    return () => clearInterval(id)
  }, [target.getTime()]) // eslint-disable-line react-hooks/exhaustive-deps

  return timeLeft
}
