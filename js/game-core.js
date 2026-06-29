/** Shared canvas game shell. Individual games extend BaseGame and keep game-specific logic in their own files. */
class BaseGame {
  constructor(gameId, title) {
    this.gameId = gameId; this.title = title; this.canvas = document.getElementById('gameCanvas'); this.ctx = this.canvas.getContext('2d');
    this.hud = document.getElementById('hud'); this.message = document.getElementById('message'); this.leaderboard = document.getElementById('leaderboard');
    this.input = new InputManager(); this.score = 0; this.level = 1; this.lives = 3; this.running = false; this.paused = false; this.over = false; this.last = 0; this.elapsed = 0; this.particles = [];
    this.boundLoop = this.loop.bind(this); this.boundInput = e => { const a = e.detail.action; if (a === 'pause') this.pause(); else if (a === 'restart') this.restart(); else { this.handleKey(e.detail.originalEvent); if (['up','down','left','right'].includes(a)) this.handleDirection(a); else this.handleAction(a); } };
    window.addEventListener('arcade-input', this.boundInput);
    document.getElementById('pauseBtn')?.addEventListener('click', () => this.pause());
    document.getElementById('restartBtn')?.addEventListener('click', () => this.restart());
    document.getElementById('muteBtn')?.addEventListener('click', e => { const muted = AudioEngine.toggleMute(); e.currentTarget.textContent = muted ? '🔇 Muted' : '🔊 Sound'; });
    document.getElementById('muteBtn') && (document.getElementById('muteBtn').textContent = AudioEngine.muted ? '🔇 Muted' : '🔊 Sound');
  }
  start() { StorageManager.trackPlaySession(this.gameId); this.restart(); }
  restart() { if (this.frame) cancelAnimationFrame(this.frame); this.score = 0; this.level = 1; this.lives = 3; this.elapsed = 0; this.paused = false; this.over = false; this.running = true; this.last = 0; this.reset?.(); this.hideMessage(); this.updateHUD(); this.frame = requestAnimationFrame(this.boundLoop); AudioEngine.play('click'); }
  pause() { if (this.over) return; this.paused = !this.paused; AudioEngine.play('pause'); if (this.paused) this.showMessage('Paused', 'Press P or the Pause button to continue.'); else this.hideMessage(); }
  resume() { if (this.paused) this.pause(); }
  loop(timestamp) { if (!this.running) return; const dt = Math.min(0.033, (timestamp - (this.last || timestamp)) / 1000 || 0); this.last = timestamp; if (!this.paused && !this.over) { this.elapsed += dt; this.update(dt); StorageManager.addPlayTime(this.gameId, dt); } this.drawBackground(); this.draw(); this.particles = Utils.updateParticles(this.particles, dt); Utils.drawParticles(this.ctx, this.particles); this.frame = requestAnimationFrame(this.boundLoop); }
  drawBackground() { const c=this.ctx; c.clearRect(0,0,this.canvas.width,this.canvas.height); c.fillStyle='#061020'; c.fillRect(0,0,this.canvas.width,this.canvas.height); }
  update(_dt) {}
  draw() {}
  handleKey(_event) {}
  handleDirection(_direction) {}
  handleAction(_action) {}
  gameOver(message = 'Game Over') { if (this.over) return; this.over = true; this.running = true; StorageManager.saveScore(this.gameId, this.score, { level:this.level }); this.updateLeaderboard(); this.showMessage(message, `Score: ${Math.floor(this.score)}. Press Restart to play again.`); AudioEngine.play('gameover'); }
  win(message = 'You Win!') { StorageManager.saveAchievement(this.gameId, `win-${this.level}`, `${this.title} victory`); StorageManager.saveScore(this.gameId, this.score, { level:this.level, win:true }); this.updateLeaderboard(); this.showMessage(message, `Score: ${Math.floor(this.score)}. Press Restart for a new run.`); this.over = true; AudioEngine.play('success'); }
  updateHUD(extra = {}) { if (!this.hud) return; const rows = { Score: Math.floor(this.score), Level: this.level, Lives: this.lives, Time: Utils.formatTime(this.elapsed), ...extra }; this.hud.innerHTML = '<h2>HUD</h2>' + Object.entries(rows).map(([k,v]) => `<div class="hud-row"><span>${k}</span><strong>${v}</strong></div>`).join(''); this.updateLeaderboard(); }
  updateLeaderboard() { if (!this.leaderboard) return; const scores = StorageManager.getHighScores(this.gameId); this.leaderboard.innerHTML = '<h2>Leaderboard</h2>' + (scores.length ? scores.slice(0,5).map((s,i)=>`<div class="hud-row"><span>#${i+1}</span><strong>${s.score}</strong></div>`).join('') : '<p class="small-note">No scores yet.</p>'); }
  showMessage(title, body) { if (!this.message) return; this.message.innerHTML = `<div class="message-card"><h2>${title}</h2><p>${body}</p><button class="game-btn" type="button" onclick="window.currentGame.restart()">Restart</button></div>`; this.message.classList.add('show'); }
  hideMessage() { this.message?.classList.remove('show'); }
  pointer(event) { return Utils.getPointer(this.canvas, event); }
}
window.BaseGame = BaseGame;
