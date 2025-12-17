import Object from './Object'

export default function Bookshelf({ position }: { position: [number, number, number] }) {
  return (
    <Object position={position}>
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
    </Object>
  )
}

