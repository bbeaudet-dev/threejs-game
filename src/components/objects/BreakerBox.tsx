import { useState } from 'react'
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
  const [leverDown, setLeverDown] = useState(false)
  const [powerEngaged, setPowerEngaged] = useState(false)

  const handleInteract = () => {
    // First, try to insert one fuse the player is holding but not yet inserted
    for (const id of REQUIRED_FUSES) {
      if (!inserted[id] && hasItem(id)) {
        removeItem(id)
        setInserted((prev) => ({ ...prev, [id]: true }))
        showMessage(`Inserted ${id.replace('fuse-', '')} fuse.`)
        return
      }
    }

    setLeverDown(true)

    if (powerEngaged) {
      showMessage('The power is already on.')
      return
    }

    if (!allInserted) {
      showMessage('Nothing happens. Some fuses are still missing.')
      setTimeout(() => {
        // Only auto-reset if power still isn't on
        setLeverDown(false)
      }, 500)
      return
    }

    setPowerEngaged(true)
    showMessage('You pull the lever. Power restored.', 3000, 'success')
    if (onPowerRestored) {
      onPowerRestored()
    }
  }

  return (
    <Object
      position={position}
      rotation={rotation}
      interactive={true}
      isSolid={true}
      disableHoverEffects={true}
      name="Breaker Box"
      description="A breaker box with three fuse slots."
      interactionConfig={{
        actionText: 'Use',
        actionKey: 'E',
        distance: 'medium',
      }}
      onInteract={handleInteract}
    >
      <mesh position={[0, 1, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.2, 2, 0.4]} />
        <meshStandardMaterial color="#B0B0B0" metalness={0.4} roughness={0.4} />
      </mesh>

      {inserted['fuse-red'] && (
        <mesh position={[-0.3, 1.2, 0.22]} castShadow receiveShadow>
          <cylinderGeometry args={[0.06, 0.06, 0.3, 12]} />
          <meshStandardMaterial color="#FF6B6B" />
        </mesh>
      )}
      {inserted['fuse-green'] && (
        <mesh position={[0, 1.2, 0.22]} castShadow receiveShadow>
          <cylinderGeometry args={[0.06, 0.06, 0.3, 12]} />
          <meshStandardMaterial color="#4ECDC4" />
        </mesh>
      )}
      {inserted['fuse-blue'] && (
        <mesh position={[0.3, 1.2, 0.22]} castShadow receiveShadow>
          <cylinderGeometry args={[0.06, 0.06, 0.3, 12]} />
          <meshStandardMaterial color="#3498DB" />
        </mesh>
      )}

      <group position={[0.6, 1, 0]} rotation={[0, Math.PI / 2, 0]}>
        <mesh castShadow receiveShadow position={[0, 0, 0.02]}>
          <boxGeometry args={[0.3, 0.6, 0.05]} />
          <meshStandardMaterial color="#666666" metalness={0.4} roughness={0.5} />
        </mesh>
        <group
          position={[0, 0, 0.15]}
          rotation={[leverDown ? 3 * Math.PI / 4 : Math.PI / 4, 0, 0]}
        >
          <mesh castShadow>
            <boxGeometry args={[0.08, 0.5, 0.08]} />
            <meshStandardMaterial color="#AAAAAA" metalness={0.8} roughness={0.3} />
          </mesh>
          <mesh castShadow position={[0, 0.3, 0]}>
            <sphereGeometry args={[0.08, 12, 12]} />
            <meshStandardMaterial color="#FFCC33" />
          </mesh>
        </group>
      </group>
    </Object>
  )
}


