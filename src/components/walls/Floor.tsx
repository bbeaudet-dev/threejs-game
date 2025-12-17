import * as THREE from 'three'

interface FloorProps {
  roomWidth: number
  roomLength: number
  texture?: THREE.Texture
  wallThickness?: number
}

const WALL_THICKNESS = 0.2 // Match wall thickness

export default function Floor({ 
  roomWidth,
  roomLength,
  texture,
  wallThickness = WALL_THICKNESS 
}: FloorProps) {
  // Extend floor by wall thickness to cover under walls
  const floorWidth = roomWidth + wallThickness * 2
  const floorLength = roomLength + wallThickness * 2
  
  return (
    <mesh 
      rotation={[-Math.PI / 2, 0, 0]} 
      position={[0, 0, 0]} 
      receiveShadow
    >
      <planeGeometry args={[floorWidth, floorLength]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  )
}

