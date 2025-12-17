import Object from './Object'

export default function Table({ position }: { position: [number, number, number] }) {
  return (
    <Object position={position}>
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
    </Object>
  )
}

