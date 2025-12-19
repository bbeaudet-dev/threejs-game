import { useInteraction } from '../../systems/InteractionSystem'
import { useSceneRouting } from '../../scenes/SceneRouting'

export default function DebugHUD() {
  const { hoveredObject } = useInteraction()
  const { currentScene } = useSceneRouting()

  const containerStyle: React.CSSProperties = {
    position: 'fixed',
    top: '10px',
    left: '10px',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    color: '#fff',
    padding: '12px',
    borderRadius: '8px',
    fontFamily: 'monospace',
    fontSize: '12px',
    zIndex: 1001,
    pointerEvents: 'none',
    minWidth: '200px',
  }

  const labelStyle: React.CSSProperties = {
    color: '#aaa',
    marginRight: '8px',
  }

  const valueStyle: React.CSSProperties = {
    color: hoveredObject ? '#64c8ff' : '#fff',
  }

  return (
    <div style={containerStyle}>
      <div style={{ marginBottom: '8px' }}>
        <span style={labelStyle}>Scene:</span>
        <span style={{ color: '#fff' }}>{currentScene}</span>
      </div>
      <div style={{ marginBottom: '8px' }}>
        <span style={labelStyle}>Hovered:</span>
        <span style={valueStyle}>{hoveredObject || 'None'}</span>
      </div>
      <div style={{ marginBottom: '8px' }}>
        <span style={labelStyle}>Controls:</span>
        <div style={{ marginLeft: '12px', fontSize: '11px', color: '#888' }}>
          <div>WASD - Move</div>
          <div>Mouse - Look</div>
          <div>E - Interact</div>
          <div>ESC - Unlock mouse</div>
        </div>
      </div>
      {hoveredObject && (
        <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid #444' }}>
          <div style={{ color: '#64c8ff', fontSize: '11px' }}>
            Press E to interact
          </div>
        </div>
      )}
    </div>
  )
}

