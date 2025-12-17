import { useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

const MOVE_SPEED = 5
const LOOK_SENSITIVITY = 0.002

export default function Player() {
  const { camera } = useThree()
  const moveForward = useRef(false)
  const moveBackward = useRef(false)
  const moveLeft = useRef(false)
  const moveRight = useRef(false)
  
  const velocity = useRef(new THREE.Vector3())
  const direction = useRef(new THREE.Vector3())
  const euler = useRef(new THREE.Euler(0, 0, 0, 'YXZ'))
  
  // Lock pointer on mount
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
        camera.quaternion.setFromEuler(euler.current)
      }
    }
    
    document.addEventListener('mousemove', handleMouseMove)
    
    // Keyboard controls
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.code) {
        case 'KeyW':
          moveForward.current = true
          break
        case 'KeyS':
          moveBackward.current = true
          break
        case 'KeyA':
          moveLeft.current = true
          break
        case 'KeyD':
          moveRight.current = true
          break
      }
    }
    
    const handleKeyUp = (event: KeyboardEvent) => {
      switch (event.code) {
        case 'KeyW':
          moveForward.current = false
          break
        case 'KeyS':
          moveBackward.current = false
          break
        case 'KeyA':
          moveLeft.current = false
          break
        case 'KeyD':
          moveRight.current = false
          break
      }
    }
    
    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('keyup', handleKeyUp)
    
    return () => {
      document.removeEventListener('click', handlePointerLock)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('keyup', handleKeyUp)
    }
  }, [camera])
  
  // Movement update loop
  useFrame((_state, delta) => {
    velocity.current.x -= velocity.current.x * 10.0 * delta
    velocity.current.z -= velocity.current.z * 10.0 * delta
    
    direction.current.z = Number(moveForward.current) - Number(moveBackward.current)
    direction.current.x = Number(moveRight.current) - Number(moveLeft.current)
    direction.current.normalize()
    
    if (moveForward.current || moveBackward.current) {
      velocity.current.z -= direction.current.z * MOVE_SPEED * delta
    }
    if (moveLeft.current || moveRight.current) {
      velocity.current.x -= direction.current.x * MOVE_SPEED * delta
    }
    
    // Apply movement relative to camera direction
    const moveVector = new THREE.Vector3()
    moveVector.set(velocity.current.x, 0, velocity.current.z)
    moveVector.applyQuaternion(camera.quaternion)
    
    camera.position.add(moveVector)
    
    // Keep player at eye level
    camera.position.y = 1.6
    
    // Simple boundary check (keep player in room)
    const ROOM_BOUNDARY = 4.5
    camera.position.x = Math.max(-ROOM_BOUNDARY, Math.min(ROOM_BOUNDARY, camera.position.x))
    camera.position.z = Math.max(-ROOM_BOUNDARY, Math.min(ROOM_BOUNDARY, camera.position.z))
  })
  
  return null
}

