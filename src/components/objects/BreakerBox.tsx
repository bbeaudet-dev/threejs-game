import { useState, useEffect } from 'react'
import Object from './Object'
import { usePlayer } from '../../contexts/PlayerContext'
import { showMessage } from '../hud/MessageDisplay'

const REQUIRED_FUSES = ['fuse-red', 'fuse-green', 'fuse-blue'] as const
type FuseId = (typeof REQUIRED_FUSES)[number]

interface BreakerBoxProps {
  position: [number, number, number]
  rotation?: [number, number, number]
  onPowerRestored?: () => void
}

export default function BreakerBox({ position, rotation = [0, 0, 0], onPowerRestored }: BreakerBoxProps) {
  const { hasItem, removeItem } = usePlayer()
  const [inserted, setInserted] = useState<Record<FuseId, boolean>>({
    'fuse-red': false,
    'fuse-green': false,
    'fuse-blue': false,
  })

  const allInserted = REQUIRED_FUSES.every((id) => inserted[id])

  useEffect(() => {
    if (allInserted) {
      if (onPowerRestored) {
        onPowerRestored()
      }
      showMessage('Power restored.', 3000, 'success')
    }
  }, [allInserted])

  const handleInteract = () => {
    // Try to insert one fuse the player is holding but not yet inserted
    for (const id of REQUIRED_FUSES) {
      if (!inserted[id] && hasItem(id)) {
        removeItem(id)
        setInserted((prev) => ({ ...prev, [id]: true }))
        showMessage(`Inserted ${id.replace('fuse-', '')} fuse.`)
        return
      }
    }

    if (!allInserted) {
      showMessage('You are missing one or more fuses.')
    } else {
      showMessage('The breaker box is already fully powered.')
    }
  }

  return (
    <Object
      position={position}
      rotation={rotation}
      interactive={true}
      isSolid={true}
      name="Breaker Box"
      description="A breaker box with three fuse slots."
      interactionConfig={{
        actionText: 'Inspect',
        actionKey: 'E',
        distance: 'medium',
      }}
      onInteract={handleInteract}
    >
      {/* Box body */}
      <mesh position={[0, 1, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.2, 2, 0.4]} />
        <meshStandardMaterial color="#B0B0B0" metalness={0.4} roughness={0.4} />
      </mesh>

      {/* Fuse slots on the front */}
      {/* Red slot */}
      {inserted['fuse-red'] && (
        <mesh position={[-0.3, 1.2, 0.22]} castShadow receiveShadow>
          <cylinderGeometry args={[0.06, 0.06, 0.3, 12]} />
          <meshStandardMaterial color="#FF6B6B" />
        </mesh>
      )}
      {/* Green slot */}
      {inserted['fuse-green'] && (
        <mesh position={[0, 1.2, 0.22]} castShadow receiveShadow>
          <cylinderGeometry args={[0.06, 0.06, 0.3, 12]} />
          <meshStandardMaterial color="#4ECDC4" />
        </mesh>
      )}
      {/* Blue slot */}
      {inserted['fuse-blue'] && (
        <mesh position={[0.3, 1.2, 0.22]} castShadow receiveShadow>
          <cylinderGeometry args={[0.06, 0.06, 0.3, 12]} />
          <meshStandardMaterial color="#3498DB" />
        </mesh>
      )}
    </Object>
  )
}


