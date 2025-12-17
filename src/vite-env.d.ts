/// <reference types="vite/client" />

interface Window {
  electronAPI: {
    onMessage: (callback: (message: string) => void) => void
  }
}

