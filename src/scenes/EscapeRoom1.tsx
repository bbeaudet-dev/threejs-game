import { useEffect, useState } from 'react'
import { useThree } from '@react-three/fiber'
import Room from '../components/room/Room'
import Wall from '../components/walls/Wall'
import { Table, Bookshelf, PhysicsBox, Lever, BreakerBox } from '../components/objects'
import Fuse from '../components/items/Fuse'
import EmergencyLight from '../components/objects/EmergencyLight'
import { useWoodTexture, useCeilingTexture, useCobblestoneTexture } from '../utils/textures'
import { useRoom } from '../contexts/RoomContext'
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
    const halfW = roomWidth / 2
    const halfL = roomLength / 2
    camera.position.set(halfW - 2, PLAYER_EYE_HEIGHT, halfL - 2)
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
  const { roomWidth, roomLength, roomHeight } = useRoom()
  const [shelfOpen, setShelfOpen] = useState(false)
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

      <Table position={[7, 0, 0]} />

      <group
        position={[5, 0, -halfL + 1.5]}
      >
        <group
          position={[-1, 0, 0]}
          rotation={[0, shelfOpen ? Math.PI / 2 : 0, 0]}
        >
          <Bookshelf position={[0, 0, 0]} />
        </group>
      </group>


      <PhysicsBox position={[11, 1, 2]} color="#555577" />
      <PhysicsBox position={[11.8, 1, 2.5]} color="#777799" />
      <PhysicsBox position={[10.5, 1, 3]} color="#9999BB" />

      <Fuse
        position={[7.6, 0.75, -0.4]}
        rotation={[0, 0, Math.PI / 2]}
        itemId="fuse-red"
        color="#FF6B6B"
        name="Red Fuse"
      />

      <Fuse
        position={[5, 0.9, -halfL + 1.6]}
        itemId="fuse-green"
        color="#4ECDC4"
        name="Green Fuse"
      />

      <Fuse
        position={[11.5, 0.3, 3.6]}
        itemId="fuse-blue"
        color="#3498DB"
        name="Blue Fuse"
      />

      <BreakerBox
        position={[halfW - 1.2, 0, -1]}
        rotation={[0, -Math.PI / 2, 0]}
        onPowerRestored={() => {
          setPowerOn(true)
        }}
      />

      {powerOn && (
        <Lever
          position={[7.3, 1.3, -halfL + 1.5]}
          rotation={[0, Math.PI / 2, 0]}
          onToggle={(on) => {
            if (on) {
              setShelfOpen(true)
            } else {
              setShelfOpen(false)
            }
          }}
        />
      )}
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
    <Room
      roomWidth={28}
      roomLength={10}
      roomHeight={4.5}
      floorTexture={powerOn ? cobbleFloorTexture : darkFloorTexture}
      ceilingTexture={ceilingTexture}
      ambientLightIntensity={0.15}
      directionalLightIntensity={0.4}
      pointLightIntensity={0}
    >
      <EscapeRoom1Content powerOn={powerOn} setPowerOn={setPowerOn} wallColor={wallColor} />
    </Room>
  )
}


