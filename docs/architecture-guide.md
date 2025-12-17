# Architecture Guide: When to Use What

## The Key Question: "Does this change during gameplay?"

### ✅ **config/** - Static Constants (Never Changes)

**Use for:** Values that are fixed and never change during gameplay

**Examples:**

- Player dimensions (height, width, depth)
- Collision buffers
- Physical constants (gravity, friction)
- Base movement values (starting speed, jump height)
- Default spawn positions
- Room dimensions

**Why separate from Context?**

- These are **design constants**, not game state
- They're used by multiple systems
- Easy to tweak without touching game logic

```typescript
// config/PlayerConfig.ts
export const PLAYER_HEIGHT = 1.8; // Never changes
export const GRAVITY = -9.81; // Never changes
export const BASE_MOVE_SPEED = 1.25; // Starting value (constant)
```

---

### 🔄 **contexts/** - Runtime State (Changes During Gameplay)

**Use for:** State that changes as the player plays

**Examples:**

- Player multipliers (speed multiplier, jump multiplier)
- Current scene
- Camera rotation
- Hovered objects
- Inventory items
- Player attributes that can be modified

**Why separate from Config?**

- These are **game state**, not constants
- They change based on player actions
- Need React state management (useState, Context)

```typescript
// contexts/PlayerContext.tsx
const DEFAULT_ATTRIBUTES = {
  baseMoveSpeed: BASE_MOVE_SPEED, // From config (constant)
  moveSpeedMultiplier: 1, // Changes when player gets speed boost
  items: [], // Changes when player picks up items
};
```

**The Difference:**

- `PlayerConfig.BASE_MOVE_SPEED` = Starting constant (never changes)
- `PlayerContext.moveSpeedMultiplier` = Runtime state (changes with items/effects)

---

### 🎨 **components/** - React Components (Render Things)

**Use for:** Things that render to the screen

**Examples:**

- 3D objects (meshes, groups)
- UI elements (HUD, buttons)
- Scene structures (rooms, walls)

**When to put logic here:**

- Component-specific behavior
- Event handlers (onClick, etc.)
- Visual effects (animations, hover)
- Component-specific constants (only used in that component)

**When NOT to put logic here:**

- Reusable logic → move to hooks
- Pure calculations → move to utils
- Global state → move to contexts

---

### 🪝 **hooks/** - Reusable Logic (Custom React Hooks)

**Use for:** Logic that multiple components need

**Examples:**

- `useWoodTexture()` - Creates textures
- `usePlayer()` - Accesses player context
- `useScene()` - Accesses scene context

**Pattern:**

```typescript
// hooks/useSomething.ts
export function useSomething() {
  // Reusable logic here
  return { value, setValue };
}
```

**When to create a hook:**

- Logic used in 2+ components
- Wraps Context access
- Provides computed values

---

### 🛠️ **utils/** - Pure Functions (No State)

**Use for:** Helper functions that don't need React

**Examples:**

- Math calculations
- Data transformations
- Formatting functions
- Pure computations

**Pattern:**

```typescript
// utils/helpers.ts
export function calculateDistance(a: Vector3, b: Vector3): number {
  return a.distanceTo(b);
}
```

**When to use utils:**

- Pure functions (same input = same output)
- No React dependencies
- Can be tested easily

---

### ⚙️ **systems/** - Game Systems (Complex Logic)

**Use for:** Major game systems that manage state/behavior

**Examples:**

- Interaction system (manages hover state)
- Physics system (if you build your own)
- Audio system
- Save/load system

**Pattern:**

```typescript
// systems/InteractionSystem.tsx
export function InteractionProvider({ children }) {
  const [hoveredObject, setHoveredObject] = useState(null);
  return (
    <InteractionContext.Provider value={{ hoveredObject, setHoveredObject }}>
      {children}
    </InteractionContext.Provider>
  );
}
```

**When to create a system:**

- Manages global game state
- Coordinates multiple components
- Complex behavior that needs its own file

---

## Decision Tree

```
Is this a constant that never changes?
├─ YES → config/
└─ NO → Does it change during gameplay?
    ├─ YES → contexts/ or systems/
    └─ NO → Is it a React component?
        ├─ YES → components/
        └─ NO → Is it reusable logic?
            ├─ YES → hooks/
            └─ NO → utils/
```

---

## Common Patterns

### Movement Constants

```typescript
// config/PlayerConfig.ts
export const GRAVITY = -9.81; // Physical constant
export const LOOK_SENSITIVITY = 0.002; // Design constant
export const BASE_MOVE_SPEED = 1.25; // Starting value (constant)
```

### Movement State

```typescript
// components/player/Player.tsx
const velocity = useRef(new THREE.Vector3()); // Component-specific state
const moveForward = useRef(false); // Component-specific state
```

### Player Attributes (Runtime)

```typescript
// contexts/PlayerContext.tsx
const DEFAULT_ATTRIBUTES = {
  baseMoveSpeed: BASE_MOVE_SPEED, // From config (constant)
  moveSpeedMultiplier: 1, // Changes during gameplay (must be context)
};
```

---

## Specific Examples from Your Code

### ✅ Correct: PlayerConfig.ts

```typescript
export const PLAYER_HEIGHT = 1.8; // Physical constant
export const COLLISION_BUFFER = 0.15; // Design constant
export const GRAVITY = -9.81; // Physical constant
export const BASE_MOVE_SPEED = 1.25; // Starting value (constant)
export const BASE_JUMP_HEIGHT = 5.0; // Starting value (constant)
```

**Why:** These never change during gameplay

### ✅ Correct: PlayerContext.tsx

```typescript
const DEFAULT_ATTRIBUTES = {
  baseMoveSpeed: BASE_MOVE_SPEED, // From config
  moveSpeedMultiplier: 1, // Changes with items
  items: [], // Changes when picking up items
};
```

**Why:** Multipliers and items change during gameplay

### ✅ Correct: Player.tsx (component constants)

```typescript
const LOOK_SENSITIVITY = 0.002; // Component-specific constant
const RAYCASTER_INTERVAL = 100; // Component-specific constant
```

**Why:** Only used in this component, not shared

---

## Quick Reference

| What               | Where         | Example                               |
| ------------------ | ------------- | ------------------------------------- |
| Physical constants | `config/`     | `PLAYER_HEIGHT`, `GRAVITY`            |
| Design constants   | `config/`     | `COLLISION_BUFFER`, `BASE_MOVE_SPEED` |
| Runtime state      | `contexts/`   | `moveSpeedMultiplier`, `items`        |
| Starting values    | `config/`     | `BASE_MOVE_SPEED`, `BASE_JUMP_HEIGHT` |
| Component logic    | `components/` | Movement code, event handlers         |
| Reusable logic     | `hooks/`      | `usePlayer()`, `useWoodTexture()`     |
| Pure functions     | `utils/`      | Math helpers, formatters              |
| Game systems       | `systems/`    | Interaction system, physics system    |

---

## The Golden Rule

**If it changes during gameplay → Context/State**
**If it never changes → Config/Constants**
**If it's reusable → Hook/Util**
**If it renders → Component**
