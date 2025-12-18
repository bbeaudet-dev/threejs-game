import Room from '../components/room/Room'
import Door from '../components/walls/Door'
import Wall from '../components/walls/Wall'
import Computer from '../components/objects/Computer'
import { Sign } from '../components/objects'
import { PLAYER_EYE_HEIGHT } from '../config/PlayerConfig'
import { useWoodTexture, useCeilingTexture } from '../utils/textures'
import { useRoom } from '../contexts/RoomContext'

function Room2Content() {
  const { roomWidth, roomLength, roomHeight } = useRoom()

  return (
    <>
      {/* Tiny broom-closet walls */}
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

      {/* Left wall with a single door back to Room 1 */}
      <Wall
        position={[-roomWidth / 2, 0, 0]}
        rotation={[0, -Math.PI / 2, 0]}
        wallHeight={roomHeight}
        wallLength={roomLength}
        textureColor="#A8C5A0"
        openings={[
          { type: 'door', position: 0, width: 2, height: 3 },
        ]}
      />

      {/* Door back to Room 1 (center of the left wall) */}
      <Door 
        position={[-roomWidth / 2, 0, 0]} 
        rotation={[0, -Math.PI / 2, 0]}
        targetScene="room1"
        spawnPoint={{ position: [13, PLAYER_EYE_HEIGHT, 8], rotation: [0, 0, 0] }}
      />

      {/* Right outer wall (no door to Room 3 anymore) */}
      <Wall
        position={[roomWidth / 2, 0, 0]}
        rotation={[0, Math.PI / 2, 0]}
        wallHeight={roomHeight}
        wallLength={roomLength}
        textureColor="#A8C5A0"
      />
      
      {/* Puzzle sign in small broom-closet Room 2 */}
      <Sign
        position={[0, 2, -2]}
        text={'2 + 2 = ?'}
      />

      {/* Computer terminal next to sign */}
      <Computer
        position={[0, 0.5, 0]}
        question="Enter the answer from the sign:"
        correctAnswer="4"
      />
    </>
  )
}

export default function Room2() {
  return (
    <Room
      roomWidth={10}
      roomLength={10}
      roomHeight={6}
      floorTexture={useWoodTexture('#6B8E5A')}
      ceilingTexture={useCeilingTexture('#C8D5C0')}
    >
      <Room2Content />
    </Room>
  )
}
