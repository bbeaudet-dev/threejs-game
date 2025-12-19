import { createContext, useContext, useState, ReactNode } from 'react'

type GameState = 'menu' | 'puzzle1' | 'escape1' | 'house1'

interface GameStateContextType {
  state: GameState
  startPuzzle1: () => void
  startEscape1: () => void
  startHouse1: () => void
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

  const startPuzzle1 = () => setState('puzzle1')
  const startEscape1 = () => setState('escape1')
  const startHouse1 = () => setState('house1')
  const returnToMenu = () => setState('menu')

  return (
    <GameStateContext.Provider value={{ state, startPuzzle1, startEscape1, startHouse1, returnToMenu }}>
      {children}
    </GameStateContext.Provider>
  )
}
