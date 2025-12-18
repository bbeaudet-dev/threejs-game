import Object from './Object'

interface PhysicsBallProps {
  position: [number, number, number]
  color: string
  radius?: number
}

export default function PhysicsBall({
  position,
  color,
  radius = 0.6,
}: PhysicsBallProps) {
  const size: [number, number, number] = [radius * 2, radius * 2, radius * 2]

  return (
    <Object
      position={position}
      color={color}
      interactive={true}
      physics={true}
      physicsArgs={size}
      name="Physics Ball"
      description=""
      interactionConfig={{ actionText: 'Push', actionKey: 'E' }}
      onInteract={() => {}}
    >
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[radius, 32, 32]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </Object>
  )
}


