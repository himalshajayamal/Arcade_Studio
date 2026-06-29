/** Unified keyboard, mouse/touch button, swipe input. */
class InputManager {
  constructor() {
    this.pressed = new Set(); this.lastDirection = null; this.actions = new Set(); this.touchStart = null;
    this.keyMap = new Map([
      ['ArrowUp','up'], ['KeyW','up'], ['ArrowDown','down'], ['KeyS','down'], ['ArrowLeft','left'], ['KeyA','left'], ['ArrowRight','right'], ['KeyD','right'],
      ['Space','action'], ['Enter','action'], ['KeyJ','action'], ['KeyK','secondary'], ['ShiftLeft','secondary'], ['ShiftRight','secondary'], ['Escape','pause'], ['KeyP','pause'], ['KeyR','restart']
    ]);
    this.bindKeyboard(); this.bindTouchButtons(); this.bindSwipe();
  }
  bindKeyboard() {
    window.addEventListener('keydown', e => { const action = this.keyMap.get(e.code); if (!action) return; if (['up','down','left','right','action','secondary','pause','restart'].includes(action)) e.preventDefault(); if (!this.pressed.has(action)) this.dispatch(action, e); this.pressed.add(action); if (['up','down','left','right'].includes(action)) this.lastDirection = action; if (['action','secondary','pause','restart'].includes(action)) this.actions.add(action); });
    window.addEventListener('keyup', e => { const action = this.keyMap.get(e.code); if (action) this.pressed.delete(action); });
  }
  bindTouchButtons() {
    document.querySelectorAll('[data-action]').forEach(btn => {
      const action = btn.dataset.action;
      const down = ev => { ev.preventDefault(); this.pressed.add(action); this.lastDirection = ['up','down','left','right'].includes(action) ? action : this.lastDirection; this.actions.add(action); btn.classList.add('active'); this.dispatch(action, ev); };
      const up = ev => { ev.preventDefault(); this.pressed.delete(action); btn.classList.remove('active'); };
      btn.addEventListener('pointerdown', down); btn.addEventListener('pointerup', up); btn.addEventListener('pointerleave', up); btn.addEventListener('pointercancel', up);
    });
  }
  bindSwipe() {
    window.addEventListener('touchstart', e => { if (e.touches.length) this.touchStart = { x:e.touches[0].clientX, y:e.touches[0].clientY }; }, {passive:true});
    window.addEventListener('touchend', e => { if (!this.touchStart || !e.changedTouches.length) return; const t=e.changedTouches[0]; const dx=t.clientX-this.touchStart.x, dy=t.clientY-this.touchStart.y; if (Math.hypot(dx,dy) > 32) { const dir = Math.abs(dx)>Math.abs(dy) ? (dx>0?'right':'left') : (dy>0?'down':'up'); this.lastDirection = dir; this.actions.add(dir); this.dispatch(dir, e); } this.touchStart = null; }, {passive:true});
  }
  dispatch(action, originalEvent) { window.dispatchEvent(new CustomEvent('arcade-input', { detail: { action, originalEvent } })); }
  isPressed(action) { return this.pressed.has(action); }
  consumeAction(action) { if (this.actions.has(action)) { this.actions.delete(action); return true; } return false; }
  getDirection() { if (this.isPressed('left')) return 'left'; if (this.isPressed('right')) return 'right'; if (this.isPressed('up')) return 'up'; if (this.isPressed('down')) return 'down'; const d = this.lastDirection; this.lastDirection = null; return d; }
  getTouchState() { return { pressed: [...this.pressed], lastDirection: this.lastDirection }; }
}
window.InputManager = InputManager;
