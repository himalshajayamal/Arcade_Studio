/** Main lobby with embedded metadata. No runtime network loading so file:// and GitHub Pages both work. */
const GAMES_DATA = [
  {
    "number": 1,
    "id": "snake",
    "title": "Snake Ultimate",
    "category": "Arcade",
    "difficulty": "Easy",
    "thumbnail": "\ud83d\udc0d",
    "description": "Eat food, grow longer, and avoid crashing into walls.",
    "path": "games/snake/index.html",
    "ai": null
  },
  {
    "number": 2,
    "id": "tetris",
    "title": "Tetris Modern",
    "category": "Puzzle",
    "difficulty": "Medium",
    "thumbnail": "\ud83e\uddf1",
    "description": "Rotate and stack falling tetrominoes to clear lines.",
    "path": "games/tetris/index.html",
    "ai": null
  },
  {
    "number": 3,
    "id": "pong",
    "title": "Pong Arena",
    "category": "Sports",
    "difficulty": "Easy",
    "thumbnail": "\ud83c\udfd3",
    "description": "Classic paddle duel against a reactive AI opponent.",
    "path": "games/pong/index.html",
    "ai": null
  },
  {
    "number": 4,
    "id": "breakout",
    "title": "Breakout Extreme",
    "category": "Arcade",
    "difficulty": "Easy",
    "thumbnail": "\ud83e\udde8",
    "description": "Break neon bricks with a fast paddle and bouncing ball.",
    "path": "games/breakout/index.html",
    "ai": null
  },
  {
    "number": 5,
    "id": "space-invaders",
    "title": "Space Invaders Deluxe",
    "category": "Action",
    "difficulty": "Medium",
    "thumbnail": "\ud83d\udc7e",
    "description": "Defend Earth from descending alien waves.",
    "path": "games/space-invaders/index.html",
    "ai": null
  },
  {
    "number": 6,
    "id": "flappy-bird",
    "title": "Flappy Bird Pro",
    "category": "Arcade",
    "difficulty": "Easy",
    "thumbnail": "\ud83d\udc24",
    "description": "Tap to flap through moving pipe gaps.",
    "path": "games/flappy-bird/index.html",
    "ai": null
  },
  {
    "number": 7,
    "id": "game-2048",
    "title": "2048 Animated",
    "category": "Puzzle",
    "difficulty": "Medium",
    "thumbnail": "\ud83d\udd22",
    "description": "Slide matching numbers to reach the highest tile.",
    "path": "games/game-2048/index.html",
    "ai": null
  },
  {
    "number": 8,
    "id": "minesweeper",
    "title": "Minesweeper Advanced",
    "category": "Puzzle",
    "difficulty": "Medium",
    "thumbnail": "\ud83d\udca3",
    "description": "Reveal safe cells and avoid hidden mines.",
    "path": "games/minesweeper/index.html",
    "ai": null
  },
  {
    "number": 9,
    "id": "memory",
    "title": "Memory Match Deluxe",
    "category": "Educational",
    "difficulty": "Easy",
    "thumbnail": "\ud83e\udde0",
    "description": "Flip cards and remember positions to match all pairs.",
    "path": "games/memory/index.html",
    "ai": null
  },
  {
    "number": 10,
    "id": "whack-a-mole",
    "title": "Whack-a-Mole Extreme",
    "category": "Action",
    "difficulty": "Easy",
    "thumbnail": "\ud83d\udd28",
    "description": "Hit moles quickly before the timer ends.",
    "path": "games/whack-a-mole/index.html",
    "ai": null
  },
  {
    "number": 11,
    "id": "adaptive-tower-defense",
    "title": "Adaptive Tower Defense",
    "category": "Strategy",
    "difficulty": "Hard",
    "thumbnail": "\ud83c\udff0",
    "description": "Build towers while an adaptive wave director counters your strategy.",
    "path": "games/adaptive-tower-defense/index.html",
    "ai": "Adaptive director + A*"
  },
  {
    "number": 12,
    "id": "roguelike-dungeon",
    "title": "Roguelike Dungeon Crawler",
    "category": "Strategy",
    "difficulty": "Hard",
    "thumbnail": "\ud83d\udddd\ufe0f",
    "description": "Explore procedural rooms, collect loot, and fight tactical enemies.",
    "path": "games/roguelike-dungeon/index.html",
    "ai": "Procedural AI"
  },
  {
    "number": 13,
    "id": "tactical-board-ai",
    "title": "Tactical Board AI",
    "category": "Strategy",
    "difficulty": "Hard",
    "thumbnail": "\u265f\ufe0f",
    "description": "A minimax AI plans ahead in a compact tactical board duel.",
    "path": "games/tactical-board-ai/index.html",
    "ai": "Minimax"
  },
  {
    "number": 14,
    "id": "stealth-escape",
    "title": "Stealth Escape",
    "category": "Action",
    "difficulty": "Hard",
    "thumbnail": "\ud83d\udd75\ufe0f",
    "description": "Sneak past guards using vision cones, hearing, and patrol state machines.",
    "path": "games/stealth-escape/index.html",
    "ai": "FSM perception"
  },
  {
    "number": 15,
    "id": "colony-simulator",
    "title": "Colony Simulator",
    "category": "Simulation",
    "difficulty": "Hard",
    "thumbnail": "\ud83c\udfed",
    "description": "Manage workers, buildings, resources, and emergency priorities.",
    "path": "games/colony-simulator/index.html",
    "ai": "Agent scheduler"
  },
  {
    "number": 16,
    "id": "asteroids-hd",
    "title": "Asteroids HD",
    "category": "Action",
    "difficulty": "Medium",
    "thumbnail": "\u2604\ufe0f",
    "description": "Pilot a neon ship, split asteroids, and survive the debris field.",
    "path": "games/asteroids-hd/index.html",
    "ai": "Vector thrust shooter"
  },
  {
    "number": 17,
    "id": "endless-runner-neon",
    "title": "Endless Runner Neon",
    "category": "Arcade",
    "difficulty": "Medium",
    "thumbnail": "\ud83c\udfc3",
    "description": "Reach the neon finish distance, dodge hazards, and earn the Marathon Badge.",
    "path": "games/endless-runner-neon/index.html",
    "ai": "Procedural obstacle timing"
  },
  {
    "number": 18,
    "id": "pac-man-maze-run",
    "title": "Pac-Man Maze Run",
    "category": "Arcade",
    "difficulty": "Medium",
    "thumbnail": "\ud83d\udfe1",
    "description": "Clear pellets in a maze while ghosts chase your route.",
    "path": "games/pac-man-maze-run/index.html",
    "ai": "Maze pursuit AI"
  },
  {
    "number": 19,
    "id": "bomber-arena",
    "title": "Bomber Arena",
    "category": "Action",
    "difficulty": "Hard",
    "thumbnail": "\ud83d\udca3",
    "description": "Place bombs, break crates, and defeat arena bots.",
    "path": "games/bomber-arena/index.html",
    "ai": "Grid blast simulation"
  },
  {
    "number": 20,
    "id": "neon-racing-drift",
    "title": "Neon Racing Drift",
    "category": "Sports",
    "difficulty": "Hard",
    "thumbnail": "\ud83c\udfce\ufe0f",
    "description": "Reach the Grand Prix distance target while dodging traffic.",
    "path": "games/neon-racing-drift/index.html",
    "ai": "Reactive traffic"
  },
  {
    "number": 21,
    "id": "zombie-survival-rush",
    "title": "Zombie Survival Rush",
    "category": "Action",
    "difficulty": "Hard",
    "thumbnail": "\ud83e\udddf",
    "description": "Secure the safehouse by destroying 30 zombies before you are overrun.",
    "path": "games/zombie-survival-rush/index.html",
    "ai": "Horde steering"
  },
  {
    "number": 22,
    "id": "cannon-defender",
    "title": "Cannon Defender",
    "category": "Action",
    "difficulty": "Medium",
    "thumbnail": "\ud83c\udfaf",
    "description": "Adjust cannon angle and power to stop incoming targets.",
    "path": "games/cannon-defender/index.html",
    "ai": "Projectile physics"
  },
  {
    "number": 23,
    "id": "bubble-shooter-plus",
    "title": "Bubble Shooter Plus",
    "category": "Puzzle",
    "difficulty": "Easy",
    "thumbnail": "\ud83e\udee7",
    "description": "Aim bubbles into matching clusters to clear the ceiling.",
    "path": "games/bubble-shooter-plus/index.html",
    "ai": "Cluster search"
  },
  {
    "number": 24,
    "id": "match-3-quest",
    "title": "Match-3 Quest",
    "category": "Puzzle",
    "difficulty": "Medium",
    "thumbnail": "\ud83d\udc8e",
    "description": "Swap gems, create chains, and complete the quest score.",
    "path": "games/match-3-quest/index.html",
    "ai": "Match resolver"
  },
  {
    "number": 25,
    "id": "platformer-adventure",
    "title": "Platformer Adventure",
    "category": "Arcade",
    "difficulty": "Hard",
    "thumbnail": "\ud83e\uddd7",
    "description": "Jump across platforms, collect stars, and reach the exit flag.",
    "path": "games/platformer-adventure/index.html",
    "ai": "Side-scroll physics"
  },
  {
    "number": 26,
    "id": "mini-golf-challenge",
    "title": "Mini Golf Challenge",
    "category": "Sports",
    "difficulty": "Medium",
    "thumbnail": "\u26f3",
    "description": "Drag to putt around walls and sink the ball in few shots.",
    "path": "games/mini-golf-challenge/index.html",
    "ai": "2D collision physics"
  },
  {
    "number": 27,
    "id": "basketball-shot-pro",
    "title": "Basketball Shot Pro",
    "category": "Sports",
    "difficulty": "Easy",
    "thumbnail": "\ud83c\udfc0",
    "description": "Pull, aim, and arc the ball into the moving hoop.",
    "path": "games/basketball-shot-pro/index.html",
    "ai": "Trajectory skill"
  },
  {
    "number": 28,
    "id": "football-penalty-kick",
    "title": "Football Penalty Kick",
    "category": "Sports",
    "difficulty": "Easy",
    "thumbnail": "\ud83e\udd45",
    "description": "Pick a target, beat the moving keeper, and score penalties.",
    "path": "games/football-penalty-kick/index.html",
    "ai": "Keeper timing"
  },
  {
    "number": 29,
    "id": "archery-master",
    "title": "Archery Master",
    "category": "Sports",
    "difficulty": "Easy",
    "thumbnail": "\ud83c\udff9",
    "description": "Time your release against moving targets for ring scores.",
    "path": "games/archery-master/index.html",
    "ai": "Moving-target aim"
  },
  {
    "number": 30,
    "id": "darts-arcade",
    "title": "Darts Arcade",
    "category": "Sports",
    "difficulty": "Easy",
    "thumbnail": "\ud83c\udfaf",
    "description": "Freeze the drifting reticle and throw accurate darts.",
    "path": "games/darts-arcade/index.html",
    "ai": "Precision timing"
  },
  {
    "number": 31,
    "id": "bowling-strike",
    "title": "Bowling Strike",
    "category": "Sports",
    "difficulty": "Easy",
    "thumbnail": "\ud83c\udfb3",
    "description": "Aim the lane, launch the ball, and knock down all pins.",
    "path": "games/bowling-strike/index.html",
    "ai": "Pin collision"
  },
  {
    "number": 32,
    "id": "chess-lite",
    "title": "Chess Lite",
    "category": "Strategy",
    "difficulty": "Hard",
    "thumbnail": "\u265e",
    "description": "Use a knight to capture the black crown on a compact board.",
    "path": "games/chess-lite/index.html",
    "ai": "Turn-based AI"
  },
  {
    "number": 33,
    "id": "checkers-classic",
    "title": "Checkers Classic",
    "category": "Strategy",
    "difficulty": "Easy",
    "thumbnail": "\u26ab",
    "description": "Play checkers against a simple capture-first opponent.",
    "path": "games/checkers-classic/index.html",
    "ai": "Move generator"
  },
  {
    "number": 34,
    "id": "connect-four-plus",
    "title": "Connect Four Plus",
    "category": "Puzzle",
    "difficulty": "Easy",
    "thumbnail": "\ud83d\udd34",
    "description": "Drop discs and connect four before the AI blocks you.",
    "path": "games/connect-four-plus/index.html",
    "ai": "Lookahead blocker"
  },
  {
    "number": 35,
    "id": "tic-tac-toe-pro",
    "title": "Tic-Tac-Toe Pro",
    "category": "Puzzle",
    "difficulty": "Easy",
    "thumbnail": "\u274c",
    "description": "Challenge a smart but beatable tic-tac-toe opponent and make three X marks.",
    "path": "games/tic-tac-toe-pro/index.html",
    "ai": "Minimax"
  },
  {
    "number": 36,
    "id": "sliding-puzzle-hd",
    "title": "Sliding Puzzle HD",
    "category": "Puzzle",
    "difficulty": "Medium",
    "thumbnail": "\ud83e\udde9",
    "description": "Slide numbered tiles back into perfect order.",
    "path": "games/sliding-puzzle-hd/index.html",
    "ai": "Solvable shuffle"
  },
  {
    "number": 37,
    "id": "sudoku-daily",
    "title": "Sudoku Daily",
    "category": "Educational",
    "difficulty": "Medium",
    "thumbnail": "\ud83d\udd22",
    "description": "Fill a clean 4x4 sudoku board without conflicts.",
    "path": "games/sudoku-daily/index.html",
    "ai": "Rule validation"
  },
  {
    "number": 38,
    "id": "word-search-quest",
    "title": "Word Search Quest",
    "category": "Educational",
    "difficulty": "Easy",
    "thumbnail": "\ud83d\udd0e",
    "description": "Find hidden words by selecting straight letter paths.",
    "path": "games/word-search-quest/index.html",
    "ai": "Word grid scan"
  },
  {
    "number": 39,
    "id": "crossword-mini",
    "title": "Crossword Mini",
    "category": "Educational",
    "difficulty": "Medium",
    "thumbnail": "\ud83d\udcdd",
    "description": "Type answers into a tiny arcade crossword.",
    "path": "games/crossword-mini/index.html",
    "ai": "Letter validation"
  },
  {
    "number": 40,
    "id": "mahjong-tiles",
    "title": "Mahjong Tiles",
    "category": "Puzzle",
    "difficulty": "Medium",
    "thumbnail": "\ud83c\udc04",
    "description": "Match free tile pairs before the board locks up.",
    "path": "games/mahjong-tiles/index.html",
    "ai": "Free-tile logic"
  },
  {
    "number": 41,
    "id": "echo-extraction",
    "title": "Echo Extraction",
    "category": "Action",
    "difficulty": "Hard",
    "thumbnail": "\ud83c\udf96\ufe0f",
    "description": "A tactical extraction shooter with mission objectives, limited ammo, loot, AI patrols, noise, and mandatory extraction.",
    "path": "games/echo-extraction/index.html",
    "ai": "FSM + A* + extraction loop"
  },
  {
    "number": 42,
    "id": "fracture-jigsaw",
    "title": "Fracture Jigsaw",
    "category": "Puzzle",
    "difficulty": "Medium",
    "thumbnail": "\ud83d\uddbc\ufe0f",
    "description": "Magnetic premium jigsaw puzzle with snapped canvas image pieces and rotation.",
    "path": "games/fracture-jigsaw/index.html",
    "ai": "Magnetic snapping"
  },
  {
    "number": 43,
    "id": "royal-tactics-ai",
    "title": "Royal Tactics AI",
    "category": "Strategy",
    "difficulty": "Hard",
    "thumbnail": "\u265f\ufe0f",
    "description": "Chess-style tactical board game with legal moves and a material-seeking browser AI.",
    "path": "games/royal-tactics-ai/index.html",
    "ai": "Move evaluation"
  },
  {
    "number": 44,
    "id": "cross-sum-cipher",
    "title": "Cross-Sum Cipher",
    "category": "Puzzle",
    "difficulty": "Medium",
    "thumbnail": "\ud83d\udd22",
    "description": "Kakuro-style arithmetic crossword where each run must satisfy sum clues.",
    "path": "games/cross-sum-cipher/index.html",
    "ai": "Constraint logic"
  },
  {
    "number": 45,
    "id": "chromatic-flow",
    "title": "Chromatic Flow",
    "category": "Puzzle",
    "difficulty": "Medium",
    "thumbnail": "\ud83c\udf0a",
    "description": "Connect matching colors and fill every cell without crossing paths.",
    "path": "games/chromatic-flow/index.html",
    "ai": "Spatial constraints"
  },
  {
    "number": 46,
    "id": "vector-surge",
    "title": "Vector Surge",
    "category": "Action",
    "difficulty": "Hard",
    "thumbnail": "\ud83d\ude80",
    "description": "Neon twin-stick arena shooter with waves, gems, multipliers, and grid-warp visuals.",
    "path": "games/vector-surge/index.html",
    "ai": "Wave spawner"
  },
  {
    "number": 47,
    "id": "danmaku-zero",
    "title": "Danmaku Zero",
    "category": "Action",
    "difficulty": "Hard",
    "thumbnail": "\ud83c\udfaf",
    "description": "Bullet-hell boss shooter with graze scoring, bombs, and dense geometric patterns.",
    "path": "games/danmaku-zero/index.html",
    "ai": "Pattern generator"
  },
  {
    "number": 48,
    "id": "volt-court",
    "title": "Volt Court",
    "category": "Sports",
    "difficulty": "Medium",
    "thumbnail": "\u26a1",
    "description": "Neon Pong evolution with AI opponent, powerups, ball trails, and a 7-point set.",
    "path": "games/volt-court/index.html",
    "ai": "Predictive AI"
  },
  {
    "number": 49,
    "id": "pixel-globe",
    "title": "Pixel Globe",
    "category": "Educational",
    "difficulty": "Medium",
    "thumbnail": "\ud83d\uddfa\ufe0f",
    "description": "GeoGuessr-inspired world clue challenge using a clickable map and distance scoring.",
    "path": "games/pixel-globe/index.html",
    "ai": "Haversine scoring"
  },
  {
    "number": 50,
    "id": "primordial-clicker",
    "title": "Primordial Clicker",
    "category": "Simulation",
    "difficulty": "Easy",
    "thumbnail": "\ud83e\uddec",
    "description": "Evolution idle/clicker journey from microbe to technological singularity.",
    "path": "games/primordial-clicker/index.html",
    "ai": "Progression economy"
  },
  {
    "number": 51,
    "id": "lexical-drift",
    "title": "Lexical Drift",
    "category": "Educational",
    "difficulty": "Medium",
    "thumbnail": "\ud83d\udd24",
    "description": "Word ladder challenge: reach the target by changing one letter at a time.",
    "path": "games/lexical-drift/index.html",
    "ai": "Dictionary validation"
  },
  {
    "number": 52,
    "id": "chromatic-ear",
    "title": "Chromatic Ear",
    "category": "Educational",
    "difficulty": "Easy",
    "thumbnail": "\ud83c\udfb5",
    "description": "Musical memory game with synthesized notes and color-note sequences.",
    "path": "games/chromatic-ear/index.html",
    "ai": "Sequence generator"
  },
  {
    "number": 53,
    "id": "void-harvest",
    "title": "Void Harvest",
    "category": "Action",
    "difficulty": "Hard",
    "thumbnail": "\ud83c\udf0c",
    "description": "Asteroid mining action with hull, fuel, cargo, station banking, and upgrades feel.",
    "path": "games/void-harvest/index.html",
    "ai": "Resource loop"
  },
  {
    "number": 54,
    "id": "polarity-wars",
    "title": "Polarity Wars",
    "category": "Strategy",
    "difficulty": "Hard",
    "thumbnail": "\ud83e\uddf2",
    "description": "Physics tower defense where magnets bend and destroy charged particle enemies.",
    "path": "games/polarity-wars/index.html",
    "ai": "Physics simulation"
  },
  {
    "number": 55,
    "id": "pixel-oracle",
    "title": "Pixel Oracle",
    "category": "Puzzle",
    "difficulty": "Medium",
    "thumbnail": "\ud83e\uddff",
    "description": "Nonogram/Picross logic puzzle that reveals hidden pixel art from clues.",
    "path": "games/pixel-oracle/index.html",
    "ai": "Clue generator"
  },
{
  "number": 56,
  "id": "dungeon-sector",
  "title": "Dungeon Sector",
  "category": "Action",
  "difficulty": "Hard",
  "thumbnail": "🔫",
  "description": "High-end pure Canvas raycaster FPS with keycards, enemies, ammo, armor, and multi-sector extraction.",
  "path": "games/dungeon-sector/index.html",
  "ai": "Raycasting + enemy AI"
},
{
  "number": 57,
  "id": "neon-station",
  "title": "Neon Station",
  "category": "Action",
  "difficulty": "Hard",
  "thumbnail": "🚀",
  "description": "Neon tactical shooter with waves, enemy classes, projectiles, shotgun mode, pickups, and boss sentinel.",
  "path": "games/neon-station/index.html",
  "ai": "Wave director + enemy AI"
},
{
  "number": 58,
  "id": "vortex-command",
  "title": "Vortex Command",
  "category": "Action",
  "difficulty": "Hard",
  "thumbnail": "🌌",
  "description": "Software-rendered 3D space combat with asteroids, fighters, missiles, flares, carrier boss, and multiplier scoring.",
  "path": "games/vortex-command/index.html",
  "ai": "3D projection combat"
}
];

class ArcadeLobby {
  constructor() {
    this.games = GAMES_DATA; this.filtered = [...this.games]; this.mode = 'all';
    this.searchInput = document.getElementById('searchInput'); this.categorySelect = document.getElementById('categorySelect'); this.sortSelect = document.getElementById('sortSelect'); this.grid = document.getElementById('gameGrid');
    this.bind(); this.renderCategories(); this.renderStats(); this.filter();
  }
  bind() {
    this.searchInput.addEventListener('input', Utils.debounce(() => this.filter(), 120));
    this.categorySelect.addEventListener('change', () => this.filter()); this.sortSelect.addEventListener('change', () => this.filter());
    document.getElementById('showAllBtn').addEventListener('click', () => { this.mode='all'; this.setActive('showAllBtn'); this.filter(); });
    document.getElementById('favoritesBtn').addEventListener('click', () => { this.mode='favorites'; this.setActive('favoritesBtn'); this.filter(); });
    document.getElementById('statsBtn').addEventListener('click', () => { this.renderStats(true); });
    document.getElementById('contrastBtn').addEventListener('click', () => { document.body.classList.toggle('high-contrast'); StorageManager.saveSetting('highContrast', document.body.classList.contains('high-contrast')); });
    document.getElementById('muteBtn').addEventListener('click', e => { const m = AudioEngine.toggleMute(); e.currentTarget.textContent = m ? 'Unmute' : 'Mute'; AudioEngine.play('click'); });
    if (StorageManager.getSetting('highContrast', false)) document.body.classList.add('high-contrast');
    document.getElementById('muteBtn').textContent = AudioEngine.muted ? 'Unmute' : 'Mute';
  }
  setActive(id) { document.querySelectorAll('.nav-btn').forEach(b => b.classList.toggle('active', b.id === id)); }
  renderCategories() { const cats = ['All', ...new Set(this.games.map(g => g.category))]; this.categorySelect.innerHTML = cats.map(c => `<option value="${c}">${c}</option>`).join(''); }
  filter() {
    const q = this.searchInput.value.trim().toLowerCase(); const cat = this.categorySelect.value;
    this.filtered = this.games.filter(g => (cat === 'All' || g.category === cat) && (!q || `${g.title} ${g.description} ${g.category}`.toLowerCase().includes(q)) && (this.mode !== 'favorites' || StorageManager.isFavorite(g.id)));
    const sort = this.sortSelect.value;
    if (sort === 'name') this.filtered.sort((a,b)=>a.title.localeCompare(b.title));
    if (sort === 'category') this.filtered.sort((a,b)=>a.category.localeCompare(b.category));
    if (sort === 'difficulty') this.filtered.sort((a,b)=>['Easy','Medium','Hard'].indexOf(a.difficulty)-['Easy','Medium','Hard'].indexOf(b.difficulty));
    if (sort === 'order') this.filtered.sort((a,b)=>a.number-b.number);
    this.renderGames(); this.renderStats();
  }
  renderGames() {
    if (!this.filtered.length) { this.grid.innerHTML = '<div class="empty-state"><h2>No matching games</h2><p>Try another category or search.</p></div>'; return; }
    this.grid.innerHTML = this.filtered.map(g => `<article class="game-card"><div class="thumb" aria-hidden="true">${g.thumbnail}</div><div class="game-body"><h3>${String(g.number).padStart(2,'0')}. ${g.title}</h3><p>${g.description}</p><div class="game-meta"><span class="tag">${g.category}</span><span class="tag">${g.difficulty}</span><span class="tag">${g.ai || 'Shared engine'}</span></div><div class="card-actions"><a class="play-link" href="${g.path}">Play</a><button class="favorite-btn ${StorageManager.isFavorite(g.id) ? 'active' : ''}" data-fav="${g.id}" aria-label="Toggle favorite">★</button></div></div></article>`).join('');
    this.grid.querySelectorAll('[data-fav]').forEach(btn => btn.addEventListener('click', () => { StorageManager.toggleFavorite(btn.dataset.fav); this.filter(); AudioEngine.play('coin'); }));
  }
  renderStats(expanded = false) {
    const stats = StorageManager.getStats(); const favorites = this.games.filter(g => StorageManager.isFavorite(g.id)).length;
    document.getElementById('statsPanel').innerHTML = `<h2>Arcade Stats</h2><div class="stat-row"><span>Games</span><strong>${this.games.length}</strong></div><div class="stat-row"><span>Launches</span><strong>${stats.totalLaunches}</strong></div><div class="stat-row"><span>Favorites</span><strong>${favorites}</strong></div><div class="stat-row"><span>Play Time</span><strong>${Utils.formatTime(stats.totalPlayTime)}</strong></div>${expanded ? `<p class="small-note">Recent: ${stats.recentlyPlayed.slice(0,5).join(', ') || 'none yet'}</p>` : ''}`;
  }
}
document.addEventListener('DOMContentLoaded', () => { window.arcade = new ArcadeLobby(); });
