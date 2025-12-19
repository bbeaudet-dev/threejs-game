import Scene from '../components/Scene'
import Door from '../components/room/Door'
import Wall from '../components/room/Wall'
import SpeedBoost from '../components/items/SpeedBoost'
import Key from '../components/items/Key'
import { PLAYER_EYE_HEIGHT } from '../config/PlayerConfig'
import { useWoodTexture, useCeilingTexture } from '../utils/textures'
import { useScene } from '../contexts/SceneContext'
import { ROOM3_PLANETS } from '../config/Room3Config'

function Room3Content() {
  const { sceneWidth: roomWidth, sceneLength: roomLength, sceneHeight: roomHeight } = useScene()

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
        targetScene="room1"
        spawnPoint={{ position: [13, PLAYER_EYE_HEIGHT, -8], rotation: [0, 0, 0] }} 
        variant="room3"
      />

      {/* Speed boost item */}
      <SpeedBoost position={[8, 1, 8]} />
      
      {/* Second key */}
      <Key position={[roomWidth / 2 - 2, roomHeight - 3, roomLength / 2 - 2]} itemId="room3-key" name="Chest Key" />

      {/* Mini solar system */}
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
    </>
  )
}

export default function Room3() {
  return (
    <Scene
      sceneWidth={70}
      sceneLength={70}
      sceneHeight={26}
      floorTexture={useWoodTexture('#1B263B')}
      ceilingTexture={useCeilingTexture('#415A77')}
      pointLightPosition={[0, 18, 0]}
      shadowCameraBounds={{ left: -35, right: 35, top: 35, bottom: -35 }}
    >
      <Room3Content />
    </Scene>
  )
}
