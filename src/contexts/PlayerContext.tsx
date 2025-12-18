import { createContext, useContext, useState, ReactNode } from 'react'
import { PlayerAttributes, InteractionDistance, INTERACTION_DISTANCES } from '../types/GameTypes'
import { BASE_MOVE_SPEED, BASE_JUMP_HEIGHT } from '../config/PlayerConfig'

interface PlayerContextType {
  attributes: PlayerAttributes
  setMoveSpeedMultiplier: (multiplier: number) => void
  setInteractionDistance: (distance: InteractionDistance) => void
  addItem: (itemId: string) => void
  removeItem: (itemId: string) => void
  hasItem: (itemId: string) => boolean
  getEffectiveMoveSpeed: () => number
  getEffectiveJumpHeight: () => number
  getEffectiveInteractionDistance: (objectDistance?: number | InteractionDistance) => number
}

const PlayerContext = createContext<PlayerContextType | null>(null)

const DEFAULT_ATTRIBUTES: PlayerAttributes = {
  baseMoveSpeed: BASE_MOVE_SPEED,
  moveSpeedMultiplier: 1,
  baseJumpHeight: BASE_JUMP_HEIGHT,
  jumpHeightMultiplier: 1,
  baseInteractionDistance: 'medium',
  interactionDistanceMultiplier: 1,
  items: [],
}

export function usePlayer() {
  const context = useContext(PlayerContext)
  if (!context) {
    throw new Error('usePlayer must be used within PlayerProvider')
  }
  return context
}

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [attributes, setAttributes] = useState<PlayerAttributes>(DEFAULT_ATTRIBUTES)

  const setMoveSpeedMultiplier = (multiplier: number) => {
    setAttributes(prev => ({ ...prev, moveSpeedMultiplier: multiplier }))
  }

  const setInteractionDistance = (distance: InteractionDistance) => {
    setAttributes(prev => ({ ...prev, baseInteractionDistance: distance }))
  }

  const addItem = (itemId: string) => {
    setAttributes(prev => ({
      ...prev,
      items: [...prev.items.filter(id => id !== itemId), itemId]
    }))
  }

  const removeItem = (itemId: string) => {
    setAttributes(prev => ({
      ...prev,
      items: prev.items.filter(id => id !== itemId),
    }))
  }

  const hasItem = (itemId: string) => {
    return attributes.items.includes(itemId)
  }

  const getEffectiveMoveSpeed = () => {
    return attributes.baseMoveSpeed * attributes.moveSpeedMultiplier
  }

  const getEffectiveInteractionDistance = (objectDistance?: number | InteractionDistance): number => {
    // If object has specific distance, use that
    if (typeof objectDistance === 'number') {
      return objectDistance * attributes.interactionDistanceMultiplier
    }
    
    // If object has preset distance, use that
    if (objectDistance && typeof objectDistance === 'string') {
      return INTERACTION_DISTANCES[objectDistance] * attributes.interactionDistanceMultiplier
    }
    
    // Otherwise use player's base distance
    const baseDistance = INTERACTION_DISTANCES[attributes.baseInteractionDistance]
    return baseDistance * attributes.interactionDistanceMultiplier
  }

  const getEffectiveJumpHeight = () => {
    return attributes.baseJumpHeight * attributes.jumpHeightMultiplier
  }

  return (
    <PlayerContext.Provider value={{
      attributes,
      setMoveSpeedMultiplier,
      setInteractionDistance,
      addItem,
      removeItem,
      hasItem,
      getEffectiveMoveSpeed,
      getEffectiveJumpHeight,
      getEffectiveInteractionDistance,
    }}>
      {children}
    </PlayerContext.Provider>
  )
}

