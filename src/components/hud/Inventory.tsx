import { usePlayer } from '../../contexts/PlayerContext'

export default function Inventory() {
  const { attributes } = usePlayer()
  const items = attributes.items

  if (items.length === 0) {
    return null
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 20,
        right: 20,
        background: 'rgba(0, 0, 0, 0.7)',
        border: '2px solid #4A4A4A',
        borderRadius: 8,
        padding: 12,
        minWidth: 150,
        zIndex: 100,
        fontFamily: '"Courier New", monospace',
        color: '#FFFFFF',
      }}
    >
      <div
        style={{
          fontSize: 14,
          fontWeight: 'bold',
          marginBottom: 8,
          color: '#FFD700',
          textTransform: 'uppercase',
          letterSpacing: 1,
        }}
      >
        Inventory
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
        }}
      >
        {items.map((itemId) => (
          <div
            key={itemId}
            style={{
              background: 'rgba(255, 215, 0, 0.1)',
              border: '1px solid rgba(255, 215, 0, 0.3)',
              borderRadius: 4,
              padding: '6px 10px',
              fontSize: 12,
              textTransform: 'capitalize',
            }}
          >
            {itemId}
          </div>
        ))}
      </div>
    </div>
  )
}

