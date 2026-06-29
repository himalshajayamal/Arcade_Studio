# 40 Game Win Rules and Rewards Report

Games 1-15 were locked and not edited. Games 16-40 were upgraded with explicit victory/defeat rules and visible reward goals.

| # | Game | Winning Rule | Reward |
|---:|---|---|---|
| 16 | Asteroids HD | Clear 3 asteroid sectors | Sector Guardian Medal |
| 17 | Endless Runner Neon | Reach 2500 distance | Neon Marathon Badge |
| 18 | Pac-Man Maze Run | Clear every pellet | Maze Crown |
| 19 | Bomber Arena | Defeat all arena bots | Arena Champion Belt |
| 20 | Neon Racing Drift | Reach 3200 race distance | Drift Cup |
| 21 | Zombie Survival Rush | Destroy 30 zombies | Safehouse Key |
| 22 | Cannon Defender | Destroy 12 incoming targets | Fortress Shield |
| 23 | Bubble Shooter Plus | Clear all bubbles before shots run out | Bubble Crown |
| 24 | Match-3 Quest | Score 1800 points in 30 moves | Gem Quest Trophy |
| 25 | Platformer Adventure | Collect 5 stars and reach the flag | Explorer Star Badge |
| 26 | Mini Golf Challenge | Sink the ball within 6 shots | Golden Putter |
| 27 | Basketball Shot Pro | Score 3 baskets in 10 shots | Hot Hands Trophy |
| 28 | Football Penalty Kick | Score 4 goals from 8 penalties | Penalty Hero Cup |
| 29 | Archery Master | Score 450 points from 10 arrows | Bullseye Medal |
| 30 | Darts Arcade | Score 420 points from 12 darts | Darts Champion Badge |
| 31 | Bowling Strike | Knock down all 10 pins in 2 rolls | Perfect Frame Patch |
| 32 | Chess Lite | Capture the crown within 16 moves | Crown Capture Award |
| 33 | Checkers Classic | Remove all black pieces or block every move | Red Strategy Medal |
| 34 | Connect Four Plus | Connect four discs before the AI | Four-Line Trophy |
| 35 | Tic-Tac-Toe Pro | Make three X marks in a row | Triple-Line Star |
| 36 | Sliding Puzzle HD | Restore the numbered board | Puzzle Master Tile |
| 37 | Sudoku Daily | Complete the sudoku correctly | Logic Grid Badge |
| 38 | Word Search Quest | Find all hidden words | Word Hunter Ribbon |
| 39 | Crossword Mini | Fill every crossword square correctly | Crossword Solver Pen |
| 40 | Mahjong Tiles | Match all solvable tile pairs | Tile Master Jade |

## Validation Summary

- Base used: `game_arcade_40_locked15_plus25.zip` from the previously working 40-game build.
- Locked game folders 1-15: unchanged compared with `game_arcade_15_fixed(1).zip`.
- Locked files checked: 45.
- First 15 lobby metadata entries: unchanged.
- Games upgraded: 16-40 only.
- Each upgraded game now shows a goal and win reward in the side panel.
- Each upgraded game uses explicit win/lose conditions instead of only endless play.
- Static JavaScript syntax check: passed.
- Node DOM/canvas runtime smoke test: passed for lobby and all 40 games.
