import { useState } from 'react'
import Object from '../objects/Object'
import { usePlayer } from '../../contexts/PlayerContext'
import { showMessage } from '../hud/MessageDisplay'

interface SpeedBoostProps {
  position: [number, number, number]
}

export default function SpeedBoost({ position }: SpeedBoostProps) {
  const { setMoveSpeedMultiplier, hasItem, addItem } = usePlayer()
  const [collected, setCollected] = useState(hasItem('speed-boost'))

  const handleInteract = () => {
    if (!collected) {
      setMoveSpeedMultiplier(2)
      addItem('speed-boost')
      setCollected(true)
      showMessage('Speed Boost Acquired! Movement speed doubled!')
    }
  }

  if (collected) return null // Hide after collection

  return (
    <Object
      position={position}
      color="#FFD700"
      interactive={true}
      name="Speed Boost Crystal"
      description="A glowing crystal that enhances movement speed"
      interactionConfig={{ 
        actionText: 'Examine', 
        actionKey: 'E',
        distance: 'high' // Can interact from farther away
      }}
      onInteract={handleInteract}
    >
      <mesh castShadow>
        <octahedronGeometry args={[0.8, 0]} />
        <meshStandardMaterial 
          color="#FFD700"
          emissive="#FFA500"
          emissiveIntensity={0.5}
        />
      </mesh>
    </Object>
  )
}

