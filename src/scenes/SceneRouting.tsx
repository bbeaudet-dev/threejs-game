import { createContext, useContext, useState, ReactNode } from 'react'
import * as THREE from 'three'
import { PLAYER_EYE_HEIGHT } from '../config/PlayerConfig'

type SceneId = 'room1' | 'room2' | 'room3'

export interface SpawnPoint {
  position: [number, number, number]
  rotation?: [number, number, number]
}

interface SceneRoutingContextType {
  currentScene: SceneId
  setCurrentScene: (scene: SceneId) => void
  transitionToScene: (scene: SceneId, spawnPoint?: SpawnPoint, currentRotation?: THREE.Quaternion) => void
  pendingSpawn: SpawnPoint | null
  clearPendingSpawn: () => void
  preservedRotation: THREE.Quaternion | null
  setPreservedRotation: (rotation: THREE.Quaternion | null) => void
}

const SceneRoutingContext = createContext<SceneRoutingContextType | null>(null)

// Default spawn points for each scene
const DEFAULT_SPAWN_POINTS: Record<SceneId, SpawnPoint> = {
  room1: { position: [0, PLAYER_EYE_HEIGHT, 0], rotation: [0, 0, 0] },
  room2: { position: [0, PLAYER_EYE_HEIGHT, 0], rotation: [0, 0, 0] },
  room3: { position: [0, PLAYER_EYE_HEIGHT, 0], rotation: [0, 0, 0] },
}

export function useSceneRouting() {
  const context = useContext(SceneRoutingContext)
  if (!context) {
    throw new Error('useSceneRouting must be used within SceneRoutingProvider')
  }
  return context
}

export function SceneRoutingProvider({ children }: { children: ReactNode }) {
  const [currentScene, setCurrentScene] = useState<SceneId>('room1')
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [pendingSpawn, setPendingSpawn] = useState<SpawnPoint | null>(DEFAULT_SPAWN_POINTS['room1'])
  const [preservedRotation, setPreservedRotation] = useState<THREE.Quaternion | null>(null)

  const clearPendingSpawn = () => {
    setPendingSpawn(null)
  }

  const transitionToScene = (scene: SceneId, spawnPoint?: SpawnPoint, currentRotation?: THREE.Quaternion) => {
    if (isTransitioning || scene === currentScene) return
    
    // Preserve rotation if provided
    if (currentRotation) {
      setPreservedRotation(currentRotation.clone())
    }
    
    setIsTransitioning(true)
    
    // Simple fade transition
    setTimeout(() => {
      setCurrentScene(scene)
      if (spawnPoint) {
        setPendingSpawn(spawnPoint)
      } else {
        // Use default spawn point for scene
        setPendingSpawn(DEFAULT_SPAWN_POINTS[scene])
      }
      setIsTransitioning(false)
    }, 300) // 300ms transition
  }

  return (
    <SceneRoutingContext.Provider value={{ 
      currentScene, 
      setCurrentScene, 
      transitionToScene,
      pendingSpawn,
      clearPendingSpawn,
      preservedRotation,
      setPreservedRotation
    }}>
      <div style={{ 
        opacity: isTransitioning ? 0.5 : 1,
        transition: 'opacity 0.3s ease-in-out',
        width: '100%',
        height: '100%'
      }}>
        {children}
      </div>
    </SceneRoutingContext.Provider>
  )
}

