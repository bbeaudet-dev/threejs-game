import Object from './Object'
import { InteractionConfig } from '../../types/GameTypes'

interface PhysicsBoxProps {
  position: [number, number, number]
  color: string
  interactionConfig?: InteractionConfig
}

export default function PhysicsBox({ 
  position, 
  color,
  interactionConfig = { actionText: 'Lift', actionKey: 'E' }
}: PhysicsBoxProps) {
  return (
    <Object
      position={position}
      color={color}
      interactive={true}
      physics={true}
      physicsArgs={[0.8, 0.8, 0.8]}
      name="Movable Box"
      description=""
      interactionConfig={interactionConfig}
      onInteract={() => {}} 
    >
      <mesh castShadow receiveShadow>
        <boxGeometry args={[0.8, 0.8, 0.8]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </Object>
  )
}

