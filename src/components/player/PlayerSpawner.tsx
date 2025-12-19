import { useEffect } from 'react'
import { useThree } from '@react-three/fiber'
import { useSceneRouting } from '../../scenes/SceneRouting'
import { useCamera } from '../../contexts/CameraContext'
import * as THREE from 'three'

export default function PlayerSpawner() {
  const { camera } = useThree()
  const { pendingSpawn, clearPendingSpawn, preservedRotation } = useSceneRouting()
  const { setYaw, rotation } = useCamera()

  useEffect(() => {
    if (camera && pendingSpawn) {
      camera.position.set(...pendingSpawn.position)
      
      // Use preserved rotation if available, otherwise use spawn rotation
      if (preservedRotation) {
        // Use preserved full rotation
        camera.quaternion.copy(preservedRotation)
        // Update the rotation ref
        rotation.current = preservedRotation.clone()
        // Extract yaw for compass
        const euler = new THREE.Euler().setFromQuaternion(preservedRotation, 'YXZ')
        setYaw(euler.y)
      } else if (pendingSpawn.rotation) {
        // Use spawn point rotation
        const yaw = pendingSpawn.rotation[0] || 0
        const pitch = pendingSpawn.rotation[1] || 0
        const roll = pendingSpawn.rotation[2] || 0
        const euler = new THREE.Euler(pitch, yaw, roll, 'YXZ')
        camera.quaternion.setFromEuler(euler)
        rotation.current = camera.quaternion.clone()
        setYaw(yaw)
      } else {
        // Default: look forward
        const euler = new THREE.Euler(0, 0, 0, 'YXZ')
        camera.quaternion.setFromEuler(euler)
        rotation.current = camera.quaternion.clone()
        setYaw(0)
      }
      
      clearPendingSpawn()
    }
  }, [camera, pendingSpawn, clearPendingSpawn, setYaw, preservedRotation, rotation])

  return null
}

