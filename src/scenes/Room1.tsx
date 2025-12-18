import Room from '../components/room/Room'
import Door from '../components/walls/Door'
import Wall from '../components/walls/Wall'
import { Table, Chair, Bookshelf, PhysicsBox, PhysicsBall } from '../components/objects'
import Key from '../components/items/Key'
import PadlockedChest from '../components/objects/PadlockedChest'
import { showMessage } from '../components/hud/MessageDisplay'
import { PLAYER_EYE_HEIGHT } from '../config/PlayerConfig'
import { useWoodTexture, useCeilingTexture } from '../utils/textures'
import { useRoom } from '../contexts/RoomContext'
import { useGameState } from '../contexts/GameStateContext'

function Room1Content() {
  const { roomWidth, roomLength, roomHeight } = useRoom()
  const { returnToMenu } = useGameState()

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
      {/* Left door (z = -8) -> Room 3, unlocked by 2+2 puzzle */}
      <Door 
        position={[roomWidth / 2, 0, -8]} 
        rotation={[0, Math.PI / 2, 0]}
        targetScene="room3"
        spawnPoint={{ position: [-13, PLAYER_EYE_HEIGHT, 0], rotation: [0, 0, 0] }}
        requiredKey="room3-door-key"
        variant="room3"
      />
      {/* Right door (z = 8) -> Room 2, locked by Room 1 key */}
      <Door 
        position={[roomWidth / 2, 0, 8]} 
        rotation={[0, Math.PI / 2, 0]}
        targetScene="room2"
        spawnPoint={{ position: [-3, PLAYER_EYE_HEIGHT, 0], rotation: [0, 0, 0] }}
        requiredKey="room1-key"
      />

      {/* Furniture */}
      <Table position={[-5, 0, -5]} />
      {/* Chairs around first table (6 chairs) */}
      <Chair position={[-5, 0, -3.5]} rotation={[0, Math.PI, 0]} />
      <Chair position={[-5, 0, -6.5]} rotation={[0, 0, 0]} />
      <Chair position={[-3.5, 0, -5]} rotation={[0, -Math.PI / 2, 0]} />
      <Chair position={[-6.5, 0, -5]} rotation={[0, Math.PI / 2, 0]} />
      <Chair position={[-3.8, 0, -3.8]} rotation={[0, -Math.PI * 3 / 4, 0]} />
      <Chair position={[-6.2, 0, -6.2]} rotation={[0, Math.PI * 3 / 4, 0]} />
      {/* L-shaped bookshelves hiding the key */}
      {/* Back wall (z = -roomLength/2): face into room (+Z) */}
      <Bookshelf position={[-12, 0, -12]} rotation={[0, 0, 0]} />
      {/* Side wall (x more positive): face into room (+X) => rotate +PI/2 */}
      <Bookshelf position={[-10.5, 0, -12]} rotation={[0, Math.PI / 2, 0]} />
      <Table position={[8, 0, 8]} />
      {/* Chairs around second table (6 chairs) */}
      <Chair position={[8, 0, 9.5]} rotation={[0, Math.PI, 0]} />
      <Chair position={[8, 0, 6.5]} rotation={[0, 0, 0]} />
      <Chair position={[9.5, 0, 8]} rotation={[0, -Math.PI / 2, 0]} />
      <Chair position={[6.5, 0, 8]} rotation={[0, Math.PI / 2, 0]} />
      <Chair position={[9.2, 0, 9.2]} rotation={[0, -Math.PI * 3 / 4, 0]} />
      <Chair position={[6.8, 0, 6.8]} rotation={[0, Math.PI * 3 / 4, 0]} />
      {/* Bookshelf near second table - front/right corner, face into room (-Z) */}
      <Bookshelf position={[12, 0, 12]} rotation={[0, Math.PI, 0]} />
      {/* Back wall: face into room (+Z) */}
      <Bookshelf position={[0, 0, -14]} rotation={[0, 0, 0]} />
      {/* Front wall: face into room (-Z) */}
      <Bookshelf position={[0, 0, 14]} rotation={[0, Math.PI, 0]} />
      {/* Left wall (x = -roomWidth/2): face into room (+X) => +PI/2 */}
      <Bookshelf position={[-14, 0, 0]} rotation={[0, Math.PI / 2, 0]} />
      {/* Right wall (x = roomWidth/2): face into room (-X) => -PI/2 */}
      <Bookshelf position={[14, 0, 0]} rotation={[0, -Math.PI / 2, 0]} />
      
      {/* Key hidden behind bookshelf */}
      <Key position={[-12, 0, -12.5]} itemId="room1-key" name="Room Key" />
      
      {/* Padlocked chest */}
      <PadlockedChest
        position={[-8, 0, -8]}
        requiredKey="room3-key"
        onUnlock={() => {
          showMessage('Congratulations! You have completed the puzzle!')
          // Return to main menu after a short delay
          setTimeout(() => {
            returnToMenu()
          }, 3000)
        }}
      />

      {/* Interactive physics objects */}
      <PhysicsBox position={[3, 1, -3]} color="#FF6B6B" />
      <PhysicsBox position={[-3, 1, 3]} color="#4ECDC4" />
      <PhysicsBox position={[6, 1, 6]} color="#FFE66D" />
      <PhysicsBox position={[5, 1, -8]} color="#95E1D3" />
      {/* Extra cubes */}
      <PhysicsBox position={[-8, 1, 5]} color="#FFB347" />
      <PhysicsBox position={[10, 1, -2]} color="#9B59B6" />
      <PhysicsBox position={[2, 1, 10]} color="#1ABC9C" />

      {/* Physics balls */}
      <PhysicsBall position={[8, 2, -4]} color="#FFD700" radius={0.8} />
      <PhysicsBall position={[-8, 2, 4]} color="#FF8C00" radius={0.7} />

      {/* Hanging ceiling lights */}
      {[
        [0, 0, 0],
        [-8, 0, -8],
        [8, 0, 8],
      ].map((offset, index) => (
        <group key={index} position={[offset[0], roomHeight - 1, offset[2]]}>
          {/* Chain */}
          <mesh position={[0, 0.5, 0]} castShadow>
            <cylinderGeometry args={[0.03, 0.03, 1, 8]} />
            <meshStandardMaterial color="#AAAAAA" />
          </mesh>
          {/* Lamp */}
          <mesh position={[0, 0, 0]} castShadow>
            <sphereGeometry args={[0.4, 16, 16]} />
            <meshStandardMaterial color="#FFFFE0" emissive="#FFFFAA" emissiveIntensity={0.8} />
          </mesh>
          <pointLight position={[0, 0, 0]} intensity={1.1} distance={22} color="#FFFFDD" />
        </group>
      ))}
    </>
  )
}

export default function Room1() {
  return (
    <Room
      roomWidth={30}
      roomLength={30}
      roomHeight={6}
      floorTexture={useWoodTexture('#8B7355')}
      ceilingTexture={useCeilingTexture('#E8D5B7')}
    >
      <Room1Content />
    </Room>
  )
}
