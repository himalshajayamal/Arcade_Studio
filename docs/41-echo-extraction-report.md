# Game 41 Integration Report — Echo Extraction

## Base used
This build uses `game_arcade_40_locked15_win_rewards.zip` as the base, because that version was confirmed working.

## Locked section
Games 1–15 were not edited. Their individual game folder files were hashed before adding Game 41 and verified after the integration.

## New game
**41. Echo Extraction**

Echo Extraction is not an endless mini-game. It is a mission-based tactical extraction shooter built as a self-contained Canvas game for the existing static browser arcade.

### Core systems implemented
- Top-down tactical facility map with camera scrolling.
- Player movement, sprint/crouch behavior, stamina, armor, health, bleeding, reloads, and limited ammo.
- Loot crates with carry weight, ammo, medkits, armor plates, valuables, and keycard items.
- Mission objective system: find keycard → access server wing → download data core → extract alive.
- Door/terminal interaction system.
- Hazard system with toxic gas, fire, and electric floor zones.
- Enemy AI with patrol, investigate, chase, attack, retreat, and dead states.
- Sound/noise events that attract guards.
- A* navigation grid for AI movement around blockers.
- Tactical line-of-sight ray checks for shooting and perception.
- Reward system with extraction badge, loot value, time bonus, health/armor bonus, and stealth bonus.

### Win condition
The player must recover the data core and reach the extraction zone alive.

### Loss conditions
The player loses if health reaches zero or the raid timer expires.

### Reward
Successful extraction awards the Echo Extraction Badge and saves the final reward score to the leaderboard.

## Architecture compatibility
The game uses the existing arcade shared modules:
- `StorageManager`
- `AudioEngine`
- `InputManager`
- `Utils`
- `BaseGame`

It adds no backend, no `fetch()`, no CDN, and no runtime dependency.
