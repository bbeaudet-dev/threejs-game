import { Canvas } from '@react-three/fiber'
import { PerspectiveCamera } from '@react-three/drei'
import { Suspense } from 'react'
import Player from './Player'

// Room dimensions
const ROOM_SIZE = 10
const WALL_HEIGHT = 5

// Floor component
function Floor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
      <planeGeometry args={[ROOM_SIZE, ROOM_SIZE]} />
      <meshStandardMaterial color="#8B7355" />
    </mesh>
  )
}

// Wall component (reusable)
function Wall({ 
  position, 
  rotation 
}: { 
  position: [number, number, number]
  rotation?: [number, number, number] 
}) {
  return (
    <mesh position={position} rotation={rotation} receiveShadow castShadow>
      <boxGeometry args={[ROOM_SIZE, WALL_HEIGHT, 0.2]} />
      <meshStandardMaterial color="#D4A574" />
    </mesh>
  )
}

// Ceiling
function Ceiling() {
  return (
    <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, WALL_HEIGHT, 0]} receiveShadow>
      <planeGeometry args={[ROOM_SIZE, ROOM_SIZE]} />
      <meshStandardMaterial color="#E8D5B7" />
    </mesh>
  )
}

// A simple object to look at
function TestObject() {
  return (
    <mesh position={[2, 1, -2]} castShadow>
      <boxGeometry args={[1, 2, 1]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  )
}

function Scene() {
  return (
    <Canvas
      style={{ width: '100%', height: '100%' }}
      gl={{ antialias: true }}
      shadows
    >
      <Suspense fallback={null}>
        {/* Camera - controlled by Player component */}
        <PerspectiveCamera
          makeDefault
          position={[0, 1.6, 0]} // Eye level
          fov={75}
        />

        {/* Player controls */}
        <Player />

        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[5, 10, 5]}
          intensity={1}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />

        {/* Room */}
        <Floor />
        <Ceiling />
        <Wall position={[0, WALL_HEIGHT / 2, -ROOM_SIZE / 2]} />
        <Wall position={[0, WALL_HEIGHT / 2, ROOM_SIZE / 2]} />
        <Wall position={[-ROOM_SIZE / 2, WALL_HEIGHT / 2, 0]} rotation={[0, Math.PI / 2, 0]} />
        <Wall position={[ROOM_SIZE / 2, WALL_HEIGHT / 2, 0]} rotation={[0, Math.PI / 2, 0]} />

        {/* Test object */}
        <TestObject />
      </Suspense>
    </Canvas>
  )
}

export default Scene
