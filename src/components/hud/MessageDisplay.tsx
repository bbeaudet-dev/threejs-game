import { useState, useEffect } from 'react'

interface Message {
  id: string
  text: string
  duration?: number
  type?: 'default' | 'success'
}

let messageIdCounter = 0
const messageQueue: Message[] = []
let messageListeners: Set<(messages: Message[]) => void> = new Set()

export function showMessage(text: string, duration: number = 3000, type: 'default' | 'success' = 'default') {
  const message: Message = {
    id: `msg-${messageIdCounter++}`,
    text,
    duration,
    type,
  }
  messageQueue.push(message)
  messageListeners.forEach(listener => listener([...messageQueue]))
  
  setTimeout(() => {
    const index = messageQueue.findIndex(m => m.id === message.id)
    if (index !== -1) {
      messageQueue.splice(index, 1)
      messageListeners.forEach(listener => listener([...messageQueue]))
    }
  }, duration)
}

export default function MessageDisplay() {
  const [messages, setMessages] = useState<Message[]>([])

  useEffect(() => {
    const listener = (newMessages: Message[]) => {
      setMessages(newMessages)
    }
    messageListeners.add(listener)
    return () => {
      messageListeners.delete(listener)
    }
  }, [])

  if (messages.length === 0) return null

  const containerStyle: React.CSSProperties = {
    position: 'fixed',
    bottom: '80px', 
    left: '50%',
    transform: 'translateX(-50%)',
    pointerEvents: 'none',
    zIndex: 1001,
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    alignItems: 'center',
  }

  const baseMessageStyle: React.CSSProperties = {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    color: '#fff',
    padding: '12px 20px',
    borderRadius: '6px',
    fontFamily: 'monospace',
    fontSize: '14px',
    maxWidth: '400px',
    textAlign: 'center',
    animation: 'fadeIn 0.3s ease-in',
  }

  return (
    <div style={containerStyle}>
      {messages.map(message => {
        const style =
          message.type === 'success'
            ? {
                ...baseMessageStyle,
                backgroundColor: 'rgba(0, 80, 0, 0.9)',
                border: '2px solid #00FF88',
              }
            : baseMessageStyle
        return (
          <div key={message.id} style={style}>
            {message.text}
          </div>
        )
      })}
    </div>
  )
}

