import { useMemo } from 'react'
import * as THREE from 'three'

export function useWoodTexture(baseColor: string = '#8B7355') {
  return useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 512
    const ctx = canvas.getContext('2d')!
    
    ctx.fillStyle = baseColor
    ctx.fillRect(0, 0, 512, 512)
    
    // Extract RGB values for stroke color
    const r = parseInt(baseColor.slice(1, 3), 16)
    const g = parseInt(baseColor.slice(3, 5), 16)
    const b = parseInt(baseColor.slice(5, 7), 16)
    
    for (let i = 0; i < 20; i++) {
      ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${0.3 + Math.random() * 0.2})`
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(0, i * 25.6)
      ctx.lineTo(512, i * 25.6 + Math.sin(i) * 10)
      ctx.stroke()
    }
    
    const texture = new THREE.CanvasTexture(canvas)
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    texture.repeat.set(4, 4)
    return texture
  }, [baseColor])
}

export function useWallTexture(color: string = '#D4A574') {
  return useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 256
    canvas.height = 256
    const ctx = canvas.getContext('2d')!
    
    ctx.fillStyle = color
    ctx.fillRect(0, 0, 256, 256)
    
    for (let i = 0; i < 50; i++) {
      ctx.fillStyle = `rgba(${parseInt(color.slice(1, 3), 16)}, ${parseInt(color.slice(3, 5), 16)}, ${parseInt(color.slice(5, 7), 16)}, ${0.1 + Math.random() * 0.1})`
      ctx.fillRect(
        Math.random() * 256,
        Math.random() * 256,
        Math.random() * 20,
        Math.random() * 20
      )
    }
    
    const texture = new THREE.CanvasTexture(canvas)
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    texture.repeat.set(2, 2)
    return texture
  }, [color])
}

export function useCeilingTexture(color: string = '#E8D5B7') {
  return useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 256
    canvas.height = 256
    const ctx = canvas.getContext('2d')!
    
    ctx.fillStyle = color
    ctx.fillRect(0, 0, 256, 256)
    
    for (let i = 0; i < 10; i++) {
      ctx.strokeStyle = `rgba(${parseInt(color.slice(1, 3), 16)}, ${parseInt(color.slice(3, 5), 16)}, ${parseInt(color.slice(5, 7), 16)}, ${0.2})`
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.arc(
        Math.random() * 256,
        Math.random() * 256,
        Math.random() * 30,
        0,
        Math.PI * 2
      )
      ctx.stroke()
    }
    
    const texture = new THREE.CanvasTexture(canvas)
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    texture.repeat.set(4, 4)
    return texture
  }, [color])
}

