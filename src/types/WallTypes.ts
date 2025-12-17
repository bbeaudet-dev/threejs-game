// Types for wall openings and features

export interface WallOpening {
  type: 'door' | 'window' | 'fireplace' | 'custom'
  position: number // Position along wall (0 = center, negative = left, positive = right)
  width: number
  height?: number
  yOffset?: number // Vertical offset from floor (default: 0 for doors, varies for windows)
}

export interface WallProps {
  position: [number, number, number]
  rotation?: [number, number, number]
  wallHeight: number
  wallLength: number
  openings?: WallOpening[]
  textureColor?: string
}

