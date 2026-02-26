/**
 * Original Rubik's Cube face colors.
 * By Baitjet & santosSuccess
 */
export type FaceColor = 'white' | 'yellow' | 'red' | 'orange' | 'green' | 'blue'

export const FACE_COLORS: Record<FaceColor, string> = {
  white: '#ffffff',
  yellow: '#ffd700',
  red: '#dc143c',
  orange: '#ff8c00',
  green: '#228b22',
  blue: '#4169e1',
}

/** Face index: U=0, D=1, F=2, B=3, L=4, R=5 */
export const FACE_ORDER: FaceColor[] = ['white', 'yellow', 'red', 'orange', 'green', 'blue']

export function faceColorToHex(color: FaceColor): string {
  return FACE_COLORS[color]
}
