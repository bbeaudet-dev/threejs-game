import { useRef, useEffect, useMemo, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { useInteraction } from '../../systems/InteractionSystem'
import { usePlayer } from '../../contexts/PlayerContext'
import { registerInteractiveObject, unregisterInteractiveObject } from '../hud/InteractionTooltip'
import { showMessage } from '../hud/MessageDisplay'
import * as THREE from 'three'

interface DoorProps {
  position: [number, number, number]
  rotation?: [number, number, number]
  onPortalInteract?: () => void 
  isOpen?: boolean 
  onToggle?: (isOpen: boolean) => void 
  // Common props
  requiredKey?: string // Item ID required to unlock this door
  locked?: boolean // Whether door is locked
  variant?: 'default' | 'solar-system' | 'metal' 
  hingeSide?: 'left' | 'right'
  tooltipText?: string 
  lockedMessage?: string 
}

// Generate unique ID for each door
let doorIdCounter = 0

export default function Door({ 
  position, 
  rotation = [0, 0, 0], 
  onPortalInteract,
  isOpen: initialIsOpen = false,
  onToggle,
  requiredKey,
  locked = false,
  variant = 'default',
  hingeSide = 'right',
  tooltipText,
  lockedMessage,
}: DoorProps) {
  const { hoveredObject } = useInteraction()
  const { attributes } = usePlayer()
  const doorRef = useRef<THREE.Group>(null)
  const doorPanelRef = useRef<THREE.Group>(null)
  const doorId = useRef(`door-${doorIdCounter++}`)
  const isRaycastHovered = hoveredObject === doorId.current
  const isPortal = onPortalInteract !== undefined
  const [isOpen, setIsOpen] = useState(initialIsOpen)
  const [targetOpenRotation, setTargetOpenRotation] = useState(initialIsOpen ? Math.PI / 2 : 0)
  
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
  
  // Update tooltip based on door state
  useEffect(() => {
    let actionText: string
    
    if (isLocked) {
      actionText = tooltipText || 'Locked'
    } else {
      actionText = isOpen ? 'Close' : 'Open'
    }
    
    registerInteractiveObject(doorId.current, {
      id: doorId.current,
      actionText,
      actionKey: 'E',
    })
  }, [isLocked, isOpen, tooltipText])

  // Handle E key interaction
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.code === 'KeyE' && isRaycastHovered) {
        if (isLocked) {
          showMessage(lockedMessage || 'This door is locked.')
        } else {
          const newIsOpen = !isOpen
          setIsOpen(newIsOpen)
          setTargetOpenRotation(newIsOpen ? Math.PI / 2 : 0)
          if (onToggle) {
            onToggle(newIsOpen)
          }
          
          if (isPortal && newIsOpen && onPortalInteract) {
            onPortalInteract()
          } else if (!isPortal) {
            showMessage(newIsOpen ? 'Door opened.' : 'Door closed.')
          }
        }
      }
    }
    
    document.addEventListener('keydown', handleKeyPress)
    return () => {
      document.removeEventListener('keydown', handleKeyPress)
    }
  }, [isRaycastHovered, isLocked, lockedMessage, onPortalInteract, isPortal, isOpen, onToggle])

  useFrame(() => {
    if (doorPanelRef.current) {
      const currentRotation = doorPanelRef.current.rotation.y
      const direction = hingeSide === 'right' ? 1 : -1
      const target = targetOpenRotation * direction
      doorPanelRef.current.rotation.y = THREE.MathUtils.lerp(currentRotation, target, 0.1)
    }
    
    if (doorRef.current) {
      const targetScale = isRaycastHovered ? 1.05 : 1.0
      doorRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1)
    }
  })

  const doorWidth = 2
  const doorHeight = 3
  const doorDepth = 0.1

  // Get material properties based on variant
  const getMaterialProps = () => {
    switch (variant) {
      case 'solar-system':
        return {
          color: isLocked ? '#3B3B7A' : '#5B5BB0',
          emissive: isLocked ? '#000022' : '#222266',
          emissiveIntensity: isLocked ? 0.4 : 0.6,
        }
      case 'metal':
        return {
          color: '#444444',
          emissive: '#000000',
          emissiveIntensity: 0,
          metalness: 0.8,
          roughness: 0.5,
        }
      default:
        return {
          color: isRaycastHovered ? '#6B8E5A' : '#5A4A3A',
          emissive: isRaycastHovered ? '#4A6B3A' : '#000000',
          emissiveIntensity: isRaycastHovered ? 0.2 : 0,
        }
    }
  }

  const materialProps = getMaterialProps()

  return (
    <group ref={doorRef} position={position} rotation={rotation}>
      <group 
        ref={doorPanelRef}
        position={[
          hingeSide === 'right' ? 0 : doorWidth,
          doorHeight / 2,
          0.05
        ]}
      >
        <mesh 
          castShadow 
          receiveShadow
          position={[hingeSide === 'right' ? doorWidth / 2 : -doorWidth / 2, 0, 0]}>
          <boxGeometry args={[doorWidth, doorHeight, doorDepth]} />
          <meshStandardMaterial {...materialProps} />
        </mesh>
        
        {variant === 'solar-system' ? (
          <>
            <mesh position={[hingeSide === 'right' ? doorWidth - 0.3 : 0.3, 0, doorDepth / 2 + 0.06]} castShadow>
              <torusGeometry args={[0.18, 0.04, 16, 32]} />
              <meshStandardMaterial color="#74C0FC" emissive="#74C0FC" emissiveIntensity={0.8} />
            </mesh>
            <mesh position={[hingeSide === 'right' ? doorWidth - 0.3 : 0.3, 0, -doorDepth / 2 - 0.06]} castShadow>
              <torusGeometry args={[0.18, 0.04, 16, 32]} />
              <meshStandardMaterial color="#74C0FC" emissive="#74C0FC" emissiveIntensity={0.4} />
            </mesh>
          </>
        ) : variant === 'metal' ? (
          <>
            <mesh position={[hingeSide === 'right' ? doorWidth / 2 : -doorWidth / 2, 0.5, doorDepth / 2 + 0.06]} castShadow receiveShadow>
              <boxGeometry args={[1.8, 0.15, 0.05]} />
              <meshStandardMaterial color="#222222" metalness={0.7} roughness={0.4} />
            </mesh>
            <mesh position={[hingeSide === 'right' ? doorWidth / 2 : -doorWidth / 2, -0.5, doorDepth / 2 + 0.06]} castShadow receiveShadow>
              <boxGeometry args={[1.8, 0.15, 0.05]} />
              <meshStandardMaterial color="#222222" metalness={0.7} roughness={0.4} />
            </mesh>
          </>
        ) : (
          <>
            <mesh position={[hingeSide === 'right' ? doorWidth - 0.2 : 0.2, -0.2, doorDepth / 2 + 0.05]} rotation={[0, 0, Math.PI / 2]} castShadow>
              <cylinderGeometry args={[0.02, 0.02, 0.15, 8]} />
              <meshStandardMaterial color="#C0C0C0" />
            </mesh>
            <mesh position={[hingeSide === 'right' ? doorWidth - 0.2 : 0.2, -0.2, -doorDepth / 2 - 0.05]} rotation={[0, 0, Math.PI / 2]} castShadow>
              <cylinderGeometry args={[0.02, 0.02, 0.15, 8]} />
              <meshStandardMaterial color="#C0C0C0" />
            </mesh>
          </>
        )}
      </group>
    </group>
  )
}
