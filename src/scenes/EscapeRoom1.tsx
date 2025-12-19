import { useEffect, useState } from 'react'
import { useThree } from '@react-three/fiber'
import Scene from '../components/Scene'
import Wall from '../components/room/Wall'
import { Table, Bookshelf, PhysicsBox, BreakerBox } from '../components/objects'
import Fuse from '../components/items/Fuse'
import EmergencyLight from '../components/objects/EmergencyLight'
import { useWoodTexture, useCeilingTexture, useCobblestoneTexture } from '../utils/textures'
import { useScene } from '../contexts/SceneContext'
import { PLAYER_EYE_HEIGHT } from '../config/PlayerConfig'

function SpawnAtCorner({
  camera,
  roomWidth,
  roomLength,
}: {
  camera: THREE.Camera
  roomWidth: number
  roomLength: number
}) {
  useEffect(() => {
    const halfL = roomLength / 2
    camera.position.set(7, PLAYER_EYE_HEIGHT, halfL - 2)
  }, [camera, roomWidth, roomLength])

  return null
}

function EscapeRoom1Content({
  powerOn,
  setPowerOn,
  wallColor,
}: {
  powerOn: boolean
  setPowerOn: (on: boolean) => void
  wallColor: string
}) {
  const { sceneWidth: roomWidth, sceneLength: roomLength, sceneHeight: roomHeight } = useScene()
  const { camera } = useThree()

  const halfW = roomWidth / 2
  const halfL = roomLength / 2

  return (
    <>
      <SpawnAtCorner camera={camera} roomWidth={roomWidth} roomLength={roomLength} />
      <Wall
        position={[0, 0, -halfL]}
        wallHeight={roomHeight}
        wallLength={roomWidth}
        textureColor={wallColor}
      />
      <Wall
        position={[0, 0, halfL]}
        wallHeight={roomHeight}
        wallLength={roomWidth}
        textureColor={wallColor}
      />
      <Wall
        position={[-halfW, 0, 0]}
        rotation={[0, Math.PI / 2, 0]}
        wallHeight={roomHeight}
        wallLength={roomLength}
        textureColor={wallColor}
      />
      <Wall
        position={[halfW, 0, 0]}
        rotation={[0, Math.PI / 2, 0]}
        wallHeight={roomHeight}
        wallLength={roomLength}
        textureColor={wallColor}
      />

      <Wall
        position={[0, 0, 0]}
        rotation={[0, Math.PI / 2, 0]}
        wallHeight={roomHeight}
        wallLength={roomLength}
        textureColor={wallColor}
        openings={[{ type: 'door', position: 0, width: 1.2, height: 1.3 }]}
      />

      <EmergencyLight
        position={[halfW / 2, roomHeight - 0.8, 0]}
        color={powerOn ? '#FFFFFF' : '#FF5555'}
      />

      {powerOn && (
        <>
          <pointLight
            position={[-halfW / 2, roomHeight - 0.5, 0]}
            intensity={10}
            distance={20}
            color="#FFFFFF"
          />
          <pointLight
            position={[halfW / 2, roomHeight - 0.5, 0]}
            intensity={10}
            distance={20}
            color="#FFFFFF"
          />
          <ambientLight intensity={0.75} />
        </>
      )}

      <Table position={[7, 0, 0]} variant="metal" />

      <group position={[10.5, 0, -halfL + 0.5]}>
        <group position={[-1, 0, 0]}>
          <Bookshelf position={[0, 0, 0]} variant="metal" />
        </group>
      </group>

      <group position={[7.7, 0, -halfL + 0.5]}>
        <Bookshelf position={[0, 0, 0]} variant="metal" />
      </group>

      <group position={[5.9, 0, -halfL + 0.5]}>
        <Bookshelf position={[0, 0, 0]} variant="metal" />
      </group>

      {/* Physics boxes tucked close to the right wall */}
      <PhysicsBox position={[halfW - 2, 1, 3.3]} color="#555577" />
      <PhysicsBox position={[halfW - 1, 1, 3.8]} color="#777799" />
      <PhysicsBox position={[halfW - 2.5, 1, 4.4]} color="#9999BB" />

      <Fuse
        position={[7.6, 0.75, -0.4]}
        rotation={[0, 0, Math.PI / 2]}
        itemId="fuse-red"
        color="#FF6B6B"
        name="Red Fuse"
      />

      <Fuse
        position={[9.5, 1.15, -halfL + 0.6]}
        itemId="fuse-green"
        color="#4ECDC4"
        name="Green Fuse"
      />

      <Fuse
        position={[halfW - 1.6, 0.3, 4.5]}
        itemId="fuse-blue"
        color="#3498DB"
        name="Blue Fuse"
      />

      <BreakerBox
        position={[halfW - 0.5, 0, -0.5]}
        rotation={[0, -Math.PI / 2, 0]}
        onPowerRestored={() => {
          setPowerOn(true)
        }}
      />

      <group position={[7, 0, halfL - 0.05]}>
        <mesh position={[0, 1.5, 0]} castShadow receiveShadow>
          <boxGeometry args={[2, 3, 0.2]} />
          <meshStandardMaterial color="#444444" metalness={0.8} roughness={0.5} />
        </mesh>
        <mesh position={[0, 1.5, 0.12]} castShadow receiveShadow>
          <boxGeometry args={[1.8, 0.15, 0.05]} />
          <meshStandardMaterial color="#222222" metalness={0.7} roughness={0.4} />
        </mesh>
        <mesh position={[0, 1.0, 0.12]} castShadow receiveShadow>
          <boxGeometry args={[1.8, 0.15, 0.05]} />
          <meshStandardMaterial color="#222222" metalness={0.7} roughness={0.4} />
        </mesh>
      </group>
    </>
  )
}

export default function EscapeRoom1() {
  const [powerOn, setPowerOn] = useState(false)

  const darkFloorTexture = useWoodTexture('#333333')
  const cobbleFloorTexture = useCobblestoneTexture('#555555', '#333333')
  const ceilingTexture = useCeilingTexture('#444444')

  const wallColorBefore = '#3A3A3A'
  const wallColorAfter = '#777777'
  const wallColor = powerOn ? wallColorAfter : wallColorBefore

  return (
    <Scene
      sceneWidth={28}
      sceneLength={10}
      sceneHeight={4.5}
      floorTexture={powerOn ? cobbleFloorTexture : darkFloorTexture}
      ceilingTexture={ceilingTexture}
      ambientLightIntensity={0.15}
      directionalLightIntensity={0.4}
      pointLightIntensity={0}
    >
      <EscapeRoom1Content powerOn={powerOn} setPowerOn={setPowerOn} wallColor={wallColor} />
    </Scene>
  )
}


