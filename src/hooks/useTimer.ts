/**
 * Timer hook — Baitjet & santosSuccess
 */
import { useState, useEffect, useRef, useCallback } from 'react'

export function useTimer() {
  const [timeMs, setTimeMs] = useState(0)
  const [running, setRunning] = useState(false)
  const startRef = useRef<number>(0)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    if (!running) return
    const tick = () => {
      setTimeMs(Math.floor(performance.now() - startRef.current))
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [running])

  const start = useCallback(() => {
    startRef.current = performance.now()
    setTimeMs(0)
    setRunning(true)
  }, [])

  const stop = useCallback(() => {
    setRunning(false)
  }, [])

  const getCurrentTimeMs = useCallback(() => {
    return running ? Math.floor(performance.now() - startRef.current) : timeMs
  }, [running, timeMs])

  const reset = useCallback(() => {
    setRunning(false)
    setTimeMs(0)
  }, [])

  const format = (ms: number) => {
    const s = Math.floor(ms / 1000)
    const m = Math.floor(s / 60)
    const sec = s % 60
    const tenths = Math.floor((ms % 1000) / 100)
    return `${m > 0 ? `${m}:` : ''}${sec.toString().padStart(m > 0 ? 2 : 1, '0')}.${tenths}`
  }

  return { timeMs, running, start, stop, reset, format, getCurrentTimeMs }
}
