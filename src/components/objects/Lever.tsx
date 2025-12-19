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
      <mesh castShadow receiveShadow position={[0, 0, 0.02]}>
        <boxGeometry args={[0.3, 0.6, 0.05]} />
        <meshStandardMaterial color="#666666" metalness={0.4} roughness={0.5} />
      </mesh>
      {/* Lever arm + knob as a single group so the ball stays attached to the end */}
      <group
        position={[0, 0, 0.15]}
        rotation={[isOn ? -Math.PI / 4 : Math.PI / 4, 0, 0]}
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
    </Object>
  )
}


