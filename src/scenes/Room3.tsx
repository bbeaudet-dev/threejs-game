import Room from '../components/room/Room'
import Door from '../components/walls/Door'
import Wall from '../components/walls/Wall'
import SpeedBoost from '../components/items/SpeedBoost'
import { PLAYER_EYE_HEIGHT } from '../config/PlayerConfig'
import { useWoodTexture, useCeilingTexture } from '../utils/textures'
import { useRoom } from '../contexts/RoomContext'

function Room3Content() {
  const { roomWidth, roomLength, roomHeight } = useRoom()

  return (
    <>
      {/* Walls */}
      <Wall 
        position={[0, 0, -roomLength / 2]} 
        wallHeight={roomHeight}
        wallLength={roomWidth}
        textureColor="#6B6B8B"
      />
      <Wall 
        position={[0, 0, roomLength / 2]} 
        wallHeight={roomHeight}
        wallLength={roomWidth}
        textureColor="#6B6B8B"
      />
      <Wall
        position={[-roomWidth / 2, 0, 0]}
        rotation={[0, -Math.PI / 2, 0]}
        wallHeight={roomHeight}
        wallLength={roomLength}
        textureColor="#6B6B8B"
        openings={[
          { type: 'door', position: 0, width: 2, height: 3 },
        ]}
      />
      <Wall
        position={[roomWidth / 2, 0, 0]}
        rotation={[0, Math.PI / 2, 0]}
        wallHeight={roomHeight}
        wallLength={roomLength}
        textureColor="#6B6B8B"
      />
      
      {/* Door */}
      <Door 
        position={[-roomWidth / 2, 0, 0]} 
        rotation={[0, -Math.PI / 2, 0]}
        targetScene="room2"
        spawnPoint={{ position: [13, PLAYER_EYE_HEIGHT, 0], rotation: [0, 0, 0] }} 
      />

      {/* Speed boost item */}
      <SpeedBoost position={[3, 1, 3]} />
    </>
  )
}

export default function Room3() {
  return (
    <Room
      roomWidth={15}
      roomLength={15}
      roomHeight={6}
      floorTexture={useWoodTexture('#4A4A6B')}
      ceilingTexture={useCeilingTexture('#8B8BA8')}
      pointLightPosition={[-5, 6, -5]}
      shadowCameraBounds={{ left: -8, right: 8, top: 8, bottom: -8 }}
    >
      <Room3Content />
    </Room>
  )
}
