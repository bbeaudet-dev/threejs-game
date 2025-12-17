import { useInteraction } from '../../systems/InteractionSystem'
import { usePlayer } from '../../contexts/PlayerContext'

interface InteractiveObjectInfo {
  id: string
  actionText: string
  actionKey?: string
}

// This would be populated by interactive objects
const interactiveObjects: Map<string, InteractiveObjectInfo> = new Map()

export function registerInteractiveObject(id: string, info: InteractiveObjectInfo) {
  interactiveObjects.set(id, info)
}

export function unregisterInteractiveObject(id: string) {
  interactiveObjects.delete(id)
}

export default function InteractionTooltip() {
  const { hoveredObject } = useInteraction()
  const { getEffectiveInteractionDistance } = usePlayer()

  if (!hoveredObject) return null

  const objectInfo = interactiveObjects.get(hoveredObject)
  if (!objectInfo) return null

  const containerStyle: React.CSSProperties = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, calc(-50% - 60px))',
    pointerEvents: 'none',
    zIndex: 1001,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: '8px 16px',
    borderRadius: '6px',
    fontFamily: 'monospace',
    fontSize: '14px',
    color: '#fff',
  }

  const keyStyle: React.CSSProperties = {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    padding: '4px 8px',
    borderRadius: '4px',
    minWidth: '24px',
    textAlign: 'center',
    fontWeight: 'bold',
  }

  return (
    <div style={containerStyle}>
      <span style={keyStyle}>{objectInfo.actionKey || 'E'}</span>
      <span>{objectInfo.actionText}</span>
    </div>
  )
}

