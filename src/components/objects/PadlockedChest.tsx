import { useState } from 'react'
import Object from './Object'
import { usePlayer } from '../../contexts/PlayerContext'
import { showMessage } from '../hud/MessageDisplay'

interface PadlockedChestProps {
  position: [number, number, number]
  requiredKey: string
  onUnlock?: () => void
}

export default function PadlockedChest({ 
  position, 
  requiredKey,
  onUnlock 
}: PadlockedChestProps) {
  const { hasItem } = usePlayer()
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const handleInteract = () => {
    if (isOpen) {
      return
    }

    if (!isUnlocked) {
      if (hasItem(requiredKey)) {
        setIsUnlocked(true)
        showMessage('Chest unlocked!')
      } else {
        showMessage('The chest is locked.')
      }
    } else {
      setIsOpen(true)
      showMessage('You opened the chest!')
      if (onUnlock) {
        onUnlock()
      }
    }
  }

  return (
    <Object
      position={position}
      color={isUnlocked ? "#8B4513" : "#654321"}
      interactive={true}
      name={isOpen ? "Open Chest" : isUnlocked ? "Unlocked Chest" : "Locked Chest"}
      description={isOpen ? "The chest is open" : isUnlocked ? "Press E to open" : "The chest is locked"}
      interactionConfig={{ 
        actionText: isOpen ? 'Open' : isUnlocked ? 'Open' : 'Unlock', 
        actionKey: 'E',
        distance: 'medium'
      }}
      onInteract={handleInteract}
    >
      {/* Chest body */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1.5, 1, 1]} />
        <meshStandardMaterial color={isUnlocked ? "#8B4513" : "#654321"} />
      </mesh>
      
      {/* Chest lid */}
      <mesh 
        position={[0, isOpen ? 0.6 : 0.5, -0.5]} 
        rotation={[isOpen ? -Math.PI / 3 : 0, 0, 0]}
        castShadow
      >
        <boxGeometry args={[1.5, 0.1, 1]} />
        <meshStandardMaterial color={isUnlocked ? "#8B4513" : "#654321"} />
      </mesh>
      
      {/* Padlock (only if locked) */}
      {!isUnlocked && (
        <mesh position={[0.6, 0.5, 0.51]} castShadow>
          <boxGeometry args={[0.15, 0.2, 0.1]} />
          <meshStandardMaterial color="#C0C0C0" />
        </mesh>
      )}
    </Object>
  )
}

