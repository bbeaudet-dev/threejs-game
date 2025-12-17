import { Canvas } from '@react-three/fiber'
import { PerspectiveCamera } from '@react-three/drei'
import { Physics } from '@react-three/cannon'
import { Suspense } from 'react'
import Player from './Player'
import InteractiveObject from './InteractiveObject'
import * as THREE from 'three'

// Room dimensions 
const ROOM_SIZE = 30
const WALL_HEIGHT = 8

// Floor component with texture
function Floor() {
  // Create a simple procedural texture
  const texture = new THREE.CanvasTexture(
    (() => {
      const canvas = document.createElement('canvas')
      canvas.width = 512
      canvas.height = 512
      const ctx = canvas.getContext('2d')!
      
      // Wood-like pattern
      ctx.fillStyle = '#8B7355'
      ctx.fillRect(0, 0, 512, 512)
      
      for (let i = 0; i < 20; i++) {
        ctx.strokeStyle = `rgba(139, 115, 85, ${0.3 + Math.random() * 0.2})`
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(0, i * 25.6)
        ctx.lineTo(512, i * 25.6 + Math.sin(i) * 10)
        ctx.stroke()
      }
      
      return canvas
    })()
  )
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(4, 4)
  
  return (
    <mesh 
      rotation={[-Math.PI / 2, 0, 0]} 
      position={[0, 0, 0]} 
      receiveShadow
    >
      <planeGeometry args={[ROOM_SIZE, ROOM_SIZE]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  )
}

// Reusable Wall component with texture
function Wall({ 
  position, 
  rotation 
}: { 
  position: [number, number, number]
  rotation?: [number, number, number] 
}) {
  // Simple wall texture
  const texture = new THREE.CanvasTexture(
    (() => {
      const canvas = document.createElement('canvas')
      canvas.width = 256
      canvas.height = 256
      const ctx = canvas.getContext('2d')!
      
      ctx.fillStyle = '#D4A574'
      ctx.fillRect(0, 0, 256, 256)
      
      // Add some texture variation
      for (let i = 0; i < 50; i++) {
        ctx.fillStyle = `rgba(212, 165, 116, ${0.1 + Math.random() * 0.1})`
        ctx.fillRect(
          Math.random() * 256,
          Math.random() * 256,
          Math.random() * 20,
          Math.random() * 20
        )
      }
      
      return canvas
    })()
  )
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(2, 2)
  
  return (
    <mesh position={position} rotation={rotation} receiveShadow castShadow>
      <boxGeometry args={[ROOM_SIZE, WALL_HEIGHT, 0.2]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  )
}

// Ceiling with texture
function Ceiling() {
  const texture = new THREE.CanvasTexture(
    (() => {
      const canvas = document.createElement('canvas')
      canvas.width = 256
      canvas.height = 256
      const ctx = canvas.getContext('2d')!
      
      ctx.fillStyle = '#E8D5B7'
      ctx.fillRect(0, 0, 256, 256)
      
      // Add subtle pattern
      for (let i = 0; i < 10; i++) {
        ctx.strokeStyle = `rgba(232, 213, 183, ${0.2})`
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.arc(
          Math.random() * 256,
          Math.random() * 256,
          Math.random() * 30,
          0,
          Math.PI * 2
        )
        ctx.stroke()
      }
      
      return canvas
    })()
  )
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(4, 4)
  
  return (
    <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, WALL_HEIGHT, 0]} receiveShadow>
      <planeGeometry args={[ROOM_SIZE, ROOM_SIZE]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  )
}

// Table component
function Table({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Table top */}
      <mesh position={[0, 0.8, 0]} castShadow receiveShadow>
        <boxGeometry args={[2, 0.1, 1.5]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
      {/* Legs */}
      {[
        [-0.9, 0.4, -0.65],
        [0.9, 0.4, -0.65],
        [-0.9, 0.4, 0.65],
        [0.9, 0.4, 0.65],
      ].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]} castShadow>
          <cylinderGeometry args={[0.05, 0.05, 0.8, 8]} />
          <meshStandardMaterial color="#654321" />
        </mesh>
      ))}
    </group>
  )
}

// Chair component
function Chair({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Seat */}
      <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.6, 0.1, 0.6]} />
        <meshStandardMaterial color="#4A4A4A" />
      </mesh>
      {/* Back */}
      <mesh position={[0, 0.7, -0.25]} castShadow>
        <boxGeometry args={[0.6, 0.6, 0.1]} />
        <meshStandardMaterial color="#4A4A4A" />
      </mesh>
      {/* Legs */}
      {[
        [-0.25, 0.2, -0.25],
        [0.25, 0.2, -0.25],
        [-0.25, 0.2, 0.25],
        [0.25, 0.2, 0.25],
      ].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 0.4, 8]} />
          <meshStandardMaterial color="#2A2A2A" />
        </mesh>
      ))}
    </group>
  )
}

// Bookshelf component
function Bookshelf({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Main structure */}
      <mesh position={[0, 1.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.5, 3, 0.3]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
      {/* Shelves */}
      {[0.5, 0, -0.5].map((y, i) => (
        <mesh key={i} position={[0, y + 1.5, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.4, 0.05, 0.25]} />
          <meshStandardMaterial color="#654321" />
        </mesh>
      ))}
      {/* Books */}
      {[
        { pos: [-0.6, 2, 0.1], color: '#FF6B6B', size: [0.15, 0.8, 0.2] },
        { pos: [-0.3, 2, 0.1], color: '#4ECDC4', size: [0.15, 0.8, 0.2] },
        { pos: [0, 2, 0.1], color: '#FFE66D', size: [0.15, 0.8, 0.2] },
        { pos: [0.3, 2, 0.1], color: '#95E1D3', size: [0.15, 0.8, 0.2] },
        { pos: [0.6, 1.2, 0.1], color: '#F38181', size: [0.15, 0.6, 0.2] },
        { pos: [0.3, 1.2, 0.1], color: '#AA96DA', size: [0.15, 0.6, 0.2] },
      ].map((book, i) => (
        <mesh key={i} position={book.pos as [number, number, number]} castShadow>
          <boxGeometry args={book.size as [number, number, number]} />
          <meshStandardMaterial color={book.color} />
        </mesh>
      ))}
    </group>
  )
}

// Physics-enabled box that can be pushed
function PhysicsBox({ position, color }: { position: [number, number, number], color: string }) {
  return (
    <InteractiveObject
      position={position}
      color={color}
      name="Movable Box"
      description="You can push this box around!"
    >
      <boxGeometry args={[0.8, 0.8, 0.8]} />
      <meshStandardMaterial color={color} />
    </InteractiveObject>
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

        {/* Physics world */}
        <Physics gravity={[0, -9.81, 0]} defaultContactMaterial={{ friction: 0.4, restitution: 0.3 }}>
          {/* Player controls */}
          <Player />

          {/* Lighting */}
          <ambientLight intensity={0.5} />
          <directionalLight
            position={[10, 15, 10]}
            intensity={1.2}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
            shadow-camera-left={-15}
            shadow-camera-right={15}
            shadow-camera-top={15}
            shadow-camera-bottom={-15}
          />
          <pointLight position={[-10, 8, -10]} intensity={0.5} />

          {/* Room */}
          <Floor />
          <Ceiling />
          <Wall position={[0, WALL_HEIGHT / 2, -ROOM_SIZE / 2]} />
          <Wall position={[0, WALL_HEIGHT / 2, ROOM_SIZE / 2]} />
          <Wall position={[-ROOM_SIZE / 2, WALL_HEIGHT / 2, 0]} rotation={[0, Math.PI / 2, 0]} />
          <Wall position={[ROOM_SIZE / 2, WALL_HEIGHT / 2, 0]} rotation={[0, Math.PI / 2, 0]} />

          {/* Furniture */}
          <Table position={[-5, 0, -5]} />
          <Chair position={[-6, 0, -4]} />
          <Chair position={[-4, 0, -4]} />
          <Bookshelf position={[-12, 0, -12]} />
          <Table position={[8, 0, 8]} />
          <Chair position={[7, 0, 9]} />
          <Bookshelf position={[12, 0, 12]} />

          {/* Interactive physics objects */}
          <PhysicsBox position={[3, 1, -3]} color="#FF6B6B" />
          <PhysicsBox position={[-3, 1, 3]} color="#4ECDC4" />
          <PhysicsBox position={[0, 1, 0]} color="#FFE66D" />
          <PhysicsBox position={[5, 1, -8]} color="#95E1D3" />
        </Physics>
      </Suspense>
    </Canvas>
  )
}

export default Scene
