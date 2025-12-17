# Three.js Game Development Basics

## What Three.js Is

**Three.js** is a 3D graphics library for the web that:

- Renders 3D scenes in the browser using WebGL/WebGPU
- Provides primitives: meshes, lights, cameras, materials, textures
- Is **low-level**: you build game systems yourself
- Works with JavaScript/TypeScript
- Runs in the browser (or Electron, as we're doing)

**React Three Fiber (R3F)** adds:

- Declarative 3D components (`<mesh>`, `<boxGeometry>`, etc.)
- React hooks for Three.js (`useThree`, `useFrame`)
- Automatic cleanup and lifecycle management
- React patterns in 3D space

## Three.js vs Unity

| Feature       | Three.js                            | Unity                         |
| ------------- | ----------------------------------- | ----------------------------- |
| **Type**      | Graphics library                    | Full game engine              |
| **Level**     | Low-level (build systems yourself)  | High-level (systems built-in) |
| **Platform**  | Web (browser/Electron)              | Native executables            |
| **Language**  | JavaScript/TypeScript               | C#                            |
| **Rendering** | ✅ Built-in                         | ✅ Built-in                   |
| **Physics**   | ❌ Need library (Cannon.js, Rapier) | ✅ Built-in                   |
| **Collision** | ❌ Build yourself                   | ✅ Built-in                   |
| **Audio**     | ❌ Build yourself                   | ✅ Built-in                   |
| **UI**        | ❌ Build yourself                   | ✅ Built-in                   |
| **Editor**    | ❌ Code-only                        | ✅ Visual editor              |

## React Patterns in Three.js Games

### ✅ What Works Like Normal React

**1. Context for State Management**

```typescript
// contexts/PlayerContext.tsx
const PlayerContext = createContext()
export function usePlayer() { ... }

// Usage:
const { getEffectiveMoveSpeed } = usePlayer()
```

**2. Component Composition**

```typescript
<Room>
  <Wall />
  <Door />
  <Table />
</Room>
```

**3. Props and State**

```typescript
function Object({ position, rotation, scale }) {
  const [hovered, setHovered] = useState(false);
  // Standard React patterns
}
```

**4. Event Handling**

```typescript
<mesh onClick={handleClick} />
```

### ⚠️ The Game Loop (Different from React)

**React:** Re-renders when state changes

```typescript
const [count, setCount] = useState(0); // Re-renders on change
```

**Games:** Continuous update loop (60fps)

```typescript
useFrame((state, delta) => {
  // Runs EVERY frame, not just on state change
  updateMovement(delta);
  checkCollisions();
  updatePhysics(delta);
});
```

This is the key difference: games need continuous updates, not just reactive updates.

## Systems You Need to Build

### 1. Player Movement & Controls ✅

**Status:** Built in `components/player/Player.tsx`

**What it does:**

- Handles keyboard input (WASD, Space)
- Manages camera rotation (mouse look)
- Applies movement physics (velocity, gravity)
- Detects ground/ceiling collisions

**Unity equivalent:** CharacterController component

---

### 2. Collision Detection ✅

**Status:** Built in `components/player/Player.tsx`

**What it does:**

- Uses raycasting to detect walls/objects
- Prevents player from moving through solid objects
- Simple single-raycast approach

**Unity equivalent:** CharacterController.collisionFlags, OnControllerColliderHit

**Alternative:** Use Cannon.js physics body for player (see below)

---

### 3. Interaction System ✅

**Status:** Built in `systems/InteractionSystem.tsx`

**What it does:**

- Raycasts to detect what player is looking at
- Manages hover state via React Context
- Triggers interactions (E key, clicks)

**Unity equivalent:** OnMouseOver, OnTriggerEnter

---

### 4. Scene Management ✅

**Status:** Built in `scenes/SceneManager.tsx`

**What it does:**

- Manages scene transitions
- Handles spawn points
- Preserves player state between scenes

**Unity equivalent:** SceneManager.LoadScene

---

### 5. Physics (Objects) ✅

**Status:** Using `@react-three/cannon` in `components/objects/Object.tsx`

**What it does:**

- Physics bodies for objects (boxes, etc.)
- Gravity, forces, collisions
- Syncs physics → visual representation

**Unity equivalent:** Rigidbody component

**Note:** Currently only used for objects, not player. Player uses manual collision.

---

### 6. Audio System ❌

**Status:** Not yet built

**What you'll need:**

- Audio context management
- 3D positional audio (howler.js or three.js Audio)
- Sound effect triggers
- Music management

**Pattern:** React Context + hooks

```typescript
const AudioContext = createContext()
function useAudio() { ... }
```

**Unity equivalent:** AudioSource component

---

### 7. Save/Load System ❌

**Status:** Not yet built

**What you'll need:**

- Game state serialization
- LocalStorage or file I/O
- Save/load UI

**Pattern:** React Context + localStorage

**Unity equivalent:** PlayerPrefs, Save System

---

### 8. Inventory/Item System ⚠️

**Status:** Partially built (items array in PlayerContext)

**What you'll need:**

- Item data structures
- Inventory state management
- Item interactions

**Pattern:** React Context (already have PlayerContext with items!)

**Unity equivalent:** Inventory system (usually custom)

---

### 9. Dialogue/Text System ⚠️

**Status:** Partially built (MessageDisplay component)

**What you'll need:**

- Text rendering (HTML overlay or 3D text)
- Dialogue tree management
- UI state management

**Pattern:** React components (you have MessageDisplay already!)

**Unity equivalent:** UI Text, Dialogue System

## Using Cannon.js for Player Physics

**Yes!** You can use Cannon.js for player physics instead of manual collision detection.

### Current Approach (Manual)

- Manual raycasting for collision detection
- Manual movement calculation
- Manual ground/ceiling detection
- More control, more code

### Cannon.js Approach (Physics-Based)

- Physics body for player (like objects)
- Automatic collision detection
- Automatic physics simulation
- Less code, less control

### When to Use Each

**Manual Collision (Current):**

- ✅ More control over movement feel
- ✅ Easier to fine-tune player behavior
- ✅ Better for first-person games
- ❌ More code to maintain
- ❌ More bugs to fix

**Cannon.js Physics:**

- ✅ Less code
- ✅ Automatic collision handling
- ✅ Consistent with object physics
- ❌ Less control over feel
- ❌ Can feel "floaty" for FPS games

### Recommendation

For a first-person exploration game like yours, **manual collision is often better** because:

- You want precise control over movement feel
- FPS games need tight, responsive controls
- You don't need complex physics interactions

However, you could use Cannon.js for:

- **Objects** (already doing this ✅)
- **Complex physics interactions** (pushing objects, etc.)

## Architecture Overview

```
src/
├── components/     # 3D React components (meshes, objects)
│   ├── player/    # Player controller
│   ├── objects/   # Game objects (tables, chairs, etc.)
│   ├── walls/     # Room structure
│   └── hud/       # UI overlays
├── contexts/      # React Context for state management
├── systems/       # Game systems (interactions, etc.)
├── scenes/        # Scene definitions
├── config/        # Configuration constants
└── utils/         # Helper functions
```

## Key Concepts

### 1. The Game Loop

```typescript
useFrame((state, delta) => {
  // Runs 60 times per second
  // delta = time since last frame (in seconds)
  updateMovement(delta);
});
```

### 2. React Context for Game State

```typescript
// Global state accessible anywhere
const { currentScene } = useScene();
const { attributes } = usePlayer();
```

### 3. Physics Integration

```typescript
// Physics body
const [ref, api] = useBox(() => ({ mass: 1 }));

// Sync physics → visuals
api.position.subscribe(([x, y, z]) => {
  meshRef.current.position.set(x, y, z);
});
```

### 4. Raycasting for Interactions

```typescript
const raycaster = new THREE.Raycaster();
raycaster.setFromCamera(mouse, camera);
const intersects = raycaster.intersectObjects(scene.children);
```

## Resources

- [Three.js Documentation](https://threejs.org/docs/)
- [React Three Fiber Documentation](https://docs.pmnd.rs/react-three-fiber/)
- [Cannon.js Documentation](https://github.com/pmndrs/cannon-es)
- [React Three Fiber Examples](https://docs.pmnd.rs/react-three-fiber/getting-started/examples)
