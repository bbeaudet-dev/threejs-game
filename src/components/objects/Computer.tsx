import { useState, useEffect } from 'react'
import Object from './Object'
import { showMessage } from '../hud/MessageDisplay'
import NumericInput from '../hud/NumericInput'
import { usePlayer } from '../../contexts/PlayerContext'

interface ComputerProps {
  position: [number, number, number]
  question: string
  correctAnswer: string
  onCorrect?: () => void
}

export default function Computer({ 
  position, 
  question, 
  correctAnswer,
  onCorrect 
}: ComputerProps) {
  const [isActive, setIsActive] = useState(false)
  const { addItem } = usePlayer()

  const handleInteract = () => {
    setIsActive(true)
    showMessage('')
  }

  const handleSubmitAnswer = (answer: string) => {
    if (answer.toLowerCase().trim() === correctAnswer.toLowerCase().trim()) {
      showMessage('You hear a click somewhere.')
      addItem('room3-door-key')
      setIsActive(false)
      if (onCorrect) {
        onCorrect()
      }
    } else {
      showMessage('Incorrect. Try again.')
    }
  }

  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && isActive) {
      setIsActive(false)
      showMessage('')
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', handleEscape)
    return () => {
      window.removeEventListener('keydown', handleEscape)
    }
  }, [isActive])

  return (
    <>
      <Object
        position={position}
        color="#00FF00"
        interactive={true}
        name="Computer Terminal"
        description="A computer terminal. Press E to interact."
        interactionConfig={{ 
          actionText: 'Use', 
          actionKey: 'E',
          distance: 'medium'
        }}
        onInteract={handleInteract}
      >
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1, 0.8, 0.5]} />
          <meshStandardMaterial color="#2A2A2A" />
        </mesh>
        <mesh position={[0, 0.1, 0.26]} castShadow>
          <boxGeometry args={[0.9, 0.6, 0.05]} />
          <meshStandardMaterial color="#000000" />
        </mesh>
      </Object>
      
      {isActive && (
        <NumericInput
          question={question}
          onSubmit={handleSubmitAnswer}
          onCancel={() => {
            setIsActive(false)
            showMessage('')
          }}
        />
      )}
    </>
  )
}

