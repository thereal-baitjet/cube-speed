/**
 * Rubik's Cube state: 54 facelets (9 per face × 6 faces).
 * Face order: U, D, F, B, L, R. Each face is 3×3 row-major.
 * Created by Baitjet & santosSuccess
 */
import type { FaceColor } from './colors'
export type { FaceColor } from './colors'
import { FACE_ORDER } from './colors'

export type Move = 'R' | "R'" | 'L' | "L'" | 'U' | "U'" | 'D' | "D'" | 'F' | "F'" | 'B' | "B'"

const FACE_SIZE = 9
const NUM_FACES = 6

function createSolvedState(): FaceColor[] {
  const state: FaceColor[] = []
  for (let f = 0; f < NUM_FACES; f++) {
    for (let i = 0; i < FACE_SIZE; i++) state.push(FACE_ORDER[f])
  }
  return state
}

function copyState(s: FaceColor[]): FaceColor[] {
  return [...s]
}

/** Get facelet index: face 0..5, row 0..2, col 0..2 */
export function faceletIndex(face: number, row: number, col: number): number {
  return face * FACE_SIZE + row * 3 + col
}

/** Apply a single face turn by permuting the state array */
function applyMove(state: FaceColor[], move: Move): FaceColor[] {
  const next = copyState(state)
  const get = (f: number, r: number, c: number) => next[faceletIndex(f, r, c)]
  const set = (f: number, r: number, c: number, color: FaceColor) => {
    next[faceletIndex(f, r, c)] = color
  }

  // Faces: 0=U, 1=D, 2=F, 3=B, 4=L, 5=R
  const rotateFaceCW = (face: number) => {
    const a = get(face, 0, 0), b = get(face, 0, 1), c = get(face, 0, 2)
    const d = get(face, 1, 0), e = get(face, 1, 1), f = get(face, 1, 2)
    const g = get(face, 2, 0), h = get(face, 2, 1), i = get(face, 2, 2)
    set(face, 0, 0, g); set(face, 0, 1, d); set(face, 0, 2, a)
    set(face, 1, 0, h); set(face, 1, 1, e); set(face, 1, 2, b)
    set(face, 2, 0, i); set(face, 2, 1, f); set(face, 2, 2, c)
  }
  const rotateFaceCCW = (face: number) => {
    const a = get(face, 0, 0), b = get(face, 0, 1), c = get(face, 0, 2)
    const d = get(face, 1, 0), e = get(face, 1, 1), f = get(face, 1, 2)
    const g = get(face, 2, 0), h = get(face, 2, 1), i = get(face, 2, 2)
    set(face, 0, 0, c); set(face, 0, 1, f); set(face, 0, 2, i)
    set(face, 1, 0, b); set(face, 1, 1, e); set(face, 1, 2, h)
    set(face, 2, 0, a); set(face, 2, 1, d); set(face, 2, 2, g)
  }

  switch (move) {
    case 'R': {
      rotateFaceCW(5)
      const u02 = get(0, 0, 2), u12 = get(0, 1, 2), u22 = get(0, 2, 2)
      const f02 = get(2, 0, 2), f12 = get(2, 1, 2), f22 = get(2, 2, 2)
      const d02 = get(1, 0, 2), d12 = get(1, 1, 2), d22 = get(1, 2, 2)
      const b00 = get(3, 0, 0), b10 = get(3, 1, 0), b20 = get(3, 2, 0)
      set(2, 0, 2, u02); set(2, 1, 2, u12); set(2, 2, 2, u22)
      set(1, 0, 2, f02); set(1, 1, 2, f12); set(1, 2, 2, f22)
      set(3, 0, 0, d22); set(3, 1, 0, d12); set(3, 2, 0, d02)
      set(0, 0, 2, b20); set(0, 1, 2, b10); set(0, 2, 2, b00)
      break
    }
    case "R'": {
      rotateFaceCCW(5)
      const u02 = get(0, 0, 2), u12 = get(0, 1, 2), u22 = get(0, 2, 2)
      const f02 = get(2, 0, 2), f12 = get(2, 1, 2), f22 = get(2, 2, 2)
      const d02 = get(1, 0, 2), d12 = get(1, 1, 2), d22 = get(1, 2, 2)
      const b00 = get(3, 0, 0), b10 = get(3, 1, 0), b20 = get(3, 2, 0)
      set(0, 0, 2, f02); set(0, 1, 2, f12); set(0, 2, 2, f22)
      set(2, 0, 2, d02); set(2, 1, 2, d12); set(2, 2, 2, d22)
      set(1, 0, 2, b20); set(1, 1, 2, b10); set(1, 2, 2, b00)
      set(3, 0, 0, u22); set(3, 1, 0, u12); set(3, 2, 0, u02)
      break
    }
    case 'L': {
      rotateFaceCW(4)
      const u00 = get(0, 0, 0), u10 = get(0, 1, 0), u20 = get(0, 2, 0)
      const b02 = get(3, 0, 2), b12 = get(3, 1, 2), b22 = get(3, 2, 2)
      const d00 = get(1, 0, 0), d10 = get(1, 1, 0), d20 = get(1, 2, 0)
      const f00 = get(2, 0, 0), f10 = get(2, 1, 0), f20 = get(2, 2, 0)
      set(0, 0, 0, f00); set(0, 1, 0, f10); set(0, 2, 0, f20)
      set(3, 0, 2, u20); set(3, 1, 2, u10); set(3, 2, 2, u00)
      set(1, 0, 0, b02); set(1, 1, 0, b12); set(1, 2, 0, b22)
      set(2, 0, 0, d00); set(2, 1, 0, d10); set(2, 2, 0, d20)
      break
    }
    case "L'": {
      rotateFaceCCW(4)
      const u00 = get(0, 0, 0), u10 = get(0, 1, 0), u20 = get(0, 2, 0)
      const b02 = get(3, 0, 2), b12 = get(3, 1, 2), b22 = get(3, 2, 2)
      const d00 = get(1, 0, 0), d10 = get(1, 1, 0), d20 = get(1, 2, 0)
      const f00 = get(2, 0, 0), f10 = get(2, 1, 0), f20 = get(2, 2, 0)
      set(2, 0, 0, u00); set(2, 1, 0, u10); set(2, 2, 0, u20)
      set(0, 0, 0, b22); set(0, 1, 0, b12); set(0, 2, 0, b02)
      set(3, 0, 2, d20); set(3, 1, 2, d10); set(3, 2, 2, d00)
      set(1, 0, 0, f00); set(1, 1, 0, f10); set(1, 2, 0, f20)
      break
    }
    case 'U': {
      rotateFaceCW(0)
      const f00 = get(2, 0, 0), f01 = get(2, 0, 1), f02 = get(2, 0, 2)
      const r00 = get(5, 0, 0), r01 = get(5, 0, 1), r02 = get(5, 0, 2)
      const b00 = get(3, 0, 0), b01 = get(3, 0, 1), b02 = get(3, 0, 2)
      const l00 = get(4, 0, 0), l01 = get(4, 0, 1), l02 = get(4, 0, 2)
      set(2, 0, 0, r00); set(2, 0, 1, r01); set(2, 0, 2, r02)
      set(5, 0, 0, b00); set(5, 0, 1, b01); set(5, 0, 2, b02)
      set(3, 0, 0, l00); set(3, 0, 1, l01); set(3, 0, 2, l02)
      set(4, 0, 0, f00); set(4, 0, 1, f01); set(4, 0, 2, f02)
      break
    }
    case "U'": {
      rotateFaceCCW(0)
      const f00 = get(2, 0, 0), f01 = get(2, 0, 1), f02 = get(2, 0, 2)
      const r00 = get(5, 0, 0), r01 = get(5, 0, 1), r02 = get(5, 0, 2)
      const b00 = get(3, 0, 0), b01 = get(3, 0, 1), b02 = get(3, 0, 2)
      const l00 = get(4, 0, 0), l01 = get(4, 0, 1), l02 = get(4, 0, 2)
      set(4, 0, 0, b00); set(4, 0, 1, b01); set(4, 0, 2, b02)
      set(2, 0, 0, l00); set(2, 0, 1, l01); set(2, 0, 2, l02)
      set(5, 0, 0, f00); set(5, 0, 1, f01); set(5, 0, 2, f02)
      set(3, 0, 0, r00); set(3, 0, 1, r01); set(3, 0, 2, r02)
      break
    }
    case 'D': {
      rotateFaceCW(1)
      const f20 = get(2, 2, 0), f21 = get(2, 2, 1), f22 = get(2, 2, 2)
      const l20 = get(4, 2, 0), l21 = get(4, 2, 1), l22 = get(4, 2, 2)
      const b20 = get(3, 2, 0), b21 = get(3, 2, 1), b22 = get(3, 2, 2)
      const r20 = get(5, 2, 0), r21 = get(5, 2, 1), r22 = get(5, 2, 2)
      set(2, 2, 0, l20); set(2, 2, 1, l21); set(2, 2, 2, l22)
      set(5, 2, 0, f20); set(5, 2, 1, f21); set(5, 2, 2, f22)
      set(3, 2, 0, r20); set(3, 2, 1, r21); set(3, 2, 2, r22)
      set(4, 2, 0, b20); set(4, 2, 1, b21); set(4, 2, 2, b22)
      break
    }
    case "D'": {
      rotateFaceCCW(1)
      const f20 = get(2, 2, 0), f21 = get(2, 2, 1), f22 = get(2, 2, 2)
      const l20 = get(4, 2, 0), l21 = get(4, 2, 1), l22 = get(4, 2, 2)
      const b20 = get(3, 2, 0), b21 = get(3, 2, 1), b22 = get(3, 2, 2)
      const r20 = get(5, 2, 0), r21 = get(5, 2, 1), r22 = get(5, 2, 2)
      set(4, 2, 0, f20); set(4, 2, 1, f21); set(4, 2, 2, f22)
      set(2, 2, 0, r20); set(2, 2, 1, r21); set(2, 2, 2, r22)
      set(5, 2, 0, b20); set(5, 2, 1, b21); set(5, 2, 2, b22)
      set(3, 2, 0, l20); set(3, 2, 1, l21); set(3, 2, 2, l22)
      break
    }
    case 'F': {
      rotateFaceCW(2)
      const u20 = get(0, 2, 0), u21 = get(0, 2, 1), u22 = get(0, 2, 2)
      const r00 = get(5, 0, 0), r10 = get(5, 1, 0), r20 = get(5, 2, 0)
      const d00 = get(1, 0, 0), d01 = get(1, 0, 1), d02 = get(1, 0, 2)
      const l02 = get(4, 0, 2), l12 = get(4, 1, 2), l22 = get(4, 2, 2)
      set(5, 0, 0, u20); set(5, 1, 0, u21); set(5, 2, 0, u22)
      set(1, 0, 0, r20); set(1, 0, 1, r10); set(1, 0, 2, r00)
      set(4, 0, 2, d00); set(4, 1, 2, d01); set(4, 2, 2, d02)
      set(0, 2, 0, l22); set(0, 2, 1, l12); set(0, 2, 2, l02)
      break
    }
    case "F'": {
      rotateFaceCCW(2)
      const u20 = get(0, 2, 0), u21 = get(0, 2, 1), u22 = get(0, 2, 2)
      const r00 = get(5, 0, 0), r10 = get(5, 1, 0), r20 = get(5, 2, 0)
      const d00 = get(1, 0, 0), d01 = get(1, 0, 1), d02 = get(1, 0, 2)
      const l02 = get(4, 0, 2), l12 = get(4, 1, 2), l22 = get(4, 2, 2)
      set(0, 2, 0, r00); set(0, 2, 1, r10); set(0, 2, 2, r20)
      set(4, 0, 2, u22); set(4, 1, 2, u21); set(4, 2, 2, u20)
      set(1, 0, 0, l02); set(1, 0, 1, l12); set(1, 0, 2, l22)
      set(5, 0, 0, d02); set(5, 1, 0, d01); set(5, 2, 0, d00)
      break
    }
    case 'B': {
      rotateFaceCW(3)
      const u00 = get(0, 0, 0), u01 = get(0, 0, 1), u02 = get(0, 0, 2)
      const l00 = get(4, 0, 0), l10 = get(4, 1, 0), l20 = get(4, 2, 0)
      const d20 = get(1, 2, 0), d21 = get(1, 2, 1), d22 = get(1, 2, 2)
      const r02 = get(5, 0, 2), r12 = get(5, 1, 2), r22 = get(5, 2, 2)
      set(4, 0, 0, u02); set(4, 1, 0, u01); set(4, 2, 0, u00)
      set(1, 2, 0, l00); set(1, 2, 1, l10); set(1, 2, 2, l20)
      set(5, 0, 2, d20); set(5, 1, 2, d21); set(5, 2, 2, d22)
      set(0, 0, 0, r22); set(0, 0, 1, r12); set(0, 0, 2, r02)
      break
    }
    case "B'": {
      rotateFaceCCW(3)
      const u00 = get(0, 0, 0), u01 = get(0, 0, 1), u02 = get(0, 0, 2)
      const l00 = get(4, 0, 0), l10 = get(4, 1, 0), l20 = get(4, 2, 0)
      const d20 = get(1, 2, 0), d21 = get(1, 2, 1), d22 = get(1, 2, 2)
      const r02 = get(5, 0, 2), r12 = get(5, 1, 2), r22 = get(5, 2, 2)
      set(5, 0, 2, u00); set(5, 1, 2, u01); set(5, 2, 2, u02)
      set(0, 0, 0, l00); set(0, 0, 1, l10); set(0, 0, 2, l20)
      set(4, 0, 0, d22); set(4, 1, 0, d21); set(4, 2, 0, d20)
      set(1, 2, 0, r02); set(1, 2, 1, r12); set(1, 2, 2, r22)
      break
    }
  }
  return next
}

export function createCubeState(): FaceColor[] {
  return createSolvedState()
}

export function applyCubeMove(state: FaceColor[], move: Move): FaceColor[] {
  return applyMove(state, move)
}

export function isSolved(state: FaceColor[]): boolean {
  for (let f = 0; f < NUM_FACES; f++) {
    const center = state[faceletIndex(f, 1, 1)]
    for (let r = 0; r < 3; r++)
      for (let c = 0; c < 3; c++)
        if (state[faceletIndex(f, r, c)] !== center) return false
  }
  return true
}

const ALL_MOVES: Move[] = ['R', "R'", 'L', "L'", 'U', "U'", 'D', "D'", 'F', "F'", 'B', "B'"]

export function scrambleMoves(count: number): Move[] {
  const moves: Move[] = []
  let lastFace = -1
  for (let i = 0; i < count; i++) {
    let idx: number
    do {
      idx = Math.floor(Math.random() * ALL_MOVES.length)
    } while (ALL_MOVES[idx][0] === ALL_MOVES[lastFace]?.[0])
    lastFace = idx
    moves.push(ALL_MOVES[idx])
  }
  return moves
}

export function applyScramble(state: FaceColor[], moves: Move[]): FaceColor[] {
  let s = state
  for (const m of moves) s = applyMove(s, m)
  return s
}
