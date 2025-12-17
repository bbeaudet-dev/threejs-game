interface CrosshairsProps {
  isHovering?: boolean
}

export default function Crosshairs({ isHovering = false }: CrosshairsProps) {
  const containerStyle: React.CSSProperties = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    pointerEvents: 'none',
    zIndex: 1000,
  }

  const lineBase: React.CSSProperties = {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    transition: 'all 0.2s ease',
  }

  const activeColor = 'rgba(100, 200, 255, 1)'
  const activeShadow = '0 0 8px rgba(100, 200, 255, 0.6)'

  const horizontalStyle: React.CSSProperties = {
    ...lineBase,
    width: '20px',
    height: '2px',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    ...(isHovering
      ? { backgroundColor: activeColor, boxShadow: activeShadow }
      : {}),
  }

  const verticalStyle: React.CSSProperties = {
    ...lineBase,
    width: '2px',
    height: '20px',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    ...(isHovering
      ? { backgroundColor: activeColor, boxShadow: activeShadow }
      : {}),
  }

  const dotStyle: React.CSSProperties = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: isHovering ? '6px' : '4px',
    height: isHovering ? '6px' : '4px',
    backgroundColor: isHovering
      ? activeColor
      : 'rgba(255, 255, 255, 0.8)',
    borderRadius: '50%',
    transition: 'all 0.2s ease',
    boxShadow: isHovering
      ? '0 0 12px rgba(100, 200, 255, 0.8)'
      : 'none',
  }

  return (
    <div style={containerStyle}>
      <div style={horizontalStyle} />
      <div style={verticalStyle} />
      <div style={dotStyle} />
    </div>
  )
}

