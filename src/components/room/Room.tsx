import { ReactNode } from 'react'
import Wall from './Wall'
import Floor from './Floor'
import Ceiling from './Ceiling'
import * as THREE from 'three'
import { WallOpening } from '../../types/WallTypes'

interface DoorConfig {
  side: 'front' | 'back' | 'left' | 'right'
  position: number
  width?: number
  height?: number
}

interface RoomProps {
  origin?: [number, number, number]
  width: number
  length: number
  height: number
  wallColor?: string
  floorTexture?: THREE.Texture
  ceilingTexture?: THREE.Texture
  doors?: DoorConfig[]
  skipWalls?: {
    front?: boolean
    back?: boolean
    left?: boolean
    right?: boolean
  }
  children?: ReactNode
}

export default function Room({
  origin = [0, 0, 0],
  width,
  length,
  height,
  wallColor = '#D4D4D4',
  floorTexture,
  ceilingTexture,
  doors = [],
  skipWalls = {},
  children,
}: RoomProps) {
  const [ox, oy, oz] = origin
  const halfW = width / 2
  const halfL = length / 2

  const getOpeningsForSide = (side: string): WallOpening[] => {
    return doors
      .filter(door => door.side === side)
      .map(door => ({
        type: 'door' as const,
        position: door.position,
        width: door.width ?? 2,
        height: door.height ?? 3,
      }))
  }

  return (
    <group position={[ox, oy, oz]}>
      <Floor roomWidth={width} roomLength={length} texture={floorTexture} />
      <Ceiling height={height} width={width} length={length} texture={ceilingTexture} />
      
      {!skipWalls.back && (
        <Wall
          position={[0, 0, -halfL]}
          wallHeight={height}
          wallLength={width}
          textureColor={wallColor}
          openings={getOpeningsForSide('back')}
        />
      )}
      {!skipWalls.front && (
        <Wall
          position={[0, 0, halfL]}
          wallHeight={height}
          wallLength={width}
          textureColor={wallColor}
          openings={getOpeningsForSide('front')}
        />
      )}

      {!skipWalls.left && (
        <Wall
          position={[-halfW, 0, 0]}
          rotation={[0, Math.PI / 2, 0]}
          wallHeight={height}
          wallLength={length}
          textureColor={wallColor}
          openings={getOpeningsForSide('left')}
        />
      )}
      {!skipWalls.right && (
        <Wall
          position={[halfW, 0, 0]}
          rotation={[0, Math.PI / 2, 0]}
          wallHeight={height}
          wallLength={length}
          textureColor={wallColor}
          openings={getOpeningsForSide('right')}
        />
      )}

      {children}
    </group>
  )
}
