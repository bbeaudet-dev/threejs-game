import { useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useInteraction } from '../../systems/InteractionSystem'
import { usePlayer } from '../../contexts/PlayerContext'
import { useCamera } from '../../contexts/CameraContext'
import { useRoom } from '../../contexts/RoomContext'
import { useScene } from '../../scenes/SceneManager'
import { ROOM3_PLANETS } from '../../config/Room3Config'
import {
  GROUND_LEVEL,
  getCeilingLevel,
  COLLISION_BUFFER,
} from '../../config/PlayerConfig'
import * as THREE from 'three'

const LOOK_SENSITIVITY = 0.002
const RAYCASTER_INTERVAL = 100 // How often to check for interactive objects (in milliseconds)
const PLANET_GRAVITY_SCALE = 3.5 // Multiplier for planetary gravity strength in Room 3

export default function Player() {
  const { camera, scene } = useThree()
  const { setHoveredObject } = useInteraction()
  const { getEffectiveMoveSpeed, getEffectiveInteractionDistance, getEffectiveJumpHeight } = usePlayer()
  const { setYaw, setHeight, rotation } = useCamera()
  const { roomHeight: roomHeightFromContext } = useRoom()
  const { currentScene } = useScene()
  
  const moveForward = useRef(false)
  const moveBackward = useRef(false)
  const moveLeft = useRef(false)
  const moveRight = useRef(false)
  const canJump = useRef(true)
  
  const velocity = useRef(new THREE.Vector3())
  const direction = useRef(new THREE.Vector3())
  const euler = useRef(new THREE.Euler(0, 0, 0, 'YXZ')) // Camera rotation (pitch, yaw, roll)
  const raycaster = useRef(new THREE.Raycaster()) // Used to detect collisions and interactions
  const lastRaycastTime = useRef(0) // Last time we checked for interactions
  const isGrounded = useRef(true)
  
  useEffect(() => {
    const handlePointerLock = () => {
      document.body.requestPointerLock()
    }
    document.addEventListener('click', handlePointerLock)
    
    const handleMouseMove = (event: MouseEvent) => {
      if (document.pointerLockElement === document.body) {
        euler.current.setFromQuaternion(camera.quaternion)
        euler.current.y -= event.movementX * LOOK_SENSITIVITY
        euler.current.x -= event.movementY * LOOK_SENSITIVITY
        euler.current.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, euler.current.x))
        euler.current.z = 0
        camera.quaternion.setFromEuler(euler.current)
        setYaw(euler.current.y)
      }
    }
    document.addEventListener('mousemove', handleMouseMove)
    
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.code) {
        case 'KeyW': moveForward.current = true; break
        case 'KeyS': moveBackward.current = true; break
        case 'KeyA': moveLeft.current = true; break
        case 'KeyD': moveRight.current = true; break
        case 'Space':
          if (isGrounded.current && canJump.current) {
            velocity.current.y = getEffectiveJumpHeight()
            isGrounded.current = false
            canJump.current = false
          }
          break
      }
    }
    
    const handleKeyUp = (event: KeyboardEvent) => {
      switch (event.code) {
        case 'KeyW': moveForward.current = false; break
        case 'KeyS': moveBackward.current = false; break
        case 'KeyA': moveLeft.current = false; break
        case 'KeyD': moveRight.current = false; break
        case 'Space': canJump.current = true; break
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    
    return () => {
      document.removeEventListener('click', handlePointerLock)
      document.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [camera, setYaw, getEffectiveJumpHeight]) 
  
  useFrame((_state, delta) => {
    euler.current.setFromQuaternion(camera.quaternion)
    setYaw(euler.current.y)
    setHeight(camera.position.y)
    rotation.current = camera.quaternion.clone()
    
    const baseGravity = currentScene === 'room3' ? -2.5 : -9.81
    const CEILING_LEVEL = getCeilingLevel(roomHeightFromContext)
    
    if (!isGrounded.current) {
      velocity.current.y += baseGravity * delta
    }

    // Additional per-planet gravity in Room 3
    if (currentScene === 'room3') {
      for (const planet of ROOM3_PLANETS) {
        const dir = planet.position.clone().sub(camera.position)
        const distSq = Math.max(dir.lengthSq(), 1)
        const strength = ((planet.mass || 1) * PLANET_GRAVITY_SCALE) / distSq
        dir.normalize().multiplyScalar(strength)
        velocity.current.add(dir.multiplyScalar(delta))
      }
    }
    
    // Check if grounded
    if (camera.position.y <= GROUND_LEVEL && velocity.current.y <= 0) {
      camera.position.y = GROUND_LEVEL
      velocity.current.y = 0
      isGrounded.current = true
    }
    
    // Check if hitting ceiling
    if (camera.position.y >= CEILING_LEVEL && velocity.current.y > 0) {
      camera.position.y = CEILING_LEVEL
      velocity.current.y = 0
    }
    
    // Horizontal movement damping
    velocity.current.x -= velocity.current.x * 10.0 * delta
    velocity.current.z -= velocity.current.z * 10.0 * delta
    
    direction.current.z = Number(moveForward.current) - Number(moveBackward.current)
    direction.current.x = Number(moveLeft.current) - Number(moveRight.current)
    direction.current.normalize()
    
    const moveSpeed = getEffectiveMoveSpeed()
    if (moveForward.current || moveBackward.current) {
      velocity.current.z -= direction.current.z * moveSpeed * delta
    }
    if (moveLeft.current || moveRight.current) {
      velocity.current.x -= direction.current.x * moveSpeed * delta
    }
    
    // Apply movement relative to camera direction
    const moveVector = new THREE.Vector3()
    moveVector.set(velocity.current.x, velocity.current.y * delta, velocity.current.z)
    moveVector.applyQuaternion(camera.quaternion)
    
    // Simple collision detection: single raycast in movement direction
    const moveDistance = moveVector.length()
    if (moveDistance > 0) {
      const moveDirection = moveVector.clone().normalize()
      
      // Cast a ray from camera position in the movement direction
      raycaster.current.set(camera.position, moveDirection)
      const intersects = raycaster.current.intersectObjects(scene.children, true)
      
      // Find the closest solid object in our path
      let blockingDistance = moveDistance + COLLISION_BUFFER // Default to allowing full movement
      
      for (const intersect of intersects) {
        const obj = intersect.object
        if (obj instanceof THREE.Mesh) {
          const isSolid = (
            obj.userData.isWall || 
            obj.userData.isSolid || 
            obj.userData.isCollidable ||
            (obj.parent && (
              obj.parent.userData?.isWall || 
              obj.parent.userData?.isSolid || 
              obj.parent.userData?.isCollidable
            ))
          )
          
          if (isSolid && intersect.distance < blockingDistance) {
            blockingDistance = intersect.distance - COLLISION_BUFFER
            break
          }
        }
      }
      
      // Apply movement with collision buffer
      if (blockingDistance > 0) {
        const actualMove = moveDirection.clone().multiplyScalar(Math.min(blockingDistance, moveDistance))
        camera.position.add(actualMove)
      }
    } else {
      camera.position.y += velocity.current.y * delta
    }
    
    // Ensure player doesn't go below ground
    if (camera.position.y < GROUND_LEVEL) {
      camera.position.y = GROUND_LEVEL
      velocity.current.y = 0
      isGrounded.current = true
    }
    
    // Ensure player doesn't go above ceiling 
    if (camera.position.y > CEILING_LEVEL) {
      camera.position.y = CEILING_LEVEL
      velocity.current.y = 0
    }
    
    // Raycast for interactions (throttled)
    const now = Date.now()
    if (now - lastRaycastTime.current > RAYCASTER_INTERVAL) {
      lastRaycastTime.current = now
      
      // Cast ray from camera forward
      raycaster.current.setFromCamera(new THREE.Vector2(0, 0), camera)
      const intersects = raycaster.current.intersectObjects(scene.children, true)
      
      // Find first interactive object within range
      let foundInteractive = false
      for (const intersect of intersects) {
        const distance = intersect.distance
        const object = intersect.object
        
        // Get interaction distance for this object (if specified) or use default
        const objectDistance = object.userData.interactionDistance
        const maxDistance = getEffectiveInteractionDistance(objectDistance)
        
        if (distance > maxDistance) break
        
        // Check if object has interactive data
        if (object.userData.isInteractive && object.userData.interactiveId) {
          setHoveredObject(object.userData.interactiveId)
          foundInteractive = true
          break
        }
      }
      
      if (!foundInteractive) {
        setHoveredObject(null)
      }
    }
  })
  
  return null
}
