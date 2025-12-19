import Object from './Object'

interface TableProps {
  position: [number, number, number]
  variant?: 'default' | 'metal'
}

export default function Table({ position, variant = 'default' }: TableProps) {
  const isMetal = variant === 'metal'
  const topColor = isMetal ? '#777777' : '#8B4513'
  const legColor = isMetal ? '#888888' : '#654321'

  return (
    <Object position={position}>
      <mesh position={[0, 0.8, 0]} castShadow receiveShadow>
        <boxGeometry args={[2, 0.1, 1.5]} />
        <meshStandardMaterial color={topColor} metalness={isMetal ? 0.8 : 0.1} roughness={isMetal ? 0.4 : 0.8} />
      </mesh>
      {[
        [-0.9, 0.4, -0.65],
        [0.9, 0.4, -0.65],
        [-0.9, 0.4, 0.65],
        [0.9, 0.4, 0.65],
      ].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]} castShadow>
          <cylinderGeometry args={[0.05, 0.05, 0.8, 8]} />
          <meshStandardMaterial color={legColor} metalness={isMetal ? 0.8 : 0.1} roughness={isMetal ? 0.4 : 0.8} />
        </mesh>
      ))}
    </Object>
  )
}

