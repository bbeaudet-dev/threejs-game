import Room from '../components/room/Room'
import Door from '../components/walls/Door'
import Wall from '../components/walls/Wall'
import { PLAYER_EYE_HEIGHT } from '../config/PlayerConfig'
import { useWoodTexture, useCeilingTexture } from '../utils/textures'
import { useRoom } from '../contexts/RoomContext'

function Room2Content() {
  const { roomWidth, roomLength, roomHeight } = useRoom()

  return (
    <>
      {/* Walls */}
      <Wall 
        position={[0, 0, -roomLength / 2]} 
        wallHeight={roomHeight}
        wallLength={roomWidth}
        textureColor="#A8C5A0"
      />
      <Wall 
        position={[0, 0, roomLength / 2]} 
        wallHeight={roomHeight}
        wallLength={roomWidth}
        textureColor="#A8C5A0"
      />
      <Wall
        position={[-roomWidth / 2, 0, 0]}
        rotation={[0, -Math.PI / 2, 0]}
        wallHeight={roomHeight}
        wallLength={roomLength}
        textureColor="#A8C5A0"
        openings={[
          { type: 'door', position: -8, width: 2, height: 3 },
          { type: 'door', position: 8, width: 2, height: 3 },
        ]}
      />
      <Wall
        position={[roomWidth / 2, 0, 0]}
        rotation={[0, Math.PI / 2, 0]}
        wallHeight={roomHeight}
        wallLength={roomLength}
        textureColor="#A8C5A0"
        openings={[
          { type: 'door', position: 0, width: 2, height: 3 },
        ]}
      />
      <Door 
        position={[-roomWidth / 2, 0, -8]} 
        rotation={[0, -Math.PI / 2, 0]}
        targetScene="room1"
        spawnPoint={{ position: [13, PLAYER_EYE_HEIGHT, -8], rotation: [0, 0, 0] }} 
      />
      <Door 
        position={[-roomWidth / 2, 0, 8]} 
        rotation={[0, -Math.PI / 2, 0]}
        targetScene="room1"
        spawnPoint={{ position: [13, PLAYER_EYE_HEIGHT, 8], rotation: [0, 0, 0] }}
      />
      <Door 
        position={[roomWidth / 2, 0, 0]} 
        rotation={[0, Math.PI / 2, 0]}
        targetScene="room3"
        spawnPoint={{ position: [-6, PLAYER_EYE_HEIGHT, 0], rotation: [0, Math.PI, 0] }}
      />
    </>
  )
}

export default function Room2() {
  return (
    <Room
      roomWidth={30}
      roomLength={30}
      roomHeight={8}
      floorTexture={useWoodTexture('#6B8E5A')}
      ceilingTexture={useCeilingTexture('#C8D5C0')}
    >
      <Room2Content />
    </Room>
  )
}
