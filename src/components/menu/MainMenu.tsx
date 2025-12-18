import { useGameState } from '../../contexts/GameStateContext'

export default function MainMenu() {
  const { startPuzzle1, startEscape1 } = useGameState()

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(circle at top, #222 0, #000 60%)',
        color: '#FFFFFF',
        fontFamily: '"Segoe UI", system-ui, -apple-system, sans-serif',
      }}
    >
      <div
        style={{
          textAlign: 'center',
          padding: 32,
          borderRadius: 12,
          border: '2px solid #444',
          background: 'rgba(0, 0, 0, 0.85)',
          minWidth: 320,
        }}
      >
        <div
          style={{
            fontSize: 28,
            fontWeight: 700,
            marginBottom: 8,
            letterSpacing: 2,
            textTransform: 'uppercase',
          }}
        >
          Knowledge Room
        </div>
        <div
          style={{
            fontSize: 14,
            marginBottom: 24,
            color: '#CCCCCC',
          }}
        >
          Choose a puzzle to play
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <button
            type="button"
            onClick={startPuzzle1}
            style={{
              padding: '10px 32px',
              fontSize: 16,
              fontWeight: 600,
              borderRadius: 999,
              border: 'none',
              cursor: 'pointer',
              background: '#00FFAA',
              color: '#000',
              boxShadow: '0 0 16px rgba(0, 255, 170, 0.5)',
            }}
          >
            Simple Puzzle Game
          </button>
          <button
            type="button"
            onClick={startEscape1}
            style={{
              padding: '10px 32px',
              fontSize: 16,
              fontWeight: 600,
              borderRadius: 999,
              border: '1px solid #666',
              cursor: 'pointer',
              background: '#111',
              color: '#FFFFFF',
            }}
          >
            Escape Room
          </button>
        </div>
      </div>
    </div>
  )
}


