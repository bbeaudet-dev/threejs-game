import HUD from './components/hud/HUD'
import { InteractionProvider } from './systems/InteractionSystem'
import { PlayerProvider } from './contexts/PlayerContext'
import { CameraProvider } from './contexts/CameraContext'
import { SceneRoutingProvider } from './scenes/SceneRouting'
import { GameStateProvider, useGameState } from './contexts/GameStateContext'
import MainMenu from './components/menu/MainMenu'
import PuzzleGame from './scenes/PuzzleGame'
import EscapeRoom1 from './scenes/EscapeRoom1'
import House1 from './scenes/House1'
import './App.css'

function GameScenes() {
  const { state } = useGameState()

  if (state === 'menu') {
    return <MainMenu />
  }

  if (state === 'puzzle1') {
    return (
      <div className="app">
        <PuzzleGame />
        <HUD />
      </div>
    )
  }

  if (state === 'escape1') {
    return (
      <div className="app">
        <EscapeRoom1 />
        <HUD />
      </div>
    )
  }

  if (state === 'house1') {
    return (
      <div className="app">
        <House1 />
        <HUD />
      </div>
    )
  }

  return null
}

function App() {
  return (
    <GameStateProvider>
      <SceneRoutingProvider>
        <PlayerProvider>
          <CameraProvider>
            <InteractionProvider>
              <GameScenes />
            </InteractionProvider>
          </CameraProvider>
        </PlayerProvider>
      </SceneRoutingProvider>
    </GameStateProvider>
  )
}

export default App

