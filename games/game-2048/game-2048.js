class Game2048 extends BaseGame {
  constructor() {
    super('game-2048', '2048 Animated');
    this.modes = {
      easy: {
        key: 'easy',
        label: 'Easy 6×6',
        size: 6,
        target: 2048,
        description: 'Easy 6×6 mode: larger board, more space, easier to win.'
      },
      hard: {
        key: 'hard',
        label: 'Hard 4×4',
        size: 4,
        target: 2048,
        description: 'Hard 4×4 mode: classic board, smaller space, harder to win.'
      }
    };
    this.mode = this.readSavedMode();
    this.bindModeButtons();
  }

  readSavedMode() {
    try {
      return localStorage.getItem('game-2048-mode') === 'hard' ? 'hard' : 'easy';
    } catch (_error) {
      return 'easy';
    }
  }

  saveMode() {
    try {
      localStorage.setItem('game-2048-mode', this.mode);
    } catch (_error) {
      // Game still works when browser storage is blocked.
    }
  }

  bindModeButtons() {
    this.easyBtn = document.getElementById('modeEasy');
    this.hardBtn = document.getElementById('modeHard');
    this.modeText = document.getElementById('modeText');
    this.easyBtn?.addEventListener('click', () => this.setMode('easy'));
    this.hardBtn?.addEventListener('click', () => this.setMode('hard'));
    this.syncModeUI();
  }

  setMode(mode) {
    if (!this.modes[mode] || this.mode === mode) return;
    this.mode = mode;
    this.saveMode();
    this.syncModeUI();
    AudioEngine.play('click');
    this.restart();
  }

  syncModeUI() {
    const active = this.modes[this.mode];
    this.easyBtn?.classList.toggle('active', this.mode === 'easy');
    this.hardBtn?.classList.toggle('active', this.mode === 'hard');
    if (this.modeText) this.modeText.textContent = active.description;
  }

  restart() {
    super.restart();
    this.updateHUD(this.hudData());
  }

  reset() {
    const cfg = this.modes[this.mode];
    this.size = cfg.size;
    this.target = cfg.target;
    this.level = 2;
    this.hasWon = false;
    this.grid = Array.from({ length: this.size }, () => Array(this.size).fill(0));
    this.addTile();
    this.addTile();
    this.syncModeUI();
  }

  addTile() {
    const empty = [];
    for (let y = 0; y < this.size; y++) {
      for (let x = 0; x < this.size; x++) {
        if (!this.grid[y][x]) empty.push({ x, y });
      }
    }
    if (!empty.length) return;
    const p = Utils.choice(empty);
    this.grid[p.y][p.x] = Math.random() < 0.9 ? 2 : 4;
  }

  mergeLine(line) {
    const vals = line.filter(Boolean);
    const merged = [];
    let gained = 0;
    for (let i = 0; i < vals.length; i++) {
      if (vals[i] === vals[i + 1]) {
        const value = vals[i] * 2;
        merged.push(value);
        gained += value;
        i++;
      } else {
        merged.push(vals[i]);
      }
    }
    while (merged.length < this.size) merged.push(0);
    return { line: merged, gained };
  }

  readLine(index, dir) {
    const line = [];
    for (let i = 0; i < this.size; i++) {
      if (dir === 'left') line.push(this.grid[index][i]);
      if (dir === 'right') line.push(this.grid[index][this.size - 1 - i]);
      if (dir === 'up') line.push(this.grid[i][index]);
      if (dir === 'down') line.push(this.grid[this.size - 1 - i][index]);
    }
    return line;
  }

  writeLine(index, dir, line) {
    for (let i = 0; i < this.size; i++) {
      if (dir === 'left') this.grid[index][i] = line[i];
      if (dir === 'right') this.grid[index][this.size - 1 - i] = line[i];
      if (dir === 'up') this.grid[i][index] = line[i];
      if (dir === 'down') this.grid[this.size - 1 - i][index] = line[i];
    }
  }

  move(dir) {
    if (this.over || this.paused || !['left', 'right', 'up', 'down'].includes(dir)) return;
    const before = JSON.stringify(this.grid);
    let gained = 0;

    for (let i = 0; i < this.size; i++) {
      const result = this.mergeLine(this.readLine(i, dir));
      gained += result.gained;
      this.writeLine(i, dir, result.line);
    }

    if (JSON.stringify(this.grid) === before) {
      AudioEngine.play('failure');
      return;
    }

    this.score += gained;
    this.addTile();
    this.level = Math.max(...this.grid.flat());
    this.particles.push(...Utils.makeParticles(400, 290, Math.min(28, 8 + Math.floor(gained / 64)), gained ? '#18e0ff' : '#ffffff'));
    AudioEngine.play(gained ? 'coin' : 'click');

    if (this.level >= this.target && !this.hasWon) {
      this.hasWon = true;
      const modeName = this.modes[this.mode].label;
      this.win(`${modeName} cleared — 2048 reached!`);
      return;
    }

    if (!this.canMove()) {
      this.gameOver('No more moves');
      return;
    }

    this.updateHUD(this.hudData());
  }

  canMove() {
    for (let y = 0; y < this.size; y++) {
      for (let x = 0; x < this.size; x++) {
        if (!this.grid[y][x]) return true;
        if (x + 1 < this.size && this.grid[y][x] === this.grid[y][x + 1]) return true;
        if (y + 1 < this.size && this.grid[y][x] === this.grid[y + 1][x]) return true;
      }
    }
    return false;
  }

  handleDirection(direction) {
    this.move(direction);
  }

  handleAction(action) {
    if (action === 'action') this.setMode(this.mode === 'easy' ? 'hard' : 'easy');
    if (action === 'secondary') this.restart();
  }

  hudData() {
    return {
      Mode: this.modes[this.mode].label,
      Board: `${this.size}×${this.size}`,
      Target: this.target,
      BestTile: this.level
    };
  }

  tileColor(value) {
    if (!value) return 'rgba(255,255,255,.08)';
    const power = Math.log2(value);
    const hue = (power * 27 + (this.mode === 'easy' ? 180 : 28)) % 360;
    const light = value >= 1024 ? 64 : 56;
    return `hsl(${hue}, 82%, ${light}%)`;
  }

  draw() {
    const c = this.ctx;
    const cfg = this.modes[this.mode];
    const boardSize = this.mode === 'easy' ? 492 : 448;
    const cell = boardSize / this.size;
    const ox = (this.canvas.width - boardSize) / 2;
    const oy = this.mode === 'easy' ? 62 : 84;

    c.save();
    c.textAlign = 'center';

    c.fillStyle = 'rgba(24,224,255,.1)';
    Utils.drawRoundRect(c, 170, 16, 460, 34, 14);
    c.fillStyle = '#dff9ff';
    c.font = 'bold 18px system-ui';
    c.textBaseline = 'middle';
    c.fillText(`${cfg.label} · Reach ${this.target}`, 400, 33);

    c.fillStyle = 'rgba(255,255,255,.07)';
    Utils.drawRoundRect(c, ox - 14, oy - 14, boardSize + 28, boardSize + 28, 22);

    c.font = this.size === 6 ? 'bold 24px system-ui' : 'bold 32px system-ui';
    c.textBaseline = 'middle';

    for (let y = 0; y < this.size; y++) {
      for (let x = 0; x < this.size; x++) {
        const v = this.grid[y][x];
        const px = ox + x * cell + 5;
        const py = oy + y * cell + 5;
        const w = cell - 10;
        c.fillStyle = this.tileColor(v);
        Utils.drawRoundRect(c, px, py, w, w, 12);

        if (v) {
          c.fillStyle = valueTextColor(v);
          c.shadowColor = 'rgba(255,255,255,.28)';
          c.shadowBlur = v >= 1024 ? 18 : 0;
          c.fillText(String(v), px + w / 2, py + w / 2);
          c.shadowBlur = 0;
        }
      }
    }

    c.fillStyle = 'rgba(255,255,255,.75)';
    c.font = '13px system-ui';
    c.textBaseline = 'alphabetic';
    c.fillText('Swipe, arrow keys, or WASD to move. ACTION toggles Easy/Hard mode.', 400, 578);
    c.restore();

    function valueTextColor(value) {
      return value >= 128 ? '#08101f' : '#f7fbff';
    }
  }
}

window.currentGame = new Game2048();
window.addEventListener('DOMContentLoaded', () => currentGame.start());
