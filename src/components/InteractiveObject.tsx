import { useRef, useState, useEffect } from 'react'
import { useFrame, ThreeEvent } from '@react-three/fiber'
import { useBox } from '@react-three/cannon'
import { useInteraction } from '../systems/InteractionSystem'
import { registerInteractiveObject, unregisterInteractiveObject } from './hud/InteractionTooltip'
import { showMessage } from './hud/MessageDisplay'
import { InteractionConfig } from '../types/GameTypes'
import * as THREE from 'three'

interface InteractiveObjectProps {
  position: [number, number, number]
  color: string
  name: string
  description: string
  children: React.ReactNode
  interactionConfig?: InteractionConfig
  onInteract?: () => void // Custom interaction handler
}

// Generate unique ID for each interactive object
let interactiveIdCounter = 0

export default function InteractiveObject({
  position,
  color,
  name,
  description,
  children,
  interactionConfig = { actionText: 'Interact', actionKey: 'E' },
  onInteract,
}: InteractiveObjectProps) {
  const { hoveredObject } = useInteraction()
  const [clicked, setClicked] = useState(false)
  const meshRef = useRef<THREE.Mesh | null>(null)
  const interactiveId = useRef(`interactive-${interactiveIdCounter++}`)
  
  // Check if this object is being hovered via raycast
  const isRaycastHovered = hoveredObject === interactiveId.current

  // Physics body
  const [physicsRef, api] = useBox(() => ({
    mass: 1,
    position,
    args: [0.8, 0.8, 0.8],
    material: {
      friction: 0.4,
      restitution: 0.3,
    },
  }))

  // Register this object as interactive and solid (for collision)
  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.userData.isInteractive = true
      meshRef.current.userData.isSolid = true // Mark as solid for collision detection
      meshRef.current.userData.interactiveId = interactiveId.current
      // Set interaction distance if specified
      if (interactionConfig.distance) {
        meshRef.current.userData.interactionDistance = interactionConfig.distance
      }
    }
    
    // Register with tooltip system
    registerInteractiveObject(interactiveId.current, {
      id: interactiveId.current,
      actionText: interactionConfig.actionText,
      actionKey: interactionConfig.actionKey || 'E',
    })
    
    return () => {
      unregisterInteractiveObject(interactiveId.current)
    }
  }, [interactionConfig])

  // Handle E key interaction
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.code === 'KeyE' && isRaycastHovered) {
        handleInteract()
      }
    }
    
    document.addEventListener('keydown', handleKeyPress)
    return () => {
      document.removeEventListener('keydown', handleKeyPress)
    }
  }, [isRaycastHovered])

  const handleInteract = () => {
    if (onInteract) {
      // Use custom handler if provided
      onInteract()
    } else {
      // Default behavior
      setClicked(!clicked)
      
      // Apply a small impulse when interacted with
      api.applyImpulse([0, 2, 0], [0, 0, 0])
      
      // Show message
      showMessage(`${name}: ${description}`)
      
      // Log interaction
      console.log(`Interacted with: ${name}`)
      console.log(`Description: ${description}`)
    }
  }

  // Hover effect - slight scale and glow (based on raycast hover)
  useFrame(() => {
    if (meshRef.current) {
      const targetScale = isRaycastHovered ? 1.1 : 1.0
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1)
    }
  })

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation()
    handleInteract()
  }

  return (
    <mesh
      ref={(mesh) => {
        // Set mesh ref for scaling
        meshRef.current = mesh
        // Set physics ref - use as ref object
        if (mesh && physicsRef && 'current' in physicsRef) {
          (physicsRef as React.MutableRefObject<THREE.Mesh | null>).current = mesh
        }
      }}
      onClick={handleClick}
      castShadow
      receiveShadow
    >
      {children}
      {/* Material with hover effect (based on raycast) */}
      <meshStandardMaterial
        color={color}
        emissive={isRaycastHovered ? color : '#000000'}
        emissiveIntensity={isRaycastHovered ? 0.3 : 0}
      />
    </mesh>
  )
}

