import Room from '../components/room/Room'
import Door from '../components/walls/Door'
import Wall from '../components/walls/Wall'
import { Table, Chair, Bookshelf, PhysicsBox } from '../components/objects'
import { PLAYER_EYE_HEIGHT } from '../config/PlayerConfig'
import { useWoodTexture, useCeilingTexture } from '../utils/textures'
import { useRoom } from '../contexts/RoomContext'

function Room1Content() {
  const { roomWidth, roomLength, roomHeight } = useRoom()

  return (
    <>
      {/* Walls */}
      <Wall 
        position={[0, 0, -roomLength / 2]} 
        wallHeight={roomHeight}
        wallLength={roomWidth}
        textureColor="#D4A574"
      />
      <Wall 
        position={[0, 0, roomLength / 2]} 
        wallHeight={roomHeight}
        wallLength={roomWidth}
        textureColor="#D4A574"
      />
      <Wall 
        position={[-roomWidth / 2, 0, 0]} 
        rotation={[0, Math.PI / 2, 0]}
        wallHeight={roomHeight}
        wallLength={roomLength}
        textureColor="#D4A574"
      />
      <Wall
        position={[roomWidth / 2, 0, 0]}
        rotation={[0, Math.PI / 2, 0]}
        wallHeight={roomHeight}
        wallLength={roomLength}
        textureColor="#D4A574"
        openings={[
          { type: 'door', position: -8, width: 2, height: 3 },
          { type: 'door', position: 8, width: 2, height: 3 },
        ]}
      />
      
      {/* Doors */}
      <Door 
        position={[roomWidth / 2, 0, -8]} 
        rotation={[0, Math.PI / 2, 0]}
        targetScene="room2"
        spawnPoint={{ position: [-13, PLAYER_EYE_HEIGHT, -8], rotation: [0, Math.PI, 0] }} 
      />
      <Door 
        position={[roomWidth / 2, 0, 8]} 
        rotation={[0, Math.PI / 2, 0]}
        targetScene="room2"
        spawnPoint={{ position: [-13, PLAYER_EYE_HEIGHT, 8], rotation: [0, Math.PI, 0] }} 
      />

      {/* Furniture */}
      <Table position={[-5, 0, -5]} />
      <Chair position={[-6, 0, -4]} />
      <Chair position={[-4, 0, -4]} />
      <Bookshelf position={[-12, 0, -12]} />
      <Table position={[8, 0, 8]} />
      <Chair position={[7, 0, 9]} />
      <Bookshelf position={[12, 0, 12]} />

      {/* Interactive physics objects */}
      <PhysicsBox position={[3, 1, -3]} color="#FF6B6B" />
      <PhysicsBox position={[-3, 1, 3]} color="#4ECDC4" />
      <PhysicsBox position={[6, 1, 6]} color="#FFE66D" />
      <PhysicsBox position={[5, 1, -8]} color="#95E1D3" />
    </>
  )
}

export default function Room1() {
  return (
    <Room
      roomWidth={30}
      roomLength={30}
      roomHeight={8}
      floorTexture={useWoodTexture('#8B7355')}
      ceilingTexture={useCeilingTexture('#E8D5B7')}
    >
      <Room1Content />
    </Room>
  )
}
