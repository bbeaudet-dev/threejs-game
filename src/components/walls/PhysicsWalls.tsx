import { usePlane } from '@react-three/cannon'

interface PhysicsWallsProps {
  roomSize: number
  wallHeight: number
}

// Physics wall colliders (invisible, for collisions)
export default function PhysicsWalls({ roomSize, wallHeight }: PhysicsWallsProps) {
  const halfSize = roomSize / 2
  
  // Back wall (negative Z)
  const [backWallRef] = usePlane(() => ({
    rotation: [0, 0, 0],
    position: [0, wallHeight / 2, -halfSize],
  }))
  
  // Front wall (positive Z)
  const [frontWallRef] = usePlane(() => ({
    rotation: [0, Math.PI, 0],
    position: [0, wallHeight / 2, halfSize],
  }))
  
  // Left wall (negative X)
  const [leftWallRef] = usePlane(() => ({
    rotation: [0, Math.PI / 2, 0],
    position: [-halfSize, wallHeight / 2, 0],
  }))
  
  // Right wall (positive X)
  const [rightWallRef] = usePlane(() => ({
    rotation: [0, -Math.PI / 2, 0],
    position: [halfSize, wallHeight / 2, 0],
  }))
  
  return (
    <>
      <mesh ref={backWallRef as any} visible={false} />
      <mesh ref={frontWallRef as any} visible={false} />
      <mesh ref={leftWallRef as any} visible={false} />
      <mesh ref={rightWallRef as any} visible={false} />
    </>
  )
}

