import { createContext, useContext, useState, ReactNode } from 'react'

type GameState = 'menu' | 'playing'

interface GameStateContextType {
  state: GameState
  startGame: () => void
  returnToMenu: () => void
}

const GameStateContext = createContext<GameStateContextType | null>(null)

export function useGameState() {
  const ctx = useContext(GameStateContext)
  if (!ctx) {
    throw new Error('useGameState must be used within GameStateProvider')
  }
  return ctx
}

export function GameStateProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<GameState>('menu')

  const startGame = () => setState('playing')
  const returnToMenu = () => setState('menu')

  return (
    <GameStateContext.Provider value={{ state, startGame, returnToMenu }}>
      {children}
    </GameStateContext.Provider>
  )
}


