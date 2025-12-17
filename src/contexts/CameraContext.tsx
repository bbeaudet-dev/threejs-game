import { createContext, useContext, useState, useRef, ReactNode } from 'react'
import * as THREE from 'three'

interface CameraContextType {
  yaw: number // Horizontal rotation in radians
  setYaw: (yaw: number) => void
  height: number // Vertical position (y coordinate)
  setHeight: (height: number) => void
  rotation: React.MutableRefObject<THREE.Quaternion | null> // Full rotation quaternion
}

const CameraContext = createContext<CameraContextType | null>(null)

export function useCamera() {
  const context = useContext(CameraContext)
  if (!context) {
    throw new Error('useCamera must be used within CameraProvider')
  }
  return context
}

import { PLAYER_EYE_HEIGHT } from '../config/PlayerConfig'

export function CameraProvider({ children }: { children: ReactNode }) {
  const [yaw, setYaw] = useState(0)
  const [height, setHeight] = useState(PLAYER_EYE_HEIGHT)
  const rotation = useRef<THREE.Quaternion | null>(null)

  return (
    <CameraContext.Provider value={{ yaw, setYaw, height, setHeight, rotation }}>
      {children}
    </CameraContext.Provider>
  )
}

