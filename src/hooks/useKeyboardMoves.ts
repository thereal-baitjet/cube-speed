/**
 * Keyboard move bindings — Baitjet & santosSuccess
 * R L U D F B = moves, Shift + key = prime (counter-clockwise)
 */
import { useEffect, useCallback } from 'react'
import type { Move } from '../cube/state'

const KEY_TO_MOVE: Record<string, Move> = {
  r: 'R',
  R: "R'",
  l: 'L',
  L: "L'",
  u: 'U',
  U: "U'",
  d: 'D',
  D: "D'",
  f: 'F',
  F: "F'",
  b: 'B',
  B: "B'",
}

export function useKeyboardMoves(
  onMove: (move: Move) => void,
  onScramble: () => void,
  enabled: boolean
) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!enabled) return
      if (e.repeat) return
      const key = e.shiftKey ? e.key : e.key.toLowerCase()
      const move = KEY_TO_MOVE[key]
      if (move) {
        e.preventDefault()
        onMove(move)
      } else if (e.code === 'Space') {
        e.preventDefault()
        onScramble()
      }
    },
    [enabled, onMove, onScramble]
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])
}
