import { useRef, useState } from 'react'
import { useFrame, ThreeEvent } from '@react-three/fiber'
import { useBox } from '@react-three/cannon'
import * as THREE from 'three'

interface InteractiveObjectProps {
  position: [number, number, number]
  color: string
  name: string
  description: string
  children: React.ReactNode
}

export default function InteractiveObject({
  position,
  color,
  name,
  description,
  children,
}: InteractiveObjectProps) {
  const [hovered, setHovered] = useState(false)
  const [clicked, setClicked] = useState(false)
  const meshRef = useRef<THREE.Mesh | null>(null)

  // Physics body
  const [physicsRef, api] = useBox(() => ({
    mass: 1,
    position,
    args: [0.8, 0.8, 0.8],
    material: {
      friction: 0.4,
      restitution: 0.3,
    },
  }))

  // Hover effect - slight scale and glow
  useFrame(() => {
    if (meshRef.current) {
      const targetScale = hovered ? 1.1 : 1.0
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1)
    }
  })

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation()
    setClicked(!clicked)
    
    // Apply a small impulse when clicked
    api.applyImpulse([0, 2, 0], [0, 0, 0])
    
    // Log interaction
    console.log(`Interacted with: ${name}`)
    console.log(`Description: ${description}`)
  }

  const handlePointerOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    setHovered(true)
    if (document.body) {
      document.body.style.cursor = 'pointer'
    }
  }

  const handlePointerOut = () => {
    setHovered(false)
    if (document.body) {
      document.body.style.cursor = 'default'
    }
  }

  return (
    <mesh
      ref={(mesh) => {
        // Set mesh ref for scaling
        meshRef.current = mesh
        // Set physics ref - use as ref object
        if (mesh && physicsRef && 'current' in physicsRef) {
          (physicsRef as React.MutableRefObject<THREE.Mesh | null>).current = mesh
        }
      }}
      onClick={handleClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      castShadow
      receiveShadow
    >
      {children}
      {/* Material with hover effect */}
      <meshStandardMaterial
        color={color}
        emissive={hovered ? color : '#000000'}
        emissiveIntensity={hovered ? 0.3 : 0}
      />
    </mesh>
  )
}

