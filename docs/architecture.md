# Arcade Architecture

The arcade is designed as a client-only software platform rather than disconnected mini-games.

## Shared systems

```text
User Input
  ↓
InputManager
  ↓
BaseGame loop
  ↓
Game-specific update/AI/simulation
  ↓
Canvas renderer
  ↓
StorageManager / AudioEngine
```

## File-protocol compatibility

The lobby does not call `fetch()` and does not load JSON at runtime. Game metadata is embedded directly in `js/main.js`.

## Intelligent games 11–15

- **Adaptive Tower Defense:** adaptive wave director observes leaks and tower damage mix, then adjusts future wave pressure and enemy composition.
- **Roguelike Dungeon Crawler:** procedural dungeon rooms, tactical enemy chase behavior, loot, visibility radius, and turn-based combat.
- **Tactical Board AI:** compact pawn-tactics board game using minimax with alpha-beta pruning.
- **Stealth Escape:** finite state machine guard behavior with patrol, chase, search, line-of-sight cones, and hiding.
- **Colony Simulator:** agent-style resource scheduler with worker allocation, production chains, and emergency conditions.
