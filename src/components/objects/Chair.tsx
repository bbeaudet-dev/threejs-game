import Object from './Object'

export default function Chair({ position }: { position: [number, number, number] }) {
  return (
    <Object position={position}>
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
    </Object>
  )
}

