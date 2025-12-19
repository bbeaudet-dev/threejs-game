import { Canvas } from '@react-three/fiber'
import { PerspectiveCamera } from '@react-three/drei'
import { Physics, usePlane } from '@react-three/cannon'
import { Suspense, ReactNode } from 'react'
import Player from './player/Player'
import PlayerSpawner from './player/PlayerSpawner'
import Floor from './room/Floor'
import { SceneProvider } from '../contexts/SceneContext'
import { PLAYER_EYE_HEIGHT } from '../config/PlayerConfig'
import * as THREE from 'three'

interface SceneProps {
  children: ReactNode
  sceneWidth: number
  sceneLength: number
  sceneHeight: number
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
function Ceiling({
  height,
  width,
  length,
  texture,
}: {
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

export default function Scene({
  sceneWidth,
  sceneLength,
  sceneHeight,
  children,
  floorTexture,
  ceilingTexture,
  ambientLightIntensity = 0.5,
  directionalLightIntensity = 1.2,
  pointLightIntensity = 0.5,
  pointLightPosition = [-10, 8, -10],
  shadowCameraBounds = { left: -15, right: 15, top: 15, bottom: -15 },
}: SceneProps) {
  return (
    <SceneProvider
      properties={{
        sceneWidth,
        sceneLength,
        sceneHeight,
      }}
    >
      <Canvas style={{ width: '100%', height: '100%' }} gl={{ antialias: true }} shadows>
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[0, PLAYER_EYE_HEIGHT, 0]} fov={75} />

          <Physics
            gravity={[0, -9.81, 0]}
            defaultContactMaterial={{ friction: 0.4, restitution: 0.3 }}
          >
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

            <PhysicsFloor />
            {floorTexture && (
              <Floor roomWidth={sceneWidth} roomLength={sceneLength} texture={floorTexture} />
            )}
            {ceilingTexture && (
              <Ceiling
                height={sceneHeight}
                width={sceneWidth}
                length={sceneLength}
                texture={ceilingTexture}
              />
            )}

            {children}
          </Physics>
        </Suspense>
      </Canvas>
    </SceneProvider>
  )
}


