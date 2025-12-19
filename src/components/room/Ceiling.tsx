import * as THREE from 'three'

interface CeilingProps {
  height: number
  width: number
  length: number
  texture?: THREE.Texture
}

export default function Ceiling({
  height,
  width,
  length,
  texture,
}: CeilingProps) {
  return (
    <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, height, 0]} receiveShadow>
      <planeGeometry args={[width, length]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  )
}

