/**
 * Player dimensions and collision configuration
 * All values in meters
 */

// Eye level (camera position) - where the player "sees" from
export const PLAYER_EYE_HEIGHT = 1.6

// Player physical dimensions
export const PLAYER_HEIGHT = 1.8 // Total height from feet to top of head
export const PLAYER_WIDTH = 0.5 // Width (shoulder to shoulder)
export const PLAYER_DEPTH = 0.3 // Depth (chest to back)

// Collision buffer - extra space around player to prevent clipping
export const COLLISION_BUFFER = 0.15 // Buffer on all sides

// Calculated values
export const PLAYER_HALF_HEIGHT = PLAYER_HEIGHT / 2
export const PLAYER_HALF_WIDTH = PLAYER_WIDTH / 2 + COLLISION_BUFFER
export const PLAYER_HALF_DEPTH = PLAYER_DEPTH / 2 + COLLISION_BUFFER

// Ground and ceiling levels based on player dimensions
// Ground is at eye level minus the distance from eyes to feet
export const GROUND_LEVEL = PLAYER_EYE_HEIGHT - (PLAYER_HEIGHT - PLAYER_EYE_HEIGHT)
// Ceiling level accounts for player height above eyes
export const getCeilingLevel = (roomHeight: number) => {
  // Ceiling should be room height minus player's height above eyes, minus buffer
  const playerTopOffset = PLAYER_HEIGHT - PLAYER_EYE_HEIGHT
  return roomHeight - playerTopOffset - COLLISION_BUFFER
}

// Player movement constants (starting/base values)
export const BASE_MOVE_SPEED = 1.25
export const BASE_JUMP_HEIGHT = 5.0

