/**
 * 3D Rubik's Cube visual — original colors. By Baitjet & santosSuccess
 */
import { useMemo } from 'react'
import * as THREE from 'three'
import type { FaceColor } from './colors'
import { faceColorToHex } from './colors'
import { faceletIndex } from './state'

const CUBIE_SIZE = 0.95
const GAP = 0.05

const FACE_IDX: Record<string, number> = { U: 0, D: 1, F: 2, B: 3, L: 4, R: 5 }

function getCubieFaceColor(
  state: FaceColor[],
  ix: number,
  iy: number,
  iz: number,
  face: 'R' | 'L' | 'U' | 'D' | 'F' | 'B'
): string {
  const fi = FACE_IDX[face]
  const get = (r: number, c: number) => state[faceletIndex(fi, r, c)]
  switch (face) {
    case 'U':
      return iy === 1 ? faceColorToHex(get(1 + iz, 1 + ix) as FaceColor) : '#111'
    case 'D':
      return iy === -1 ? faceColorToHex(get(1 - iz, 1 + ix) as FaceColor) : '#111'
    case 'F':
      return iz === 1 ? faceColorToHex(get(1 - iy, 1 + ix) as FaceColor) : '#111'
    case 'B':
      return iz === -1 ? faceColorToHex(get(1 - iy, 1 - ix) as FaceColor) : '#111'
    case 'L':
      return ix === -1 ? faceColorToHex(get(1 - iy, 1 + iz) as FaceColor) : '#111'
    case 'R':
      return ix === 1 ? faceColorToHex(get(1 - iy, 1 + iz) as FaceColor) : '#111'
    default:
      return '#111'
  }
}

function Cubie({
  ix,
  iy,
  iz,
  state,
}: {
  ix: number
  iy: number
  iz: number
  state: FaceColor[]
}) {
  const materials = useMemo(() => {
    const R = getCubieFaceColor(state, ix, iy, iz, 'R')
    const L = getCubieFaceColor(state, ix, iy, iz, 'L')
    const U = getCubieFaceColor(state, ix, iy, iz, 'U')
    const D = getCubieFaceColor(state, ix, iy, iz, 'D')
    const F = getCubieFaceColor(state, ix, iy, iz, 'F')
    const B = getCubieFaceColor(state, ix, iy, iz, 'B')
    return [
      new THREE.MeshStandardMaterial({ color: R, metalness: 0.1, roughness: 0.8 }),
      new THREE.MeshStandardMaterial({ color: L, metalness: 0.1, roughness: 0.8 }),
      new THREE.MeshStandardMaterial({ color: U, metalness: 0.1, roughness: 0.8 }),
      new THREE.MeshStandardMaterial({ color: D, metalness: 0.1, roughness: 0.8 }),
      new THREE.MeshStandardMaterial({ color: F, metalness: 0.1, roughness: 0.8 }),
      new THREE.MeshStandardMaterial({ color: B, metalness: 0.1, roughness: 0.8 }),
    ]
  }, [ix, iy, iz, state])

  const position: [number, number, number] = [ix * (CUBIE_SIZE + GAP), iy * (CUBIE_SIZE + GAP), iz * (CUBIE_SIZE + GAP)]

  return (
    <mesh position={position} castShadow receiveShadow material={materials}>
      <boxGeometry args={[CUBIE_SIZE, CUBIE_SIZE, CUBIE_SIZE]} />
    </mesh>
  )
}

export function CubeVisual({ state }: { state: FaceColor[] }) {
  const cubies = useMemo(() => {
    const out: { ix: number; iy: number; iz: number }[] = []
    for (let ix = -1; ix <= 1; ix++)
      for (let iy = -1; iy <= 1; iy++)
        for (let iz = -1; iz <= 1; iz++) out.push({ ix, iy, iz })
    return out
  }, [])

  return (
    <group>
      {cubies.map(({ ix, iy, iz }) => (
        <Cubie key={`${ix},${iy},${iz}`} ix={ix} iy={iy} iz={iz} state={state} />
      ))}
    </group>
  )
}
