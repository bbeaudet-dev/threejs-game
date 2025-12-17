import { Canvas } from '@react-three/fiber'
import { PerspectiveCamera } from '@react-three/drei'
import { Physics, usePlane } from '@react-three/cannon'
import { Suspense, ReactNode } from 'react'
import Player from '../player/Player'
import PlayerSpawner from '../player/PlayerSpawner'
import Floor from '../walls/Floor'
import { RoomProvider } from '../../contexts/RoomContext'
import { PLAYER_EYE_HEIGHT } from '../../config/PlayerConfig'
import * as THREE from 'three'

interface RoomProps {
  children: ReactNode
  roomWidth: number
  roomLength: number
  roomHeight: number
  floorTexture?: THREE.Texture
  ceilingTexture?: THREE.Texture
  ambientLightIntensity?: number
  directionalLightIntensity?: number
  pointLightIntensity?: number
  pointLightPosition?: [number, number, number]
  shadowCameraBounds?: {
    left: number
    right: number
    top: number
    bottom: number
  }
}

// Physics floor collider
function PhysicsFloor() {
  const [ref] = usePlane(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    position: [0, 0, 0],
  }))
  return <mesh ref={ref as any} visible={false} />
}

// Ceiling component
function Ceiling({ height, width, length, texture }: { 
  height: number
  width: number
  length: number
  texture?: THREE.Texture
}) {
  return (
    <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, height, 0]} receiveShadow>
      <planeGeometry args={[width, length]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  )
}

export default function Room({
  roomWidth,
  roomLength,
  roomHeight,
  children,
  floorTexture,
  ceilingTexture,
  ambientLightIntensity = 0.5,
  directionalLightIntensity = 1.2,
  pointLightIntensity = 0.5,
  pointLightPosition = [-10, 8, -10],
  shadowCameraBounds = { left: -15, right: 15, top: 15, bottom: -15 },
}: RoomProps) {
  return (
    <RoomProvider properties={{ roomWidth, roomLength, roomHeight }}>
      <Canvas
        style={{ width: '100%', height: '100%' }}
        gl={{ antialias: true }}
        shadows
      >
        <Suspense fallback={null}>
          <PerspectiveCamera
            makeDefault
            position={[0, PLAYER_EYE_HEIGHT, 0]}
            fov={75}
          />

          <Physics gravity={[0, -9.81, 0]} defaultContactMaterial={{ friction: 0.4, restitution: 0.3 }}>
            <PlayerSpawner />
            <Player />

            <ambientLight intensity={ambientLightIntensity} />
            <directionalLight
              position={[10, 15, 10]}
              intensity={directionalLightIntensity}
              castShadow
              shadow-mapSize-width={2048}
              shadow-mapSize-height={2048}
              shadow-camera-left={shadowCameraBounds.left}
              shadow-camera-right={shadowCameraBounds.right}
              shadow-camera-top={shadowCameraBounds.top}
              shadow-camera-bottom={shadowCameraBounds.bottom}
            />
            <pointLight position={pointLightPosition} intensity={pointLightIntensity} />

            {/* Room structure */}
            <PhysicsFloor />
            <Floor roomWidth={roomWidth} roomLength={roomLength} texture={floorTexture} />
            <Ceiling height={roomHeight} width={roomWidth} length={roomLength} texture={ceilingTexture} />

            {/* Room content (walls, doors, furniture, etc.) */}
            {children}
          </Physics>
        </Suspense>
      </Canvas>
    </RoomProvider>
  )
}

