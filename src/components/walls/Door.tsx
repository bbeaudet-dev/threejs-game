import { useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useInteraction } from '../../systems/InteractionSystem'
import { useScene, SpawnPoint } from '../../scenes/SceneManager'
import { useCamera } from '../../contexts/CameraContext'
import { registerInteractiveObject, unregisterInteractiveObject } from '../hud/InteractionTooltip'
import { showMessage } from '../hud/MessageDisplay'
import * as THREE from 'three'

interface DoorProps {
  position: [number, number, number]
  rotation?: [number, number, number]
  targetScene: 'room1' | 'room2' | 'room3'
  spawnPoint: SpawnPoint
}

// Generate unique ID for each door
let doorIdCounter = 0

export default function Door({ 
  position, 
  rotation = [0, 0, 0], 
  targetScene,
  spawnPoint,
}: DoorProps) {
  const { hoveredObject } = useInteraction()
  const { transitionToScene } = useScene()
  const { camera } = useThree()
  const { rotation: cameraRotation } = useCamera()
  const doorRef = useRef<THREE.Group>(null)
  const doorId = useRef(`door-${doorIdCounter++}`)
  const isRaycastHovered = hoveredObject === doorId.current

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
      
      // Register with tooltip system
      registerInteractiveObject(doorId.current, {
        id: doorId.current,
        actionText: 'Enter',
        actionKey: 'E',
      })
    }
    
    return () => {
      unregisterInteractiveObject(doorId.current)
    }
  }, [])

  // Handle E key interaction
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.code === 'KeyE' && isRaycastHovered) {
        showMessage(`Entering ${targetScene}...`)
        // Preserve current rotation when transitioning
        const currentRot = cameraRotation.current || camera.quaternion.clone()
        transitionToScene(targetScene, spawnPoint, currentRot)
      }
    }
    
    document.addEventListener('keydown', handleKeyPress)
    return () => {
      document.removeEventListener('keydown', handleKeyPress)
    }
  }, [isRaycastHovered, targetScene, spawnPoint, transitionToScene, camera, cameraRotation])

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
            color={isRaycastHovered ? "#6B8E5A" : "#5A4A3A"}
            emissive={isRaycastHovered ? "#4A6B3A" : "#000000"}
            emissiveIntensity={isRaycastHovered ? 0.2 : 0}
          />
        </mesh>
        
        {/* Door handle */}
        <mesh position={[doorWidth / 2 - 0.2, 0, doorDepth / 2 + 0.05]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 0.1, 8]} />
          <meshStandardMaterial color="#C0C0C0" />
        </mesh>
        
        {/* Door handle */}
        <mesh position={[doorWidth / 2 - 0.2, 0, -doorDepth / 2 - 0.05]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 0.1, 8]} />
          <meshStandardMaterial color="#C0C0C0" />
        </mesh>
      </group>
    </group>
  )
}

