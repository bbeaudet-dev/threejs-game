import { useCamera } from '../../contexts/CameraContext'
import { useRef, useState, useEffect } from 'react'

export default function Compass() {
  const { yaw } = useCamera()
  const prevRotationRef = useRef<number | null>(null)
  const [smoothRotation, setSmoothRotation] = useState(0)

  // Convert yaw to degrees and normalize to 0-360
  const yawDegrees = ((yaw * 180) / Math.PI + 360) % 360

  // Handle smooth rotation wrap-around (359 -> 0 -> 1)
  useEffect(() => {
    if (prevRotationRef.current === null) {
      // First render
      prevRotationRef.current = yawDegrees
      setSmoothRotation(yawDegrees)
      return
    }

    const prev = prevRotationRef.current
    let newRotation = yawDegrees
    
    // Calculate the difference
    let diff = newRotation - prev
    
    // If the difference is > 180, we wrapped around - take the shorter path
    if (Math.abs(diff) > 180) {
      if (diff > 0) {
        // Wrapped from high to low (359 -> 0), go backwards
        newRotation = prev + (diff - 360)
      } else {
        // Wrapped from low to high (0 -> 359), go forwards
        newRotation = prev + (diff + 360)
      }
    } else {
      newRotation = prev + diff
    }
    
    prevRotationRef.current = newRotation
    setSmoothRotation(newRotation)
  }, [yaw, yawDegrees])

  // Calculate rotation for compass needle (needle points north, so rotate opposite of yaw)
  const needleRotation = -smoothRotation

  const containerStyle: React.CSSProperties = {
    position: 'fixed',
    top: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    pointerEvents: 'none',
    zIndex: 1002,
  }

  const compassStyle: React.CSSProperties = {
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    border: '2px solid rgba(255, 255, 255, 0.5)',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }

  const needleStyle: React.CSSProperties = {
    position: 'absolute',
    width: '2px',
    height: '40px',
    backgroundColor: '#ff4444',
    top: '50%',
    left: '50%',
    transformOrigin: 'center bottom',
    transform: `translate(-50%, -100%) rotate(${needleRotation}deg)`,
    transition: 'transform 0.1s ease-out',
  }

  const northMarkerStyle: React.CSSProperties = {
    position: 'absolute',
    top: '8px',
    left: '50%',
    transform: 'translateX(-50%)',
    color: '#fff',
    fontSize: '12px',
    fontWeight: 'bold',
  }

  const directionLabels = ['N', 'E', 'S', 'W']
  const directionAngles = [0, 90, 180, 270]

  return (
    <div style={containerStyle}>
      <div style={compassStyle}>
        {/* Direction labels */}
        {directionLabels.map((label, i) => {
          const angle = directionAngles[i]
          const rad = (angle * Math.PI) / 180
          const radius = 45
          const x = Math.sin(rad) * radius
          const y = -Math.cos(rad) * radius
          
          return (
            <div
              key={label}
              style={{
                position: 'absolute',
                left: `calc(50% + ${x}px)`,
                top: `calc(50% + ${y}px)`,
                transform: 'translate(-50%, -50%)',
                color: '#fff',
                fontSize: '10px',
                fontWeight: label === 'N' ? 'bold' : 'normal',
              }}
            >
              {label}
            </div>
          )
        })}
        
        {/* North marker */}
        <div style={northMarkerStyle}>N</div>
        
        {/* Compass needle (points north) */}
        <div style={needleStyle} />
        
        {/* Center dot */}
        <div
          style={{
            width: '4px',
            height: '4px',
            borderRadius: '50%',
            backgroundColor: '#fff',
            position: 'absolute',
          }}
        />
        
        {/* Yaw display */}
        <div
          style={{
            position: 'absolute',
            bottom: '8px',
            left: '50%',
            transform: 'translateX(-50%)',
            color: '#aaa',
            fontSize: '10px',
            fontFamily: 'monospace',
          }}
        >
          {Math.round(((yaw * 180) / Math.PI + 360) % 360)}°
        </div>
      </div>
      {/* Height display underneath compass */}
      <HeightDisplay />
    </div>
  )
}

// Height display component
function HeightDisplay() {
  const { height } = useCamera()
  
  return (
    <div
      style={{
        marginTop: '8px',
        color: '#aaa',
        fontSize: '10px',
        fontFamily: 'monospace',
        textAlign: 'center',
      }}
    >
      Y: {height.toFixed(2)}m
    </div>
  )
}

