import { useWallTexture } from '../../utils/textures'
import { WallProps } from '../../types/WallTypes'
import { useBox } from '@react-three/cannon'

export default function Wall({
  position,
  rotation = [0, 0, 0],
  wallHeight,
  wallLength,
  openings = [],
  textureColor = '#D4A574',
}: WallProps) {
  const texture = useWallTexture(textureColor)
  
  // Sort openings by position
  const sortedOpenings = [...openings].sort((a, b) => a.position - b.position)
  
  // Calculate wall segments (parts that aren't openings)
  const segments: Array<{ start: number, end: number }> = []
  let currentStart = -wallLength / 2
  
  for (const opening of sortedOpenings) {
    const openingStart = opening.position - opening.width / 2
    const openingEnd = opening.position + opening.width / 2
    
    // Add wall segment before opening
    if (openingStart > currentStart) {
      segments.push({ start: currentStart, end: openingStart })
    }
    currentStart = openingEnd
  }
  
  // Add final wall segment
  if (currentStart < wallLength / 2) {
    segments.push({ start: currentStart, end: wallLength / 2 })
  }
  
  // If no openings, create full wall
  if (segments.length === 0) {
    segments.push({ start: -wallLength / 2, end: wallLength / 2 })
  }

  return (
    <group position={position} rotation={rotation} userData={{ isWall: true }}>
      {/* Render full-height wall segments with physics */}
      {segments.map((segment, i) => {
        const width = segment.end - segment.start
        const centerX = (segment.start + segment.end) / 2
        return <WallSegment 
          key={`segment-${i}`}
          position={[centerX, wallHeight / 2, 0]}
          size={[width, wallHeight, 0.2]}
          texture={texture}
        />
      })}
      
      {/* Render wall sections above and below openings (matching wall texture) */}
      {sortedOpenings.map((opening, i) => {
        const yOffset = opening.yOffset || 0
        const height = opening.height || 3
        const openingTop = yOffset + height
        const openingBottom = yOffset
        
        return (
          <group key={`opening-walls-${i}`}>
            {/* Top section (above opening, if opening doesn't reach ceiling) */}
            {openingTop < wallHeight && (
              <WallSegment
                position={[opening.position, openingTop + (wallHeight - openingTop) / 2, 0]}
                size={[opening.width, wallHeight - openingTop, 0.2]}
                texture={texture}
              />
            )}
            
            {/* Bottom section (below opening, if opening doesn't start at floor) */}
            {openingBottom > 0 && (
              <WallSegment
                position={[opening.position, openingBottom / 2, 0]}
                size={[opening.width, openingBottom, 0.2]}
                texture={texture}
              />
            )}
          </group>
        )
      })}
    </group>
  )
}

// Wall segment with physics collider
function WallSegment({ 
  position, 
  size, 
  texture 
}: { 
  position: [number, number, number]
  size: [number, number, number]
  texture: THREE.Texture
}) {
  const [ref] = useBox(() => ({
    type: 'Static',
    position,
    args: size,
  }))
  
  return (
    <mesh
      ref={ref as any}
      position={position}
      receiveShadow
      castShadow
      userData={{ isWall: true }} // Mark as wall for collision detection
    >
      <boxGeometry args={size} />
      <meshStandardMaterial map={texture} />
    </mesh>
  )
}
