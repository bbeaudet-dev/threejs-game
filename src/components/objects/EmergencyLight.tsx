import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

interface EmergencyLightProps {
  position: [number, number, number]
  rotation?: [number, number, number]
  spin?: boolean
  color?: string
}

export default function EmergencyLight({
  position,
  rotation = [0, 0, 0],
  spin = true,
  color = '#FF5555',
}: EmergencyLightProps) {
  const coreRef = useRef<THREE.Group>(null)

  useFrame((_, delta) => {
    if (spin && coreRef.current) {
      coreRef.current.rotation.y += delta * 2.0
    }
  })

  return (
    <group position={position} rotation={rotation}>
      {/* Wire cage: rings */}
      {[ -0.3, 0, 0.3 ].map((y, i) => (
        <mesh key={`ring-${i}`} position={[0, y, 0]}>
          <torusGeometry args={[0.22, 0.02, 8, 24]} />
          <meshStandardMaterial color="#777777" metalness={0.6} roughness={0.3} />
        </mesh>
      ))}

      {/* Vertical cage bars */}
      {Array.from({ length: 6 }).map((_, i) => {
        const angle = (i / 6) * Math.PI * 2
        const x = Math.cos(angle) * 0.19
        const z = Math.sin(angle) * 0.19
        return (
          <mesh key={`bar-${i}`} position={[x, 0, z]}>
            <cylinderGeometry args={[0.02, 0.02, 0.9, 6]} />
            <meshStandardMaterial color="#777777" metalness={0.6} roughness={0.3} />
          </mesh>
        )
      })}

      {/* Spinning light core inside cage */}
      <group ref={coreRef}>
        {/* Base dim capsule */}
        <mesh castShadow>
          <cylinderGeometry args={[0.15, 0.15, 0.6, 16]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.8} />
        </mesh>
        {/* Top cap */}
        <mesh position={[0, 0.35, 0]} castShadow>
          <sphereGeometry args={[0.15, 12, 12]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.8} />
        </mesh>
        {/* Bottom cap */}
        <mesh position={[0, -0.35, 0]} castShadow>
          <sphereGeometry args={[0.15, 12, 12]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.6} />
        </mesh>

        {/* Simple bright red point lights so the emergency light actually illuminates the room */}
        <pointLight
          color={color}
          intensity={40}
          distance={18}
          decay={2}
        />
        <pointLight
          color={color}
          intensity={25}
          distance={10}
          decay={2}
          position={[0, 0.3, 0]}
        />
      </group>
    </group>
  )
}

