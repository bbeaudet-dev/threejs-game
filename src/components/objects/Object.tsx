import { useRef, useEffect, useCallback, ReactNode } from 'react'
import { useFrame, ThreeEvent } from '@react-three/fiber'
import { useBox } from '@react-three/cannon'
import { useInteraction } from '../../systems/InteractionSystem'
import { registerInteractiveObject, unregisterInteractiveObject } from '../hud/InteractionTooltip'
import { showMessage } from '../hud/MessageDisplay'
import { InteractionConfig } from '../../types/GameTypes'
import * as THREE from 'three'

interface ObjectProps {
  position?: [number, number, number]
  rotation?: [number, number, number]
  scale?: number | [number, number, number]
  children: ReactNode
  
  isSolid?: boolean
  interactive?: boolean
  interactionConfig?: InteractionConfig
  onInteract?: () => void
  name?: string
  description?: string
  color?: string
  
  physics?: boolean
  physicsArgs?: [number, number, number]
  mass?: number
  
  castShadow?: boolean
  receiveShadow?: boolean
}

// Generate unique ID for each interactive object
let interactiveIdCounter = 0

export default function Object({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  children,
  isSolid = true,
  interactive = false,
  interactionConfig,
  onInteract,
  name,
  description,
  color,
  physics = false,
  physicsArgs = [1, 1, 1],
  mass = 1,
  castShadow = true,
  receiveShadow = false,
}: ObjectProps) {
  void castShadow
  void receiveShadow
  
  const { hoveredObject } = useInteraction()
  const groupRef = useRef<THREE.Group>(null)
  const interactiveId = useRef(`object-${interactiveIdCounter++}`)
  const isRaycastHovered = interactive && hoveredObject === interactiveId.current

  const [physicsRef, api] = useBox(() => ({
    mass: physics ? mass : 0,
    position: [0, 0, 0],
    args: physicsArgs,
    material: {
      friction: 0.4,
      restitution: 0.3,
    },
  }))
  
  useEffect(() => {
    if (physics && api) {
      api.position.set(...position)
    }
  }, [physics, api, position])
  
  useEffect(() => {
    if (physics && api && groupRef.current) {
      const unsubscribePosition = api.position.subscribe(([x, y, z]) => {
        if (groupRef.current) {
          groupRef.current.position.set(x, y, z)
        }
      })
      
      const unsubscribeRotation = api.quaternion.subscribe(([x, y, z, w]) => {
        if (groupRef.current) {
          groupRef.current.quaternion.set(x, y, z, w)
        }
      })
      
      return () => {
        unsubscribePosition()
        unsubscribeRotation()
      }
    }
  }, [physics, api])

  useEffect(() => {
    if (groupRef.current) {
      if (isSolid) {
        groupRef.current.userData.isSolid = true
      }
      
      groupRef.current.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          if (child.visible === false) {
            return
          }
          if (isSolid) {
            child.userData.isSolid = true
          }
          if (interactive) {
            child.userData.isInteractive = true
            child.userData.interactiveId = interactiveId.current
            if (interactionConfig?.distance) {
              child.userData.interactionDistance = interactionConfig.distance
            }
          }
        }
      })
    }
    
    if (interactive && interactionConfig) {
      registerInteractiveObject(interactiveId.current, {
        id: interactiveId.current,
        actionText: interactionConfig.actionText,
        actionKey: interactionConfig.actionKey || 'E',
      })
      
      return () => {
        unregisterInteractiveObject(interactiveId.current)
      }
    }
  }, [isSolid, interactive, interactionConfig])

  const handleInteract = useCallback(() => {
    if (onInteract) {
      onInteract()
    } else if (name && description) {
      showMessage(`${name}: ${description}`)
    }
    
    if (physics && api) {
      api.applyImpulse([0, 2, 0], [0, 0, 0])
    }
  }, [onInteract, name, description, physics, api])

  useEffect(() => {
    if (!interactive) return
    
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.code === 'KeyE' && isRaycastHovered) {
        handleInteract()
      }
    }
    
    window.addEventListener('keydown', handleKeyPress)
    return () => {
      window.removeEventListener('keydown', handleKeyPress)
    }
  }, [interactive, isRaycastHovered, handleInteract])

  useFrame(() => {
    if (interactive && groupRef.current) {
      const targetScale = isRaycastHovered ? 1.1 : 1.0
      const baseScale = typeof scale === 'number' ? [scale, scale, scale] : scale
      const targetScaleVec = new THREE.Vector3(
        targetScale * baseScale[0],
        targetScale * baseScale[1],
        targetScale * baseScale[2]
      )
      groupRef.current.scale.lerp(targetScaleVec, 0.1)
      
      if (color) {
        groupRef.current.traverse((child) => {
          if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
            child.material.emissive.set(isRaycastHovered ? color : '#000000')
            child.material.emissiveIntensity = isRaycastHovered ? 0.3 : 0
          }
        })
      }
    }
  })

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    if (interactive) {
      e.stopPropagation()
      handleInteract()
    }
  }

  // Convert scale to Vector3
  const scaleVec = typeof scale === 'number' 
    ? [scale, scale, scale] 
    : scale

  return (
    <group
      ref={groupRef}
      position={position}
      rotation={rotation}
      scale={scaleVec as [number, number, number]}
      onClick={handleClick}
    >
      {children}
      {physics && (
        <mesh
          ref={physicsRef as any}
          visible={false}
        >
          <boxGeometry args={physicsArgs} />
        </mesh>
      )}
    </group>
  )
}
