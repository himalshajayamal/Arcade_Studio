# Locked 15 + Added 25 Validation Report

Generated: 2026-06-26 13:58:06 UTC

## Base policy
- Base ZIP: `game_arcade_15_fixed(1).zip`.
- Games 1–15 were treated as locked source files.
- No files inside the original 15 game folders were edited.
- Games 16–40 were added as new independent game folders.

## Added games
- 16. Asteroids HD (`games/asteroids-hd/index.html`)
- 17. Endless Runner Neon (`games/endless-runner-neon/index.html`)
- 18. Pac-Man Maze Run (`games/pac-man-maze-run/index.html`)
- 19. Bomber Arena (`games/bomber-arena/index.html`)
- 20. Neon Racing Drift (`games/neon-racing-drift/index.html`)
- 21. Zombie Survival Rush (`games/zombie-survival-rush/index.html`)
- 22. Cannon Defender (`games/cannon-defender/index.html`)
- 23. Bubble Shooter Plus (`games/bubble-shooter-plus/index.html`)
- 24. Match-3 Quest (`games/match-3-quest/index.html`)
- 25. Platformer Adventure (`games/platformer-adventure/index.html`)
- 26. Mini Golf Challenge (`games/mini-golf-challenge/index.html`)
- 27. Basketball Shot Pro (`games/basketball-shot-pro/index.html`)
- 28. Football Penalty Kick (`games/football-penalty-kick/index.html`)
- 29. Archery Master (`games/archery-master/index.html`)
- 30. Darts Arcade (`games/darts-arcade/index.html`)
- 31. Bowling Strike (`games/bowling-strike/index.html`)
- 32. Chess Lite (`games/chess-lite/index.html`)
- 33. Checkers Classic (`games/checkers-classic/index.html`)
- 34. Connect Four Plus (`games/connect-four-plus/index.html`)
- 35. Tic-Tac-Toe Pro (`games/tic-tac-toe-pro/index.html`)
- 36. Sliding Puzzle HD (`games/sliding-puzzle-hd/index.html`)
- 37. Sudoku Daily (`games/sudoku-daily/index.html`)
- 38. Word Search Quest (`games/word-search-quest/index.html`)
- 39. Crossword Mini (`games/crossword-mini/index.html`)
- 40. Mahjong Tiles (`games/mahjong-tiles/index.html`)

## Architecture notes
- No runtime `fetch()` is required by the lobby metadata.
- All added games use local HTML, CSS, JavaScript, Canvas, Web Audio, and localStorage-compatible shared systems.
- Each added game has its own `index.html`, `game-id.css`, and `game-id.js` naming pattern, with game-specific logic.

## Validation gates
- Locked-game hash verification: performed after generation.
- JavaScript syntax check: see final assistant response.
- Browser smoke test: see final assistant response.
