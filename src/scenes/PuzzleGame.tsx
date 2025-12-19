import { useState, useEffect } from 'react'
import { useThree } from '@react-three/fiber'
import Scene from '../components/Scene'
import Room from '../components/room/Room'
import Door from '../components/room/Door'
import { Table, Chair, Bookshelf, PhysicsBox, PhysicsBall, PadlockedChest, Computer } from '../components/objects'
import { Sign } from '../components/objects'
import Key from '../components/items/Key'
import SpeedBoost from '../components/items/SpeedBoost'
import { showMessage } from '../components/hud/MessageDisplay'
import { PLAYER_EYE_HEIGHT } from '../config/PlayerConfig'
import { useWoodTexture, useCeilingTexture } from '../utils/textures'
import { useGameState } from '../contexts/GameStateContext'
import { usePlayer } from '../contexts/PlayerContext'
import { ROOM3_PLANETS } from '../config/Room3Config'

const WALL_THICKNESS = 0.2

function SpawnInRoom1() {
  const { camera } = useThree()
  
  useEffect(() => {
    camera.position.set(0, PLAYER_EYE_HEIGHT, 0)
  }, [camera])
  
  return null
}

const ROOM_DIMENSIONS = {
  room1: { width: 30, length: 30, height: 6 },
  room2: { width: 10, length: 10, height: 6 },
  room3: { width: 70, length: 70, height: 26 },
} as const

function PuzzleGameContent() {
  const { returnToMenu } = useGameState()
  const { addItem } = usePlayer()
  
  const room1Width = ROOM_DIMENSIONS.room1.width
  const room1Length = ROOM_DIMENSIONS.room1.length
  const room1Height = ROOM_DIMENSIONS.room1.height
  
  const room2Width = ROOM_DIMENSIONS.room2.width
  const room2Length = ROOM_DIMENSIONS.room2.length
  const room2Height = ROOM_DIMENSIONS.room2.height
  
  const room3Width = ROOM_DIMENSIONS.room3.width
  const room3Length = ROOM_DIMENSIONS.room3.length
  const room3Height = ROOM_DIMENSIONS.room3.height
  
  const room1Pos: [number, number, number] = [0, 0, 0]
  const room1RightWallX = room1Width / 2
  const room1LeftWallX = -room1Width / 2
  const room2Pos: [number, number, number] = [room1RightWallX + WALL_THICKNESS + room2Width / 2, 0, 8]
  const room3Pos: [number, number, number] = [room1LeftWallX - WALL_THICKNESS - room3Width / 2, 0, 0]
  const doorWidth = 2
  const room1RightDoorPos: [number, number, number] = [room1RightWallX, 0, 10 - doorWidth / 2]
  const room1LeftDoorPos: [number, number, number] = [room1LeftWallX, 0, 0 - doorWidth / 2]
  
  const [room2DoorOpen, setRoom2DoorOpen] = useState(false)
  const [room3DoorOpen, setRoom3DoorOpen] = useState(false)
  
  const handleComputerCorrect = () => {
    addItem('room3-door-key')
  }
  
  return (
    <>
      <SpawnInRoom1 />
      
      <Room
        origin={room1Pos}
        width={room1Width}
        length={room1Length}
        height={room1Height}
        wallColor="#D4A574"
        floorTexture={useWoodTexture('#8B7355')}
        ceilingTexture={useCeilingTexture('#E8D5B7')}
        doors={[
          { side: 'right', position: 8, width: 2, height: 3 },
          { side: 'left', position: 0, width: 2, height: 3 },
        ]}
      >
        <Door
          position={room1RightDoorPos}
          rotation={[0, Math.PI / 2, 0]}
          hingeSide="right"
          requiredKey="room1-key"
          isOpen={room2DoorOpen}
          onToggle={setRoom2DoorOpen}
        />
        
        <Door
          position={room1LeftDoorPos}
          rotation={[0, -Math.PI / 2, 0]}
          hingeSide="left"
          requiredKey="room3-door-key"
          variant="solar-system"
          tooltipText="Sealed"
          lockedMessage="The door is sealed tight."
          isOpen={room3DoorOpen}
          onToggle={setRoom3DoorOpen}
        />
        
        <Table position={[-5, 0, -5]} />
        <Chair position={[-5, 0, -3.5]} rotation={[0, Math.PI, 0]} />
        <Chair position={[-5, 0, -6.5]} rotation={[0, 0, 0]} />
        <Chair position={[-3.5, 0, -5]} rotation={[0, -Math.PI / 2, 0]} />
        <Chair position={[-6.5, 0, -5]} rotation={[0, Math.PI / 2, 0]} />
        <Chair position={[-3.8, 0, -3.8]} rotation={[0, -Math.PI * 3 / 4, 0]} />
        <Chair position={[-6.2, 0, -6.2]} rotation={[0, Math.PI * 3 / 4, 0]} />
        
        <Bookshelf position={[-12, 0, -12]} rotation={[0, 0, 0]} />
        <Bookshelf position={[-10.5, 0, -12]} rotation={[0, Math.PI / 2, 0]} />
        
        <Table position={[8, 0, 8]} />
        <Chair position={[8, 0, 9.5]} rotation={[0, Math.PI, 0]} />
        <Chair position={[8, 0, 6.5]} rotation={[0, 0, 0]} />
        <Chair position={[9.5, 0, 8]} rotation={[0, -Math.PI / 2, 0]} />
        <Chair position={[6.5, 0, 8]} rotation={[0, Math.PI / 2, 0]} />
        <Chair position={[9.2, 0, 9.2]} rotation={[0, -Math.PI * 3 / 4, 0]} />
        <Chair position={[6.8, 0, 6.8]} rotation={[0, Math.PI * 3 / 4, 0]} />
        
        <Bookshelf position={[12, 0, 12]} rotation={[0, Math.PI, 0]} />
        <Bookshelf position={[0, 0, -14]} rotation={[0, 0, 0]} />
        <Bookshelf position={[0, 0, 14]} rotation={[0, Math.PI, 0]} />
        <Bookshelf position={[-14, 0, -8]} rotation={[0, Math.PI / 2, 0]} />
        <Bookshelf position={[14, 0, 0]} rotation={[0, -Math.PI / 2, 0]} />
        
        <Key position={[-12, 0, -12.5]} itemId="room1-key" name="Room Key" />
        
        <PadlockedChest
          position={[-8, 0, -8]}
          requiredKey="room3-key"
          onUnlock={() => {
            showMessage('Congratulations! You have completed the puzzle!')
            setTimeout(() => {
              returnToMenu()
            }, 3000)
          }}
        />
        
        <PhysicsBox position={[3, 1, -3]} color="#FF6B6B" />
        <PhysicsBox position={[-3, 1, 3]} color="#4ECDC4" />
        <PhysicsBox position={[6, 1, 6]} color="#FFE66D" />
        <PhysicsBox position={[5, 1, -8]} color="#95E1D3" />
        <PhysicsBox position={[-8, 1, 5]} color="#FFB347" />
        <PhysicsBox position={[10, 1, -2]} color="#9B59B6" />
        <PhysicsBox position={[2, 1, 10]} color="#1ABC9C" />
        
        <PhysicsBall position={[8, 2, -4]} color="#FFD700" radius={0.8} />
        <PhysicsBall position={[-8, 2, 4]} color="#FF8C00" radius={0.7} />
        
        {[
          [0, 0, 0],
          [-8, 0, -8],
          [8, 0, 8],
        ].map((offset, index) => (
          <group key={index} position={[offset[0], room1Height - 1, offset[2]]}>
            <mesh position={[0, 0.5, 0]} castShadow>
              <cylinderGeometry args={[0.03, 0.03, 1, 8]} />
              <meshStandardMaterial color="#AAAAAA" />
            </mesh>
            <mesh position={[0, 0, 0]} castShadow>
              <sphereGeometry args={[0.4, 16, 16]} />
              <meshStandardMaterial color="#FFFFE0" emissive="#FFFFAA" emissiveIntensity={0.8} />
            </mesh>
            <pointLight position={[0, 0, 0]} intensity={1.1} distance={22} color="#FFFFDD" />
          </group>
        ))}
      </Room>
      
      <Room
        origin={room2Pos}
        width={room2Width}
        length={room2Length}
        height={room2Height}
        wallColor="#A8C5A0"
        floorTexture={useWoodTexture('#6B8E5A')}
        ceilingTexture={useCeilingTexture('#C8D5C0')}
        doors={[
          { side: 'left', position: 0, width: 2, height: 3 },
        ]}
        skipWalls={{ back: true }}
      >
        <Sign
          position={[0, 2, -2]}
          text={'2 + 2 = ?'}
        />
        
        <Computer
          position={[0, 0.5, 0]}
          question="Enter the answer from the sign:"
          correctAnswer="4"
          onCorrect={handleComputerCorrect}
        />
      </Room>
      
      <Room
        origin={room3Pos}
        width={room3Width}
        length={room3Length}
        height={room3Height}
        wallColor="#6B6B8B"
        floorTexture={useWoodTexture('#1B263B')}
        ceilingTexture={useCeilingTexture('#415A77')}
        doors={[
          { side: 'right', position: 0, width: 2, height: 3 },
        ]}
      >
        <SpeedBoost position={[8, 1, 8]} />
        
        <Key position={[room3Width / 2 - 2, room3Height - 3, room3Length / 2 - 2]} itemId="room3-key" name="Chest Key" />
        
        <group>
          {ROOM3_PLANETS.map((planet, index) => (
            <mesh
              key={index}
              position={planet.position}
              castShadow
              receiveShadow
            >
              <sphereGeometry args={[planet.radius, 32, 32]} />
              <meshStandardMaterial
                color={planet.color}
                emissive={index === 0 ? planet.color : '#000000'}
                emissiveIntensity={index === 0 ? 0.7 : 0.1}
              />
            </mesh>
          ))}
        </group>
      </Room>
    </>
  )
}

export default function PuzzleGame() {
  const roomHeights = Object.values(ROOM_DIMENSIONS).map(r => r.height)
  const maxRoomHeight = Math.max(...roomHeights)
  const sceneCeilingBuffer = 10
  const sceneHeight = maxRoomHeight + sceneCeilingBuffer
  
  return (
    <Scene
      sceneWidth={150}
      sceneLength={150}
      sceneHeight={sceneHeight}
      pointLightPosition={[0, 18, 0]}
      shadowCameraBounds={{ left: -75, right: 75, top: 75, bottom: -75 }}
    >
      <PuzzleGameContent />
    </Scene>
  )
}
