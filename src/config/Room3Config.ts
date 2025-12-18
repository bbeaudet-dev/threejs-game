import * as THREE from 'three'

export interface PlanetConfig {
  position: THREE.Vector3
  radius: number
  mass: number
  color: string
}

export const ROOM3_PLANETS: PlanetConfig[] = [
  {
    position: new THREE.Vector3(0, 10, 0), // central star
    radius: 4,
    mass: 80,
    color: '#FFD700',
  },
  {
    position: new THREE.Vector3(18, 11, 0),
    radius: 2.2,
    mass: 35,
    color: '#4ECDC4',
  },
  {
    position: new THREE.Vector3(-24, 13, -12),
    radius: 2.6,
    mass: 42,
    color: '#FF6B6B',
  },
  {
    position: new THREE.Vector3(14, 15, 22),
    radius: 2,
    mass: 32,
    color: '#AA96DA',
  },
  {
    position: new THREE.Vector3(-20, 9, 18),
    radius: 1.8,
    mass: 26,
    color: '#1ABC9C',
  },
  {
    position: new THREE.Vector3(26, 12, -20),
    radius: 2.4,
    mass: 38,
    color: '#F39C12',
  },
  {
    position: new THREE.Vector3(-10, 18, 0),
    radius: 1.5,
    mass: 24,
    color: '#3498DB',
  },
]


