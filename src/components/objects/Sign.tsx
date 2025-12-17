import { Text } from '@react-three/drei'
import Object from './Object'

interface SignProps {
  position: [number, number, number]
  rotation?: [number, number, number]
  width?: number
  height?: number
  text: string
}

export default function Sign({
  position,
  rotation = [0, 0, 0],
  width = 4,
  height = 2,
  text,
}: SignProps) {
  return (
    <Object
      position={position}
      rotation={rotation}
      color="#555555"
      interactive={false}
      isSolid={false}
    >
      {/* Sign board */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[width, height, 0.1]} />
        <meshStandardMaterial color="#3A3A3A" />
      </mesh>

      {/* Text on sign */}
      <Text
        position={[0, 0, 0.06]}
        fontSize={0.45}
        color="#FFFFFF"
        anchorX="center"
        anchorY="middle"
      >
        {text}
      </Text>
    </Object>
  )
}


