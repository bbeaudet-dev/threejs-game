import { createContext, useContext, ReactNode } from 'react'

export interface SceneDimensions {
  sceneWidth: number  // X dimension
  sceneHeight: number // Y dimension 
  sceneLength: number // Z dimension
}

const SceneContext = createContext<SceneDimensions | null>(null)

export function useScene(): SceneDimensions {
  const context = useContext(SceneContext)
  if (!context) {
    throw new Error('useScene must be used within SceneProvider')
  }
  return context
}

export function SceneProvider({ 
  children, 
  properties 
}: { 
  children: ReactNode
  properties: SceneDimensions 
}) {
  return (
    <SceneContext.Provider value={properties}>
      {children}
    </SceneContext.Provider>
  )
}

