import HUD from './components/hud/HUD'
import { InteractionProvider } from './systems/InteractionSystem'
import { PlayerProvider } from './contexts/PlayerContext'
import { CameraProvider } from './contexts/CameraContext'
import { SceneProvider, useScene } from './scenes/SceneManager'
import { GameStateProvider, useGameState } from './contexts/GameStateContext'
import MainMenu from './components/menu/MainMenu'
import Room1 from './scenes/Room1'
import Room2 from './scenes/Room2'
import Room3 from './scenes/Room3'
import EscapeRoom1 from './scenes/EscapeRoom1'
import './App.css'

function GameScenes() {
  const { state } = useGameState()
  const { currentScene } = useScene()

  if (state === 'menu') {
    return <MainMenu />
  }

  if (state === 'puzzle1') {
    return (
      <div className="app">
        {currentScene === 'room1' && <Room1 />}
        {currentScene === 'room2' && <Room2 />}
        {currentScene === 'room3' && <Room3 />}
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

  return null
}

function App() {
  return (
    <GameStateProvider>
      <SceneProvider>
        <PlayerProvider>
          <CameraProvider>
            <InteractionProvider>
              <GameScenes />
            </InteractionProvider>
          </CameraProvider>
        </PlayerProvider>
      </SceneProvider>
    </GameStateProvider>
  )
}

export default App

