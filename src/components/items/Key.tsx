import { useState } from 'react'
import Object from '../objects/Object'
import { usePlayer } from '../../contexts/PlayerContext'
import { showMessage } from '../hud/MessageDisplay'

interface KeyProps {
  position: [number, number, number]
  itemId: string
  name?: string
}

export default function Key({ position, itemId, name = 'Key' }: KeyProps) {
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
      color="#FFD700"
      interactive={true}
      name={name}
      description="A key that might unlock something"
      interactionConfig={{ 
        actionText: 'Take', 
        actionKey: 'E',
        distance: 'medium'
      }}
      onInteract={handleInteract}
    >
      <mesh castShadow>
        <boxGeometry args={[0.15, 0.4, 0.05]} />
        <meshStandardMaterial 
          color="#FFD700"
          emissive="#FFA500"
          emissiveIntensity={0.3}
        />
      </mesh>
      {/* Key teeth */}
      <mesh position={[0, 0.15, 0]} castShadow>
        <boxGeometry args={[0.05, 0.1, 0.05]} />
        <meshStandardMaterial color="#FFD700" />
      </mesh>
      <mesh position={[0, 0.25, 0]} castShadow>
        <boxGeometry args={[0.05, 0.1, 0.05]} />
        <meshStandardMaterial color="#FFD700" />
      </mesh>
    </Object>
  )
}

