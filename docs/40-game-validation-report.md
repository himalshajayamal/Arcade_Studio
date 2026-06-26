# 40-Game Arcade Validation Report

Generated: 2026-06-26 14:00:59 UTC

## Build decision
This package was rebuilt from `game_arcade_15_fixed(1).zip`, not from the weaker 100-game ZIP.

## Locked first 15 games
- Locked game folders checked: 15
- Locked game files checked by SHA-256: 45
- Changed locked files: 0
- First 15 lobby metadata preserved exactly before adding game 16.

## Added games 16–40
16. Asteroids HD
17. Endless Runner Neon
18. Pac-Man Maze Run
19. Bomber Arena
20. Neon Racing Drift
21. Zombie Survival Rush
22. Cannon Defender
23. Bubble Shooter Plus
24. Match-3 Quest
25. Platformer Adventure
26. Mini Golf Challenge
27. Basketball Shot Pro
28. Football Penalty Kick
29. Archery Master
30. Darts Arcade
31. Bowling Strike
32. Chess Lite
33. Checkers Classic
34. Connect Four Plus
35. Tic-Tac-Toe Pro
36. Sliding Puzzle HD
37. Sudoku Daily
38. Word Search Quest
39. Crossword Mini
40. Mahjong Tiles

## Static validation
- Game folder count: 40
- Metadata IDs: 40 / unique: 40
- Metadata titles: 40 / unique: 40
- Runtime fetch references in JS: 0
- Missing index/css/js files: 0
- Duplicate exact new-game HTML files: 0
- Duplicate exact new-game CSS files: 0
- Duplicate exact new-game JS files: 0

## JavaScript validation
- `node --check` passed for all platform and game JavaScript files.
- Node DOM/canvas smoke test passed for all 40 game entries.

## Browser note
A real Chromium navigation smoke test could not be completed in this sandbox because the container's Chromium is blocked by administrator policy for both `file://` and `localhost` navigation. Static and Node VM checks were completed instead.
