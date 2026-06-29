/* Arcade Studio feedback/contact widget. UI-only: no gameplay logic is changed. */
(function () {
  'use strict';

  const BRAND_NAME = 'Arcade Studio';
  const WHATSAPP_LINK = 'https://wa.me/qr/OEXDJSTK2RJ3G1';
  const GAMES = [
  {
    "number": 1,
    "id": "snake",
    "title": "Snake Ultimate",
    "path": "games/snake/index.html"
  },
  {
    "number": 2,
    "id": "tetris",
    "title": "Tetris Modern",
    "path": "games/tetris/index.html"
  },
  {
    "number": 3,
    "id": "pong",
    "title": "Pong Arena",
    "path": "games/pong/index.html"
  },
  {
    "number": 4,
    "id": "breakout",
    "title": "Breakout Extreme",
    "path": "games/breakout/index.html"
  },
  {
    "number": 5,
    "id": "space-invaders",
    "title": "Space Invaders Deluxe",
    "path": "games/space-invaders/index.html"
  },
  {
    "number": 6,
    "id": "flappy-bird",
    "title": "Flappy Bird Pro",
    "path": "games/flappy-bird/index.html"
  },
  {
    "number": 7,
    "id": "game-2048",
    "title": "2048 Animated",
    "path": "games/game-2048/index.html"
  },
  {
    "number": 8,
    "id": "minesweeper",
    "title": "Minesweeper Advanced",
    "path": "games/minesweeper/index.html"
  },
  {
    "number": 9,
    "id": "memory",
    "title": "Memory Match Deluxe",
    "path": "games/memory/index.html"
  },
  {
    "number": 10,
    "id": "whack-a-mole",
    "title": "Whack-a-Mole Extreme",
    "path": "games/whack-a-mole/index.html"
  },
  {
    "number": 11,
    "id": "adaptive-tower-defense",
    "title": "Adaptive Tower Defense",
    "path": "games/adaptive-tower-defense/index.html"
  },
  {
    "number": 12,
    "id": "roguelike-dungeon",
    "title": "Roguelike Dungeon Crawler",
    "path": "games/roguelike-dungeon/index.html"
  },
  {
    "number": 13,
    "id": "tactical-board-ai",
    "title": "Tactical Board AI",
    "path": "games/tactical-board-ai/index.html"
  },
  {
    "number": 14,
    "id": "stealth-escape",
    "title": "Stealth Escape",
    "path": "games/stealth-escape/index.html"
  },
  {
    "number": 15,
    "id": "colony-simulator",
    "title": "Colony Simulator",
    "path": "games/colony-simulator/index.html"
  },
  {
    "number": 16,
    "id": "asteroids-hd",
    "title": "Asteroids HD",
    "path": "games/asteroids-hd/index.html"
  },
  {
    "number": 17,
    "id": "endless-runner-neon",
    "title": "Endless Runner Neon",
    "path": "games/endless-runner-neon/index.html"
  },
  {
    "number": 18,
    "id": "pac-man-maze-run",
    "title": "Pac-Man Maze Run",
    "path": "games/pac-man-maze-run/index.html"
  },
  {
    "number": 19,
    "id": "bomber-arena",
    "title": "Bomber Arena",
    "path": "games/bomber-arena/index.html"
  },
  {
    "number": 20,
    "id": "neon-racing-drift",
    "title": "Neon Racing Drift",
    "path": "games/neon-racing-drift/index.html"
  },
  {
    "number": 21,
    "id": "zombie-survival-rush",
    "title": "Zombie Survival Rush",
    "path": "games/zombie-survival-rush/index.html"
  },
  {
    "number": 22,
    "id": "cannon-defender",
    "title": "Cannon Defender",
    "path": "games/cannon-defender/index.html"
  },
  {
    "number": 23,
    "id": "bubble-shooter-plus",
    "title": "Bubble Shooter Plus",
    "path": "games/bubble-shooter-plus/index.html"
  },
  {
    "number": 24,
    "id": "match-3-quest",
    "title": "Match-3 Quest",
    "path": "games/match-3-quest/index.html"
  },
  {
    "number": 25,
    "id": "platformer-adventure",
    "title": "Platformer Adventure",
    "path": "games/platformer-adventure/index.html"
  },
  {
    "number": 26,
    "id": "mini-golf-challenge",
    "title": "Mini Golf Challenge",
    "path": "games/mini-golf-challenge/index.html"
  },
  {
    "number": 27,
    "id": "basketball-shot-pro",
    "title": "Basketball Shot Pro",
    "path": "games/basketball-shot-pro/index.html"
  },
  {
    "number": 28,
    "id": "football-penalty-kick",
    "title": "Football Penalty Kick",
    "path": "games/football-penalty-kick/index.html"
  },
  {
    "number": 29,
    "id": "archery-master",
    "title": "Archery Master",
    "path": "games/archery-master/index.html"
  },
  {
    "number": 30,
    "id": "darts-arcade",
    "title": "Darts Arcade",
    "path": "games/darts-arcade/index.html"
  },
  {
    "number": 31,
    "id": "bowling-strike",
    "title": "Bowling Strike",
    "path": "games/bowling-strike/index.html"
  },
  {
    "number": 32,
    "id": "chess-lite",
    "title": "Chess Lite",
    "path": "games/chess-lite/index.html"
  },
  {
    "number": 33,
    "id": "checkers-classic",
    "title": "Checkers Classic",
    "path": "games/checkers-classic/index.html"
  },
  {
    "number": 34,
    "id": "connect-four-plus",
    "title": "Connect Four Plus",
    "path": "games/connect-four-plus/index.html"
  },
  {
    "number": 35,
    "id": "tic-tac-toe-pro",
    "title": "Tic-Tac-Toe Pro",
    "path": "games/tic-tac-toe-pro/index.html"
  },
  {
    "number": 36,
    "id": "sliding-puzzle-hd",
    "title": "Sliding Puzzle HD",
    "path": "games/sliding-puzzle-hd/index.html"
  },
  {
    "number": 37,
    "id": "sudoku-daily",
    "title": "Sudoku Daily",
    "path": "games/sudoku-daily/index.html"
  },
  {
    "number": 38,
    "id": "word-search-quest",
    "title": "Word Search Quest",
    "path": "games/word-search-quest/index.html"
  },
  {
    "number": 39,
    "id": "crossword-mini",
    "title": "Crossword Mini",
    "path": "games/crossword-mini/index.html"
  },
  {
    "number": 40,
    "id": "mahjong-tiles",
    "title": "Mahjong Tiles",
    "path": "games/mahjong-tiles/index.html"
  },
  {
    "number": 41,
    "id": "echo-extraction",
    "title": "Echo Extraction",
    "path": "games/echo-extraction/index.html"
  },
  {
    "number": 42,
    "id": "fracture-jigsaw",
    "title": "Fracture Jigsaw",
    "path": "games/fracture-jigsaw/index.html"
  },
  {
    "number": 43,
    "id": "royal-tactics-ai",
    "title": "Royal Tactics AI",
    "path": "games/royal-tactics-ai/index.html"
  },
  {
    "number": 44,
    "id": "cross-sum-cipher",
    "title": "Cross-Sum Cipher",
    "path": "games/cross-sum-cipher/index.html"
  },
  {
    "number": 45,
    "id": "chromatic-flow",
    "title": "Chromatic Flow",
    "path": "games/chromatic-flow/index.html"
  },
  {
    "number": 46,
    "id": "vector-surge",
    "title": "Vector Surge",
    "path": "games/vector-surge/index.html"
  },
  {
    "number": 47,
    "id": "danmaku-zero",
    "title": "Danmaku Zero",
    "path": "games/danmaku-zero/index.html"
  },
  {
    "number": 48,
    "id": "volt-court",
    "title": "Volt Court",
    "path": "games/volt-court/index.html"
  },
  {
    "number": 49,
    "id": "pixel-globe",
    "title": "Pixel Globe",
    "path": "games/pixel-globe/index.html"
  },
  {
    "number": 50,
    "id": "primordial-clicker",
    "title": "Primordial Clicker",
    "path": "games/primordial-clicker/index.html"
  },
  {
    "number": 51,
    "id": "lexical-drift",
    "title": "Lexical Drift",
    "path": "games/lexical-drift/index.html"
  },
  {
    "number": 52,
    "id": "chromatic-ear",
    "title": "Chromatic Ear",
    "path": "games/chromatic-ear/index.html"
  },
  {
    "number": 53,
    "id": "void-harvest",
    "title": "Void Harvest",
    "path": "games/void-harvest/index.html"
  },
  {
    "number": 54,
    "id": "polarity-wars",
    "title": "Polarity Wars",
    "path": "games/polarity-wars/index.html"
  },
  {
    "number": 55,
    "id": "pixel-oracle",
    "title": "Pixel Oracle",
    "path": "games/pixel-oracle/index.html"
  },
  {
    "number": 56,
    "id": "dungeon-sector",
    "title": "Dungeon Sector",
    "path": "games/dungeon-sector/index.html"
  },
  {
    "number": 57,
    "id": "neon-station",
    "title": "Neon Station",
    "path": "games/neon-station/index.html"
  },
  {
    "number": 58,
    "id": "vortex-command",
    "title": "Vortex Command",
    "path": "games/vortex-command/index.html"
  }
];

  function normalizePath(value) {
    return String(value || '').replace(/\\/g, '/').replace(/^file:\/\//, '').replace(/\?.*$/, '').replace(/#.*$/, '');
  }

  function isGamePage() {
    return normalizePath(location.pathname).includes('/games/') || normalizePath(location.href).includes('/games/');
  }

  function assetPrefix() {
    return isGamePage() ? '../../' : '';
  }

  function currentGame() {
    const path = normalizePath(location.pathname || location.href);
    const href = normalizePath(location.href);
    let found = GAMES.find(game => path.endsWith('/' + game.path) || path.endsWith(game.path) || href.includes(game.path));
    if (found) return found;
    if (!isGamePage()) return { number: 'Lobby', id: 'lobby', title: 'Arcade Studio Lobby', path: 'index.html' };
    const title = (document.querySelector('.title-block h1') || document.querySelector('h1') || document.querySelector('title'));
    return { number: 'Unknown', id: 'unknown', title: title ? title.textContent.replace(/\s+-\s+Game Arcade/i, '').trim() : 'Unknown Game', path: normalizePath(location.pathname).split('/').slice(-3).join('/') };
  }

  function twoDigit(number) {
    if (typeof number === 'number') return String(number).padStart(2, '0');
    return String(number);
  }

  function feedbackMessage(game) {
    return [
      'Arcade Studio Feedback',
      '',
      'Game No: ' + twoDigit(game.number),
      'Game Name: ' + game.title,
      'Game URL: ' + game.path,
      '',
      'Comment:'
    ].join('\n');
  }

  function buildWhatsAppUrl(message) {
    const encoded = encodeURIComponent(message);
    return WHATSAPP_LINK + (WHATSAPP_LINK.includes('?') ? '&' : '?') + 'text=' + encoded;
  }

  function toast(message) {
    const old = document.querySelector('.feedback-toast');
    if (old) old.remove();
    const node = document.createElement('div');
    node.className = 'feedback-toast';
    node.textContent = message;
    document.body.appendChild(node);
    window.setTimeout(() => node.remove(), 3200);
  }

  async function copyMessage(message) {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(message);
        return true;
      }
    } catch (error) {}
    try {
      const area = document.createElement('textarea');
      area.value = message;
      area.setAttribute('readonly', '');
      area.style.position = 'fixed';
      area.style.left = '-9999px';
      document.body.appendChild(area);
      area.select();
      const ok = document.execCommand('copy');
      area.remove();
      return ok;
    } catch (error) {
      return false;
    }
  }

  function openFeedback(event) {
    const game = currentGame();
    const message = feedbackMessage(game);
    const url = buildWhatsAppUrl(message);
    copyMessage(message).then(copied => {
      if (copied) toast('Feedback message copied. WhatsApp is opening — paste if the QR link does not auto-fill.');
      else toast('WhatsApp is opening. Game details are prepared in the link.');
      window.open(url, '_blank', 'noopener,noreferrer');
    });
    if (event) event.preventDefault();
  }

  function enhanceHeaderBrand() {
    const brand = document.querySelector('.site-header .brand');
    if (!brand || brand.dataset.feedbackBrandEnhanced === 'true') return;
    brand.dataset.feedbackBrandEnhanced = 'true';
    brand.innerHTML = '';
    const img = document.createElement('img');
    img.className = 'brand-logo';
    img.src = assetPrefix() + 'assets/brand/logo.png';
    img.alt = BRAND_NAME + ' logo';
    const stack = document.createElement('span');
    stack.className = 'brand-title-stack';
    stack.innerHTML = '<strong>' + BRAND_NAME + '</strong><small>Browser Game Arcade</small>';
    brand.append(img, stack);
  }

  function installFeedbackFooter() {
    if (document.querySelector('.feedback-footer')) return;
    const game = currentGame();
    const footer = document.createElement('footer');
    footer.className = 'feedback-footer';
    footer.innerHTML = `
      <div class="feedback-brand">
        <img src="${assetPrefix()}assets/brand/logo.png" alt="${BRAND_NAME} logo">
        <div>
          <strong>${BRAND_NAME}</strong>
          <span>Give me your honest idea about this game. Report bugs, balance problems, confusing controls, or anything you want improved.</span>
        </div>
      </div>
      <a class="feedback-btn" href="${buildWhatsAppUrl(feedbackMessage(game))}" target="_blank" rel="noopener noreferrer">💬 Send Feedback</a>
    `;
    const button = footer.querySelector('.feedback-btn');
    button.addEventListener('click', openFeedback);
    document.body.appendChild(footer);
  }

  function init() {
    enhanceHeaderBrand();
    installFeedbackFooter();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

  window.ArcadeFeedback = { currentGame, feedbackMessage, buildWhatsAppUrl };
})();
