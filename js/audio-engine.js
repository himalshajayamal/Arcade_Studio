/** Procedural Web Audio engine: no MP3/WAV/external assets.
 * Robust patch: avoids browser autoplay warnings by waiting for a real user gesture,
 * catches WebAudio failures, and never breaks gameplay when sound is unavailable.
 */
class AudioEngine {
  static ctx = null;
  static unlocked = false;
  static muted = window.StorageManager ? StorageManager.getSetting('muted', false) : false;
  static volume = window.StorageManager ? StorageManager.getSetting('volume', 0.18) : 0.18;
  static _unlockBound = false;

  static setupUnlockHandlers() {
    if (this._unlockBound || typeof window === 'undefined') return;
    this._unlockBound = true;
    const unlock = () => this.unlock();
    window.addEventListener('pointerdown', unlock, { passive: true });
    window.addEventListener('keydown', unlock, { passive: true });
    window.addEventListener('touchstart', unlock, { passive: true });
  }

  static canStartNow() {
    try {
      return !!(navigator.userActivation?.hasBeenActive || navigator.userActivation?.isActive);
    } catch { return true; }
  }

  static ensure() {
    try {
      if (this.ctx) return this.ctx;
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      if (!this.canStartNow()) { this.setupUnlockHandlers(); return null; }
      this.ctx = new AC();
      return this.ctx;
    } catch { return null; }
  }

  static unlock() {
    if (this.muted) return;
    const ctx = this.ensure();
    if (!ctx) return;
    try {
      if (ctx.state === 'suspended') ctx.resume().catch(() => {});
      this.unlocked = true;
    } catch {}
  }

  static setMuted(value) {
    this.muted = !!value;
    if (window.StorageManager) StorageManager.saveSetting('muted', this.muted);
  }

  static toggleMute() {
    this.setMuted(!this.muted);
    if (!this.muted) this.unlock();
    return this.muted;
  }

  static play(type = 'click') {
    if (this.muted) return;
    const ctx = this.ensure();
    if (!ctx) return;
    try { if (ctx.state === 'suspended') ctx.resume().catch(() => {}); } catch {}
    const now = ctx.currentTime || 0;
    const patterns = {
      click: [[520,.035,'square']],
      coin: [[720,.06,'triangle'],[960,.08,'triangle',.055]],
      jump: [[320,.08,'sine'],[500,.10,'sine',.045]],
      shoot: [[680,.05,'sawtooth']],
      explosion: [[90,.18,'sawtooth'],[55,.22,'square',.02]],
      powerup: [[420,.06,'sine'],[650,.08,'triangle',.055],[920,.09,'sine',.1]],
      success: [[520,.08,'triangle'],[780,.10,'triangle',.08],[1040,.10,'sine',.16]],
      failure: [[220,.12,'sawtooth'],[120,.18,'sawtooth',.08]],
      pause: [[260,.08,'square']],
      gameover: [[240,.12,'sawtooth'],[160,.18,'sawtooth',.09],[90,.25,'sawtooth',.2]],
      reward: [[660,.07,'triangle'],[880,.09,'triangle',.08],[1180,.12,'sine',.17]],
      warning: [[180,.06,'square'],[180,.06,'square',.12]]
    };
    for (const [freq, dur, wave, delay = 0] of (patterns[type] || patterns.click)) {
      try {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = wave;
        osc.frequency.setValueAtTime(freq, now + delay);
        gain.gain.setValueAtTime(Math.max(0.001, this.volume), now + delay);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + delay + dur);
        osc.connect(gain); gain.connect(ctx.destination);
        osc.start(now + delay); osc.stop(now + delay + dur + .02);
      } catch {}
    }
  }
}
AudioEngine.setupUnlockHandlers();
window.AudioEngine = AudioEngine;
