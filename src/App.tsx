import HUD from './components/hud/HUD'
import { InteractionProvider } from './systems/InteractionSystem'
import { PlayerProvider } from './contexts/PlayerContext'
import { CameraProvider } from './contexts/CameraContext'
import { SceneProvider, useScene } from './scenes/SceneManager'
import Room1 from './scenes/Room1'
import Room2 from './scenes/Room2'
import Room3 from './scenes/Room3'
import './App.css'

function AppContent() {
  const { currentScene } = useScene()
  
  return (
    <div className="app">
      {currentScene === 'room1' && <Room1 />}
      {currentScene === 'room2' && <Room2 />}
      {currentScene === 'room3' && <Room3 />}
      <HUD />
    </div>
  )
}

function App() {
  return (
    <SceneProvider>
      <PlayerProvider>
        <CameraProvider>
          <InteractionProvider>
            <AppContent />
          </InteractionProvider>
        </CameraProvider>
      </PlayerProvider>
    </SceneProvider>
  )
}

export default App

