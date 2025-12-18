import { useRef, useEffect, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useInteraction } from '../../systems/InteractionSystem'
import { useScene, SpawnPoint } from '../../scenes/SceneManager'
import { useCamera } from '../../contexts/CameraContext'
import { usePlayer } from '../../contexts/PlayerContext'
import { registerInteractiveObject, unregisterInteractiveObject } from '../hud/InteractionTooltip'
import { showMessage } from '../hud/MessageDisplay'
import * as THREE from 'three'

interface DoorProps {
  position: [number, number, number]
  rotation?: [number, number, number]
  targetScene: 'room1' | 'room2' | 'room3'
  spawnPoint: SpawnPoint
  requiredKey?: string // Item ID required to unlock this door
  locked?: boolean // Whether door is locked
  variant?: 'default' | 'room3' // Visual style variant
}

// Generate unique ID for each door
let doorIdCounter = 0

export default function Door({ 
  position, 
  rotation = [0, 0, 0], 
  targetScene,
  spawnPoint,
  requiredKey,
  locked = false,
  variant = 'default',
}: DoorProps) {
  const { hoveredObject } = useInteraction()
  const { transitionToScene } = useScene()
  const { camera } = useThree()
  const { rotation: cameraRotation } = useCamera()
  const { attributes } = usePlayer()
  const doorRef = useRef<THREE.Group>(null)
  const doorId = useRef(`door-${doorIdCounter++}`)
  const isRaycastHovered = hoveredObject === doorId.current
  
  // Make isLocked reactive to inventory changes by accessing items array directly
  const isLocked = useMemo(() => {
    if (locked) return true
    if (requiredKey) {
      return !attributes.items.includes(requiredKey)
    }
    return false
  }, [locked, requiredKey, attributes.items])

  // Register door as interactive
  useEffect(() => {
    if (doorRef.current) {
      // Find the main door mesh and mark it as interactive
      doorRef.current.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.userData.isInteractive = true
          child.userData.interactiveId = doorId.current
          child.userData.interactionDistance = 'high'
        }
      })
      
    }
    
    return () => {
      unregisterInteractiveObject(doorId.current)
    }
  }, [])
  
  // Update tooltip when lock status changes
  useEffect(() => {
    const isRoom3Door = variant === 'room3'
    const actionText = isLocked
      ? isRoom3Door ? 'Sealed' : 'Locked'
      : 'Enter'
    registerInteractiveObject(doorId.current, {
      id: doorId.current,
      actionText,
      actionKey: 'E',
    })
  }, [isLocked])

  // Handle E key interaction
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.code === 'KeyE' && isRaycastHovered) {
        if (isLocked) {
          if (variant === 'room3') {
            showMessage('The door is sealed tight.')
          } else if (requiredKey) {
            showMessage('This door is locked.')
          } else {
            showMessage('This door is locked.')
          }
        } else {
          showMessage(`Entering ${targetScene}...`)
          // Preserve current rotation when transitioning
          const currentRot = cameraRotation.current || camera.quaternion.clone()
          transitionToScene(targetScene, spawnPoint, currentRot)
        }
      }
    }
    
    document.addEventListener('keydown', handleKeyPress)
    return () => {
      document.removeEventListener('keydown', handleKeyPress)
    }
  }, [isRaycastHovered, isLocked, requiredKey, targetScene, spawnPoint, transitionToScene, camera, cameraRotation])

  // Hover effect - slight scale
  useFrame(() => {
    if (doorRef.current) {
      const targetScale = isRaycastHovered ? 1.05 : 1.0
      doorRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1)
    }
  })

  const doorWidth = 2
  const doorHeight = 3
  const doorDepth = 0.1

  return (
    <group ref={doorRef} position={position} rotation={rotation}>
      {/* Door panel only - wall is handled separately */}
      <group position={[0, doorHeight / 2, 0.1]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[doorWidth, doorHeight, doorDepth]} />
          <meshStandardMaterial 
            color={
              variant === 'room3'
                ? (isLocked ? '#3B3B7A' : '#5B5BB0')
                : (isRaycastHovered ? '#6B8E5A' : '#5A4A3A')
            }
            emissive={
              variant === 'room3'
                ? (isLocked ? '#000022' : '#222266')
                : (isRaycastHovered ? '#4A6B3A' : '#000000')
            }
            emissiveIntensity={
              variant === 'room3'
                ? (isLocked ? 0.4 : 0.6)
                : (isRaycastHovered ? 0.2 : 0)
            }
          />
        </mesh>
        
        {variant === 'room3' ? (
          <>
            {/* Room 3 door: glowing glyph instead of a normal handle */}
            <mesh position={[doorWidth / 2 - 0.3, 0, doorDepth / 2 + 0.06]} castShadow>
              <torusGeometry args={[0.18, 0.04, 16, 32]} />
              <meshStandardMaterial color="#74C0FC" emissive="#74C0FC" emissiveIntensity={0.8} />
            </mesh>
            <mesh position={[doorWidth / 2 - 0.3, 0, -doorDepth / 2 - 0.06]} castShadow>
              <torusGeometry args={[0.18, 0.04, 16, 32]} />
              <meshStandardMaterial color="#74C0FC" emissive="#74C0FC" emissiveIntensity={0.4} />
            </mesh>
          </>
        ) : (
          <>
            {/* Door handle - front side */}
            <mesh position={[doorWidth / 2 - 0.2, -0.2, doorDepth / 2 + 0.05]} rotation={[0, 0, Math.PI / 2]} castShadow>
              <cylinderGeometry args={[0.02, 0.02, 0.15, 8]} />
              <meshStandardMaterial color="#C0C0C0" />
            </mesh>
            {/* Door handle - back side */}
            <mesh position={[doorWidth / 2 - 0.2, -0.2, -doorDepth / 2 - 0.05]} rotation={[0, 0, Math.PI / 2]} castShadow>
              <cylinderGeometry args={[0.02, 0.02, 0.15, 8]} />
              <meshStandardMaterial color="#C0C0C0" />
            </mesh>
          </>
        )}
      </group>
    </group>
  )
}

