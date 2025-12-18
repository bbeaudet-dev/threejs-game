import { useState } from 'react'
import Object from './Object'
import { showMessage } from '../hud/MessageDisplay'

interface LeverProps {
  position: [number, number, number]
  rotation?: [number, number, number]
  onToggle?: (isOn: boolean) => void
}

export default function Lever({ position, rotation = [0, 0, 0], onToggle }: LeverProps) {
  const [isOn, setIsOn] = useState(false)

  const handleInteract = () => {
    const next = !isOn
    setIsOn(next)
    if (onToggle) {
      onToggle(next)
    }
    showMessage(next ? 'You pull the lever down.' : 'You reset the lever.')
  }

  return (
    <Object
      position={position}
      rotation={rotation}
      interactive={true}
      isSolid={false}
      name="Lever"
      description="A sturdy metal lever on the wall."
      interactionConfig={{
        actionText: 'Pull',
        actionKey: 'E',
        distance: 'medium',
      }}
      onInteract={handleInteract}
    >
      {/* Wall plate */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[0.3, 0.6, 0.05]} />
        <meshStandardMaterial color="#666666" metalness={0.4} roughness={0.5} />
      </mesh>
      {/* Lever arm */}
      <mesh
        position={[0, 0, 0.15]}
        rotation={[isOn ? -Math.PI / 4 : Math.PI / 4, 0, 0]}
        castShadow
      >
        <boxGeometry args={[0.08, 0.5, 0.08]} />
        <meshStandardMaterial color="#AAAAAA" metalness={0.8} roughness={0.3} />
      </mesh>
      {/* Handle knob */}
      <mesh
        position={[0, isOn ? -0.25 : 0.25, 0.15]}
        castShadow
      >
        <sphereGeometry args={[0.08, 12, 12]} />
        <meshStandardMaterial color="#FFCC33" />
      </mesh>
    </Object>
  )
}


