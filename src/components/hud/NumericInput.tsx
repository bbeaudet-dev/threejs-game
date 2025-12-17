import { Html } from '@react-three/drei'
import { useState } from 'react'

interface NumericInputProps {
  question: string
  onSubmit: (answer: string) => void
  onCancel: () => void
}

export default function NumericInput({ question, onSubmit, onCancel }: NumericInputProps) {
  const [value, setValue] = useState('')

  const handleDigit = (digit: string) => {
    if (value.length >= 6) return
    setValue(prev => prev + digit)
  }

  const handleClear = () => {
    setValue('')
  }

  const handleEnter = () => {
    onSubmit(value)
    setValue('')
  }

  const buttonStyle: React.CSSProperties = {
    width: 60,
    height: 40,
    margin: 4,
    background: '#222',
    color: '#0f0',
    border: '1px solid #0f0',
    borderRadius: 4,
    fontSize: 18,
    cursor: 'pointer',
  }

  return (
    <Html fullscreen>
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'rgba(0, 0, 0, 0.9)',
          padding: 20,
          borderRadius: 10,
          border: '2px solid #00FF00',
          zIndex: 1000,
          minWidth: 320,
        }}
      >
        <div style={{ color: '#00FF00', marginBottom: 10, fontSize: 18 }}>
          {question}
        </div>
        <div
          style={{
            marginBottom: 12,
            padding: '8px 10px',
            background: '#111',
            borderRadius: 4,
            border: '1px solid #00FF00',
            color: '#00FF00',
            fontSize: 20,
            minHeight: 32,
          }}
        >
          {value || '\u00A0'}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
            <button
              key={n}
              type="button"
              style={buttonStyle}
              onClick={() => handleDigit(String(n))}
            >
              {n}
            </button>
          ))}
          <button
            type="button"
            style={buttonStyle}
            onClick={() => handleDigit('0')}
          >
            0
          </button>
          <button
            type="button"
            style={{ ...buttonStyle, background: '#444', borderColor: '#aaa' }}
            onClick={handleClear}
          >
            Clear
          </button>
          <button
            type="button"
            style={{ ...buttonStyle, background: '#00FF00', color: '#000' }}
            onClick={handleEnter}
          >
            Enter
          </button>
        </div>
        <div style={{ marginTop: 10, textAlign: 'right' }}>
          <button
            type="button"
            style={{
              padding: '6px 12px',
              background: '#666',
              color: '#fff',
              border: 'none',
              borderRadius: 4,
              cursor: 'pointer',
              fontSize: 14,
            }}
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </div>
    </Html>
  )
}


