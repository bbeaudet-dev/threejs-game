import { useEffect, useState } from 'react'
import { useThree } from '@react-three/fiber'
import Scene from '../components/Scene'
import Room from '../components/room/Room'
import Door from '../components/room/Door'
import { Table, Bookshelf } from '../components/objects'
import { useScene } from '../contexts/SceneContext'
import { PLAYER_EYE_HEIGHT } from '../config/PlayerConfig'
import { useWoodTexture, useCeilingTexture } from '../utils/textures'

const FLOOR_HEIGHT = 6
const BASEMENT_HEIGHT = -6
const UPPER_FLOOR_HEIGHT = 6

function SpawnAtFrontDoor() {
  const { sceneLength } = useScene()
  const { camera } = useThree()

  useEffect(() => {
    const halfL = sceneLength / 2
    camera.position.set(0, PLAYER_EYE_HEIGHT, halfL - 4)
  }, [camera, sceneLength])

  return null
}

function HouseContent() {
  const { sceneWidth, sceneLength } = useScene()
  
  // Room dimensions
  const livingRoomWidth = 12
  const livingRoomLength = 10
  const kitchenWidth = 8
  const kitchenLength = 10
  const diningRoomWidth = 10
  const diningRoomLength = 8
  const bedroomWidth = 8
  const bedroomLength = 8
  const bathroomWidth = 6
  const bathroomLength = 6
  const basementWidth = 20
  const basementLength = 16
  
  // Calculate positions
  const livingRoomPos: [number, number, number] = [-6, 0, 0]
  const kitchenPos: [number, number, number] = [6, 0, 0]
  const diningRoomPos: [number, number, number] = [-6, 0, -10]
  const bedroom1Pos: [number, number, number] = [6, 0, -10]
  const bathroomPos: [number, number, number] = [14, 0, -4]
  const upperBedroom1Pos: [number, number, number] = [-6, UPPER_FLOOR_HEIGHT, 0]
  const upperBedroom2Pos: [number, number, number] = [6, UPPER_FLOOR_HEIGHT, 0]
  const basementPos: [number, number, number] = [0, BASEMENT_HEIGHT, 0]
  
  // Door states
  const [livingKitchenDoor, setLivingKitchenDoor] = useState(false)
  const [livingDiningDoor, setLivingDiningDoor] = useState(false)
  const [diningBedroomDoor, setDiningBedroomDoor] = useState(false)
  const [bedroomBathroomDoor, setBedroomBathroomDoor] = useState(false)
  const [upperBedroom1Door, setUpperBedroom1Door] = useState(false)
  const [upperBedroom2Door, setUpperBedroom2Door] = useState(false)
  const [basementDoor, setBasementDoor] = useState(false)
  
  // Stair positions
  const stairsPos: [number, number, number] = [14, 0, -10]
  const basementStairsPos: [number, number, number] = [14, BASEMENT_HEIGHT, -10]

  return (
    <>
      <SpawnAtFrontDoor />

      {/* BASEMENT */}
      <Room
        origin={basementPos}
        width={basementWidth}
        length={basementLength}
        height={FLOOR_HEIGHT}
        wallColor="#4A4A4A"
        floorTexture={useWoodTexture('#2A2A2A')}
        ceilingTexture={useCeilingTexture('#3A3A3A')}
        doors={[
          { side: 'right', position: -10, width: 2, height: 3 },
        ]}
      >
        <Door
          position={[basementWidth / 2, 0, -10 - 1]}
          rotation={[0, Math.PI / 2, 0]}
          hingeSide="right"
          isOpen={basementDoor}
          onToggle={setBasementDoor}
        />
        <Table position={[-5, 0, 0]} />
        <Bookshelf position={[-8, 0, -6]} rotation={[0, Math.PI / 2, 0]} />
        <Bookshelf position={[8, 0, 6]} rotation={[0, -Math.PI / 2, 0]} />
      </Room>

      {/* GROUND FLOOR - Living Room */}
      <Room
        origin={livingRoomPos}
        width={livingRoomWidth}
        length={livingRoomLength}
        height={FLOOR_HEIGHT}
        wallColor="#D4A574"
        floorTexture={useWoodTexture('#8B7355')}
        ceilingTexture={useCeilingTexture('#E8D5B7')}
        doors={[
          { side: 'right', position: 0, width: 2, height: 3 },
          { side: 'back', position: 0, width: 2, height: 3 },
        ]}
        skipWalls={{ front: true }}
      >
        <Door
          position={[livingRoomWidth / 2, 0, 0 - 1]}
          rotation={[0, Math.PI / 2, 0]}
          hingeSide="right"
          isOpen={livingKitchenDoor}
          onToggle={setLivingKitchenDoor}
        />
        <Door
          position={[0, 0, -livingRoomLength / 2 - 1]}
          rotation={[0, 0, 0]}
          hingeSide="right"
          isOpen={livingDiningDoor}
          onToggle={setLivingDiningDoor}
        />
        <Table position={[-3, 0, 2]} />
        <Bookshelf position={[-5, 0, 4]} rotation={[0, 0, 0]} />
        <Bookshelf position={[5, 0, -4]} rotation={[0, Math.PI, 0]} />
      </Room>

      {/* GROUND FLOOR - Kitchen */}
      <Room
        origin={kitchenPos}
        width={kitchenWidth}
        length={kitchenLength}
        height={FLOOR_HEIGHT}
        wallColor="#A8C5A0"
        floorTexture={useWoodTexture('#6B8E5A')}
        ceilingTexture={useCeilingTexture('#C8D5C0')}
        doors={[
          { side: 'left', position: 0, width: 2, height: 3 },
        ]}
        skipWalls={{ front: true }}
      >
        <Door
          position={[-kitchenWidth / 2, 0, 0 - 1]}
          rotation={[0, -Math.PI / 2, 0]}
          hingeSide="left"
          isOpen={livingKitchenDoor}
          onToggle={setLivingKitchenDoor}
        />
        <Table position={[2, 0, -2]} />
        <Bookshelf position={[3, 0, 4]} rotation={[0, 0, 0]} />
      </Room>

      {/* GROUND FLOOR - Dining Room */}
      <Room
        origin={diningRoomPos}
        width={diningRoomWidth}
        length={diningRoomLength}
        height={FLOOR_HEIGHT}
        wallColor="#D4A574"
        floorTexture={useWoodTexture('#8B7355')}
        ceilingTexture={useCeilingTexture('#E8D5B7')}
        doors={[
          { side: 'front', position: 0, width: 2, height: 3 },
          { side: 'right', position: 0, width: 2, height: 3 },
        ]}
      >
        <Door
          position={[0, 0, diningRoomLength / 2 - 1]}
          rotation={[0, Math.PI, 0]}
          hingeSide="right"
          isOpen={livingDiningDoor}
          onToggle={setLivingDiningDoor}
        />
        <Door
          position={[diningRoomWidth / 2, 0, 0 - 1]}
          rotation={[0, Math.PI / 2, 0]}
          hingeSide="right"
          isOpen={diningBedroomDoor}
          onToggle={setDiningBedroomDoor}
        />
        <Table position={[0, 0, 0]} />
        <Bookshelf position={[-4, 0, -3]} rotation={[0, Math.PI / 2, 0]} />
      </Room>

      {/* GROUND FLOOR - Bedroom 1 */}
      <Room
        origin={bedroom1Pos}
        width={bedroomWidth}
        length={bedroomLength}
        height={FLOOR_HEIGHT}
        wallColor="#6B6B8B"
        floorTexture={useWoodTexture('#1B263B')}
        ceilingTexture={useCeilingTexture('#415A77')}
        doors={[
          { side: 'left', position: 0, width: 2, height: 3 },
          { side: 'right', position: -4, width: 2, height: 3 },
        ]}
      >
        <Door
          position={[-bedroomWidth / 2, 0, 0 - 1]}
          rotation={[0, -Math.PI / 2, 0]}
          hingeSide="left"
          isOpen={diningBedroomDoor}
          onToggle={setDiningBedroomDoor}
        />
        <Door
          position={[bedroomWidth / 2, 0, -4 - 1]}
          rotation={[0, Math.PI / 2, 0]}
          hingeSide="right"
          isOpen={bedroomBathroomDoor}
          onToggle={setBedroomBathroomDoor}
        />
        <Table position={[0, 0, 2]} />
        <Bookshelf position={[-3, 0, -3]} rotation={[0, 0, 0]} />
      </Room>

      {/* GROUND FLOOR - Bathroom */}
      <Room
        origin={bathroomPos}
        width={bathroomWidth}
        length={bathroomLength}
        height={FLOOR_HEIGHT}
        wallColor="#B0B0B0"
        floorTexture={useWoodTexture('#808080')}
        ceilingTexture={useCeilingTexture('#D0D0D0')}
        doors={[
          { side: 'left', position: -4, width: 2, height: 3 },
        ]}
      >
        <Door
          position={[-bathroomWidth / 2, 0, -4 - 1]}
          rotation={[0, -Math.PI / 2, 0]}
          hingeSide="left"
          isOpen={bedroomBathroomDoor}
          onToggle={setBedroomBathroomDoor}
        />
        <Table position={[0, 0, 0]} />
      </Room>

      {/* UPPER FLOOR - Bedroom 1 */}
      <Room
        origin={upperBedroom1Pos}
        width={bedroomWidth}
        length={bedroomLength}
        height={FLOOR_HEIGHT}
        wallColor="#6B6B8B"
        floorTexture={useWoodTexture('#1B263B')}
        ceilingTexture={useCeilingTexture('#415A77')}
        doors={[
          { side: 'right', position: -10, width: 2, height: 3 },
        ]}
      >
        <Door
          position={[bedroomWidth / 2, 0, -10 - 1]}
          rotation={[0, Math.PI / 2, 0]}
          hingeSide="right"
          isOpen={upperBedroom1Door}
          onToggle={setUpperBedroom1Door}
        />
        <Table position={[0, 0, 2]} />
        <Bookshelf position={[-3, 0, -3]} rotation={[0, 0, 0]} />
      </Room>

      {/* UPPER FLOOR - Bedroom 2 */}
      <Room
        origin={upperBedroom2Pos}
        width={bedroomWidth}
        length={bedroomLength}
        height={FLOOR_HEIGHT}
        wallColor="#6B6B8B"
        floorTexture={useWoodTexture('#1B263B')}
        ceilingTexture={useCeilingTexture('#415A77')}
        doors={[
          { side: 'left', position: -10, width: 2, height: 3 },
        ]}
      >
        <Door
          position={[-bedroomWidth / 2, 0, -10 - 1]}
          rotation={[0, -Math.PI / 2, 0]}
          hingeSide="left"
          isOpen={upperBedroom2Door}
          onToggle={setUpperBedroom2Door}
        />
        <Table position={[0, 0, 2]} />
        <Bookshelf position={[3, 0, -3]} rotation={[0, Math.PI, 0]} />
      </Room>

      {/* Stairs - Ground to Upper (simple visual representation) */}
      <mesh position={[stairsPos[0], stairsPos[1] + 0.1, stairsPos[2]]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[2, 0.2, 6]} />
        <meshStandardMaterial color="#8B7355" />
      </mesh>

      {/* Stairs - Ground to Basement */}
      <mesh position={[basementStairsPos[0], basementStairsPos[1] + 0.1, basementStairsPos[2]]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[2, 0.2, 6]} />
        <meshStandardMaterial color="#8B7355" />
      </mesh>

      {/* Outside ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[sceneWidth * 2, sceneLength * 2]} />
        <meshStandardMaterial color="#204020" />
      </mesh>
    </>
  )
}

export default function House1() {
  return (
    <Scene
      sceneWidth={50}
      sceneLength={40}
      sceneHeight={15}
      floorTexture={useWoodTexture('#555555')}
      ceilingTexture={useCeilingTexture('#AAAAAA')}
      ambientLightIntensity={0.4}
      directionalLightIntensity={0.8}
      pointLightIntensity={0.2}
    >
      <HouseContent />
    </Scene>
  )
}
