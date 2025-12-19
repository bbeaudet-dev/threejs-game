import { useState } from 'react'
import Object from '../objects/Object'
import { usePlayer } from '../../contexts/PlayerContext'
import { showMessage } from '../hud/MessageDisplay'

interface FuseProps {
  position: [number, number, number]
  rotation?: [number, number, number]
  itemId: string
  color: string
  name?: string
}

export default function Fuse({ position, rotation = [0, 0, 0], itemId, color, name = 'Fuse' }: FuseProps) {
  const { hasItem, addItem } = usePlayer()
  const [collected, setCollected] = useState(hasItem(itemId))

  const handleInteract = () => {
    if (!collected) {
      addItem(itemId)
      setCollected(true)
      showMessage(`${name} acquired!`)
    }
  }

  if (collected) return null

  return (
    <Object
      position={position}
      rotation={rotation}
      color={color}
      interactive={true}
      name={name}
      description="A colored fuse for the breaker box"
      interactionConfig={{
        actionText: 'Take',
        actionKey: 'E',
        distance: 'medium',
      }}
      onInteract={handleInteract}
    >
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.08, 0.08, 0.4, 12]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </Object>
  )
}


