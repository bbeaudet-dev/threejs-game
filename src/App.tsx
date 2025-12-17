import Scene from './components/Scene'
import Crosshairs from './components/Crosshairs'
import { InteractionProvider, useInteraction } from './components/InteractionSystem'
import './App.css'

function AppContent() {
  const { hoveredObject } = useInteraction()
  
  return (
    <div className="app">
      <Scene />
      <Crosshairs isHovering={hoveredObject !== null} />
    </div>
  )
}

function App() {
  return (
    <InteractionProvider>
      <AppContent />
    </InteractionProvider>
  )
}

export default App

