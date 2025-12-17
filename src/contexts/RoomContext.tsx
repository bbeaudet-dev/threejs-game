import { createContext, useContext, ReactNode } from 'react'

export interface RoomProperties {
  roomWidth: number  // X dimension
  roomHeight: number // Y dimension 
  roomLength: number // Z dimension
}

const RoomContext = createContext<RoomProperties | null>(null)

export function useRoom(): RoomProperties {
  const context = useContext(RoomContext)
  if (!context) {
    throw new Error('useRoom must be used within RoomProvider')
  }
  return context
}

export function RoomProvider({ 
  children, 
  properties 
}: { 
  children: ReactNode
  properties: RoomProperties 
}) {
  return (
    <RoomContext.Provider value={properties}>
      {children}
    </RoomContext.Provider>
  )
}

