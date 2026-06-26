const fs = require('fs');
const path = require('path');
const vm = require('vm');
const root = path.resolve(__dirname, '../..');

function makeContext() {
  const listeners = {};
  const elements = new Map();
  const storage = new Map();
  const ctx2d = new Proxy({}, { get(target, prop) { if (prop === 'createLinearGradient' || prop === 'createRadialGradient') return () => ({ addColorStop(){} }); if (prop === 'measureText') return (t) => ({ width: String(t || '').length * 8 }); if (!(prop in target)) target[prop] = () => {}; return target[prop]; }, set(target, prop, value) { target[prop] = value; return true; } });
  function classList() { return { add(){}, remove(){}, toggle(){ return false; }, contains(){ return false; } }; }
  function element(id) {
    if (elements.has(id)) return elements.get(id);
    const el = {
      id, value: '', textContent: '', innerHTML: '', dataset: {}, style: {}, classList: classList(), children: [],
      addEventListener(type, cb){ (this._listeners ||= {})[type] = cb; },
      removeEventListener(){},
      querySelectorAll(){ return []; },
      querySelector(){ return null; },
      getBoundingClientRect(){ return {left:0, top:0, width:800, height:600}; },
      focus(){},
    };
    if (id === 'gameCanvas') {
      el.width = 800; el.height = 600;
      el.getContext = () => ctx2d;
    }
    elements.set(id, el);
    return el;
  }
  const context = {
    console,
    Math,
    Date,
    JSON,
    setTimeout: (cb) => 1,
    clearTimeout: () => {},
    requestAnimationFrame: () => 1,
    cancelAnimationFrame: () => {},
    CustomEvent: class { constructor(type, init={}) { this.type = type; this.detail = init.detail; } },
    Image: class {},
    localStorage: { getItem:k => storage.has(k)?storage.get(k):null, setItem:(k,v)=>storage.set(k,String(v)), removeItem:k=>storage.delete(k) },
    AudioContext: class { constructor(){ this.currentTime=0; this.destination={}; this.state='running'; } createOscillator(){ return { type:'sine', frequency:{setValueAtTime(){}, value:0}, connect(){}, start(){}, stop(){} }; } createGain(){ return { gain:{setValueAtTime(){}, exponentialRampToValueAtTime(){}}, connect(){} }; } resume(){ return Promise.resolve(); } },
    webkitAudioContext: null,
    document: {
      body: { classList: classList() },
      addEventListener(type, cb){ (listeners[type] ||= []).push(cb); },
      getElementById: element,
      createElement(tag){ const el = element('created-' + tag + '-' + Math.random()); if (tag === 'canvas') { el.width = 800; el.height = 600; el.getContext = () => ctx2d; } return el; },
      querySelectorAll(sel){ if (sel === '.nav-btn') return ['showAllBtn','favoritesBtn','statsBtn','contrastBtn','muteBtn'].map(element); return []; },
      querySelector(){ return null; },
    },
    window: null,
  };
  context.window = context;
  context.addEventListener = (type, cb) => { (listeners[type] ||= []).push(cb); };
  context.removeEventListener = () => {};
  context.dispatchEvent = ev => { (listeners[ev.type] || []).forEach(cb => cb(ev)); };
  context.__dispatchDOMContentLoaded = () => { (listeners.DOMContentLoaded || []).forEach(cb => cb()); };
  return vm.createContext(context);
}
function runScript(ctx, rel) {
  const file = path.join(root, rel);
  vm.runInContext(fs.readFileSync(file, 'utf8'), ctx, { filename: file });
}
function checkLobby() {
  const ctx = makeContext();
  ['js/storage.js','js/audio-engine.js','js/utils.js','js/main.js'].forEach(f => runScript(ctx, f));
  ctx.__dispatchDOMContentLoaded();
  if (!ctx.arcade) throw new Error('Lobby did not create window.arcade');
}
function checkGame(id) {
  const ctx = makeContext();
  ['js/storage.js','js/audio-engine.js','js/utils.js','js/input-manager.js','js/game-core.js',`games/${id}/${id}.js`].forEach(f => runScript(ctx, f));
  ctx.__dispatchDOMContentLoaded();
  if (!ctx.currentGame) throw new Error(`${id} did not create currentGame`);
  const game = ctx.currentGame;
  for (const method of ['start','restart','pause','resume','loop','update','draw','gameOver','handleKey','handleDirection','handleAction']) {
    if (typeof game[method] !== 'function') throw new Error(`${id} missing ${method}`);
  }
  game.update(0.016);
  game.drawBackground();
  game.draw();
}
checkLobby();
const gameIds = fs.readdirSync(path.join(root, 'games')).filter(name => fs.existsSync(path.join(root, 'games', name, `${name}.js`))).sort();
for (const id of gameIds) checkGame(id);
console.log(`Runtime smoke check passed for lobby and ${gameIds.length} games.`);
