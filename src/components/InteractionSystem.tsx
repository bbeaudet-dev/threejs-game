import { createContext, useContext, useState, ReactNode } from 'react'

interface InteractionContextType {
  hoveredObject: string | null
  setHoveredObject: (id: string | null) => void
}

const InteractionContext = createContext<InteractionContextType | null>(null)

export function useInteraction() {
  const context = useContext(InteractionContext)
  if (!context) {
    throw new Error('useInteraction must be used within InteractionProvider')
  }
  return context
}

export function InteractionProvider({ children }: { children: ReactNode }) {
  const [hoveredObject, setHoveredObject] = useState<string | null>(null)

  return (
    <InteractionContext.Provider value={{ hoveredObject, setHoveredObject }}>
      {children}
    </InteractionContext.Provider>
  )
}

