// Game attribute types
export type InteractionDistance = 'low' | 'medium' | 'high'

export interface InteractionDistanceConfig {
  low: number
  medium: number
  high: number
}

export const INTERACTION_DISTANCES: InteractionDistanceConfig = {
  low: 3,
  medium: 5,
  high: 8,
}

// Player attributes
export interface PlayerAttributes {
  baseMoveSpeed: number
  moveSpeedMultiplier: number
  baseJumpHeight: number
  jumpHeightMultiplier: number
  baseInteractionDistance: InteractionDistance
  interactionDistanceMultiplier: number
  items: string[]
}

// Object interaction config
export interface InteractionConfig {
  distance?: number | InteractionDistance // Can be specific number or preset
  actionText: string // e.g., "Enter", "Lift", "Examine"
  actionKey?: string // Default "E"
}

// Base interactive object data
export interface InteractiveObjectData {
  id: string
  name: string
  description: string
  interactionConfig: InteractionConfig
}

